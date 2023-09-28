import React, { ReactNode } from 'react'
import { StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native'
import type { BlockCalc, Element, Line, Bounding, MLTextOverlayProps } from '../'

const styles = StyleSheet.create({
  blockDefault: {
    zIndex: 2,
    position: 'relative',
  },
})
export interface AnimationProps {
  type?: string
  duration?: number
  delay?: number
  infinite?: boolean
}
export interface OverlayBlockProps {
  block: MLTextOverlayProps | Element
  index: number
  blockPadding?: number
  padding?: number
  boundingKey?: 'bounding' | 'frame'
  onPress?: (x: { block: MLTextOverlayProps | Element | Line; index: number }) => void
  blockStyle?: ViewStyle
  done: boolean
  error: boolean
  blockIcon?: (x: { done: boolean; error: boolean }) => ReactNode
  size: BlockCalc
}
const OverlayBlock = ({
  block,
  index,
  onPress,
  blockPadding = 20,
  size,
  error,
  boundingKey = 'bounding',
  blockIcon,
  done,
  blockStyle,
}: OverlayBlockProps) => {
  const { xRatio, yRatio } = size
  if (!boundingKey || !block?.[boundingKey]) {
    return <View />
  }
  let bb = block?.[boundingKey] as Bounding
  const calHeight = bb?.height * xRatio + (blockPadding ? blockPadding / 2 : 0)
  const calWidth = bb?.width * yRatio + (blockPadding ? blockPadding / 2 : 0)
  const left = bb?.left * xRatio - (blockPadding ? blockPadding / 4 : 0)
  const top = bb?.top * yRatio - (blockPadding ? blockPadding / 4 : 0)

  const out = (
    <View
      style={[
        {
          height: calHeight,
          width: calWidth,
        },
        styles.blockDefault,
        blockStyle,
      ]}
    ></View>
  )

  return (
    <View
      key={index}
      style={{
        position: 'absolute',
        left,
        top,
        height: calHeight,
        width: calWidth,
      }}
    >
      <>{blockIcon ? blockIcon({ done, error }) : null}</>

      {onPress ? (
        <TouchableOpacity onPress={() => onPress({ block, index })}>{out}</TouchableOpacity>
      ) : (
        <View>{out}</View>
      )}
    </View>
  )
}

export default OverlayBlock
