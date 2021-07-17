import React, { ReactChild, useEffect, useState } from 'react'
import {
  Dimensions,
  Image,
  ImageStyle,
  StyleSheet,
  View,
  ViewStyle,
  ImageURISource,
  ImageRequireSource,
} from 'react-native'
import OverlayBlock, { AnimationProps } from './components/OverlayBlock'
const { width: screenWidth } = Dimensions.get('window')
import { map, addIndex, path, flatten, take } from 'ramda'
export { cloudVisionToML, XYtoBoundary, CloudML } from './utils/converter'
const mapIndexed = addIndex(map)
export interface MLTextOverlay {
  bounding?: Bounding
  cornerPoints: CornerPoint[]
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
  bounding: Bounding
  cornerPoints: CornerPoint[]
  text: string
}

export interface Line extends MLTextOverlay {
  elements: Element[]
}

export interface OverlayProps {
  animation?: AnimationProps
  blockIcon?: (x: { done: boolean }) => ReactChild
  blockPadding?: number
  blockStyle?: ViewStyle
  depth?: 1 | 2 | 3
  hideDone?: boolean
  imageSource: ImageRequireSource | ImageURISource
  imageStyle?: ImageStyle
  itemsDone?: number[]
  limit?: number
  ocrResults: MLTextOverlay[]
  onPress?: (x: { block: MLTextOverlay | Element | Line; index: number }) => void
  padding?: number
}
const getRenderPath = (
  depth: number = 1,
  ocrResults: MLTextOverlay[]
): MLTextOverlay[] | Line[] | Element[] => {
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
const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  layoverImageWrapper: {
    position: 'relative',
    flex: 1,
  },
})
export interface CalcResult {
  width: number
  height: number
  aspectRatio: number
}
interface BlockCalc extends CalcResult {
  xRatio: number
  yRatio: number
  diffWidth: number
  diffHeight: number
}
const MLOverlay = ({
  animation,
  blockIcon,
  blockPadding,
  blockStyle,
  depth = 1,
  hideDone = false,
  imageSource,
  imageStyle = {},
  itemsDone = [],
  limit = 100,
  ocrResults,
  onPress,
  padding = 1,
}: OverlayProps) => {
  const [fullSize, setFullSize] = useState<CalcResult>()
  const [rootSize, setRootSize] = useState<CalcResult>()
  const [imageSize, setImageSize] = useState<CalcResult>()
  const [calSized, setCalSized] = useState<BlockCalc>()
  const [renderData, setRenderData] =
    useState<{ data: MLTextOverlay[] | Line[] | Element[]; animate: boolean }>()
  imageSource
  useEffect(() => {
    if (typeof imageSource !== 'number' && imageSource.uri) {
      Image.getSize(
        imageSource.uri,
        (width, height) => {
          setFullSize({ width, height, aspectRatio: width / height })
        },
        (err) => {
          console.log(err)
        }
      )
    } else {
      const { width, height } = Image.resolveAssetSource(imageSource)
      setFullSize({ width, height, aspectRatio: width / height })
    }
  }, [])
  useEffect(() => {
    if (fullSize?.height && imageSize?.height && rootSize?.height) {
      console.log('fullSize', { rootSize, fullSize, imageSize })
      const diffWidth =
        rootSize?.width - imageSize.width > 0 ? rootSize?.width - imageSize.width + padding / 2 : 1

      const xRatio = imageSize.width / fullSize.width
      const width = imageSize.width
      const height = fullSize.height * xRatio
      const yRatio = height / fullSize.height
      const diffHeight = imageSize.height - height
      const out = {
        width,
        height,
        xRatio,
        yRatio,
        aspectRatio: width / height,
        diffWidth,
        diffHeight,
      }

      console.log('out', out)
      setCalSized(out)
    }
  }, [rootSize, imageSize, imageSize, padding])

  useEffect(() => {
    const getRenderData = getRenderPath(depth, ocrResults)
    const renderSize = getRenderData.length
    const slicedData = take(limit ? limit : renderSize, getRenderData)
    setRenderData({ data: slicedData, animate: renderSize < 100 })
  }, [limit, ocrResults, depth])
  return (
    <View
      style={[
        styles.wrapper,
        {
          padding,
        },
      ]}
      onLayout={({ nativeEvent }) => {
        const { width, height } = nativeEvent.layout
        setRootSize({ width, height, aspectRatio: width / height })
      }}
    >
      <View style={[styles.layoverImageWrapper]}>
        <Image
          style={[
            {
              flex: 1,
              // aspectRatio: fullSize?.aspectRatio,
              maxWidth: screenWidth - padding,
            },
            imageStyle,
          ]}
          resizeMode={'contain'}
          source={imageSource}
          onLayout={({ nativeEvent }) => {
            console.log('nativeEvent', nativeEvent)
            const { width, height } = nativeEvent.layout
            setImageSize({ width, height, aspectRatio: width / height })
          }}
        />
        {calSized &&
          renderData?.data &&
          mapIndexed((block, index) => {
            const done = itemsDone.includes(index)

            return done && hideDone ? null : (
              <OverlayBlock
                block={block as MLTextOverlay}
                index={index as number}
                key={index}
                size={calSized}
                done={done}
                blockPadding={blockPadding}
                blockStyle={blockStyle}
                onPress={onPress}
                blockIcon={blockIcon}
                animate={renderData?.animate}
                animation={animation}
              />
            )
          }, renderData?.data)}
      </View>
    </View>
  )
}
export default MLOverlay
