import { addIndex, flatten, map, path, take } from 'ramda'
import type { ReactNode } from 'react'
import React, { useEffect, useState } from 'react'
import { Image, View } from 'react-native'

import type { ImageRequireSource, ImageStyle, ImageURISource, ViewStyle } from 'react-native'
import OverlayBlock from './components/OverlayBlock'
export { XYtoBoundary, cloudVisionToML } from './utils/converter'
// import type { CloudML } from './utils/converter';
const mapIndexed = addIndex(map)
export interface MLTextOverlayProps {
  bounding?: Bounding
  frame?: Bounding
  cornerPoints?: CornerPoint[]
  lines?: Line[]
  text: string
  locale?: string
}
export interface Bounding {
  height: number
  left: number
  top: number
  width: number
}

export interface CornerPoint {
  x: number
  y: number
}

export interface Element {
  bounding?: Bounding
  frame?: Bounding
  cornerPoints: CornerPoint[]
  text: string
}

export interface Line extends MLTextOverlayProps {
  elements: Element[]
}

export interface OverlayProps {
  blockIcon?: (x: { done: boolean; error: boolean }) => ReactNode
  blockPadding?: number
  blockStyle?: ViewStyle
  depth?: 1 | 2 | 3
  hideDone?: boolean
  zoom?: boolean
  boundingKey?: 'bounding' | 'frame'
  imageSource: ImageRequireSource | ImageURISource
  imageStyle?: ImageStyle
  itemsDone?: number[]
  itemsError?: number[]
  limit?: number
  doneStyle?: ViewStyle
  errorStyle?: ViewStyle
  ocrResults?: MLTextOverlayProps[]
  onPress?: (x: { block: MLTextOverlayProps | Element | Line; index: number }) => void
  onError?: (e: Error) => void
  padding?: number
}
const getRenderPath = (
  depth: number = 1,
  ocrResults: MLTextOverlayProps[]
): MLTextOverlayProps[] | Line[] | Element[] => {
  switch (depth) {
    case 2:
      return flatten(map(path(['lines']), ocrResults) as Line[])
    case 3:
      return flatten(
        map(path(['elements']), flatten(map(path(['lines']), ocrResults) as Line[])) as Element[]
      )
    default:
      return ocrResults
  }
}

export interface CalcResult {
  width: number
  height: number
  aspectRatio: number
}
export interface BlockCalc extends CalcResult {
  xRatio: number
  yRatio: number
  diffHeight: number
}
const MLOverlay = ({
  blockIcon,
  blockPadding,
  boundingKey,
  blockStyle,
  depth = 1,
  doneStyle = {},
  errorStyle = {},
  hideDone = false,
  imageSource,
  imageStyle = {},
  itemsDone = [],
  itemsError = [],
  limit = 100,
  ocrResults,
  onError,
  onPress,
  padding = 1,
}: OverlayProps) => {
  const [fullSize, setFullSize] = useState<CalcResult>()
  const [rootSize, setRootSize] = useState<CalcResult>()
  const [calSized, setCalSized] = useState<BlockCalc>()
  const [renderData, setRenderData] = useState<{
    data: MLTextOverlayProps[] | Line[] | Element[]
  }>()

  useEffect(() => {
    if (typeof imageSource !== 'number' && imageSource.uri) {
      Image.getSize(
        imageSource.uri,
        (width, height) => {
          setFullSize({ width, height, aspectRatio: width / height })
        },
        (err) => {
          onError && onError(err)
        }
      )
    } else {
      try {
        const { width, height } = Image.resolveAssetSource(imageSource)
        setFullSize({ width, height, aspectRatio: width / height })
      } catch (err) {
        onError && onError(err as Error)
      }
    }
  }, [])

  useEffect(() => {
    if (fullSize && rootSize) {
      const xRatio = rootSize.width / fullSize.width
      const width = rootSize.width
      const height = fullSize.height * xRatio
      const yRatio = height / fullSize.height
      const diffHeight = rootSize.height - height
      const out = {
        width,
        height,
        xRatio,
        yRatio,
        aspectRatio: width / height,
        diffHeight,
      }
      setCalSized(out)
    }
  }, [rootSize, fullSize, padding])

  useEffect(() => {
    if (ocrResults) {
      const getRenderData = getRenderPath(depth, ocrResults)
      const renderSize = getRenderData?.length
      const slicedData = take(limit ? limit : renderSize, getRenderData)
      setRenderData({ data: slicedData })
    }
  }, [limit, ocrResults, depth])

  const out = React.useMemo(() => {
    const items = (
      <View>
        <Image
          source={imageSource}
          style={[
            {
              width: calSized?.width,
              height: calSized?.height,
            },
            imageStyle,
          ]}
        />
        {calSized &&
          renderData?.data &&
          mapIndexed((block, index: number) => {
            const done = itemsDone?.includes(index)
            const ds = done ? doneStyle : {}
            const error = itemsError?.includes(index)
            const es = error ? errorStyle : {}
            return done && hideDone ? null : (
              <OverlayBlock
                block={block as MLTextOverlayProps}
                index={index as number}
                key={index}
                boundingKey={boundingKey}
                size={calSized}
                done={done}
                error={error}
                blockPadding={blockPadding}
                blockStyle={error ? { ...blockStyle, ...es } : { ...blockStyle, ...ds }}
                onPress={onPress}
                blockIcon={blockIcon}
              />
            )
          }, renderData?.data)}
      </View>
    )
    return items
  }, [calSized, renderData, itemsDone, itemsError])

  return (
    <View
      onLayout={({ nativeEvent }) => {
        const { width, height } = nativeEvent.layout
        setRootSize({ width, height, aspectRatio: width / height })
      }}
      style={{
        margin: padding,
        height: calSized?.height,
        alignSelf: 'stretch',
      }}
    >
      {out}
    </View>
  )
}
export default MLOverlay
