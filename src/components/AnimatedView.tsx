import React from 'react'
import * as Animatable from 'react-native-animatable'

export interface DefaultComponent {
  duration?: number
  animationType?: string | undefined
  delay?: number
  infinite?: boolean
  children?: React.ReactChild | React.ReactChild[]
  style?: any
}

const DefaultComponent = ({
  animationType = undefined,
  delay = 0,
  duration = 500,
  infinite = false,
  style,
  children,
}: DefaultComponent): React.ReactElement => {
  return (
    <Animatable.View
      duration={duration}
      animation={animationType}
      iterationCount={infinite ? 'infinite' : 1}
      useNativeDriver
      delay={delay}
      style={style}
    >
      {children}
    </Animatable.View>
  )
}
export default DefaultComponent
