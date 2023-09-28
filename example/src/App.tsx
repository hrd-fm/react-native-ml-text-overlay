import React, { useCallback, useState, useEffect } from 'react'
import axios from 'axios'
import {
  Alert,
  Button,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TextInput,
  Switch,
} from 'react-native'
import type { MLTextOverlayProps } from 'react-native-ml-text-overlay'
import MlTextOverlay from 'react-native-ml-text-overlay'
import mlResults from '../fixtures/ml_results2.json'
import { transparentColor } from './utils/colors'
const exampleImage = require('../fixtures/friend.jpg')
const exampleUri =
  'https://images.unsplash.com/photo-1543487945-139a97f387d5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2193&q=80'

import { GestureHandlerRootView, TouchableOpacity } from 'react-native-gesture-handler'

import TextRecognition from '@react-native-ml-kit/text-recognition'
const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/

const LoaderFunc = ({ done, error }: { done: boolean; error: boolean }): JSX.Element => {
  const altIcon = done ? '☑️' : '❓'
  const icon = error ? 'X' : altIcon
  return (
    <Text
      style={{
        alignSelf: 'flex-end',
        position: 'absolute',
        right: -10,
        top: -10,
        zIndex: 2,
        backgroundColor: done ? 'transparent' : 'transparent',
      }}
    >
      {icon}
    </Text>
  )
}

export const App = () => {
  const [itemsDone, setItemsDone] = useState<number[]>([])
  const [errorItems, setErrorItems] = useState<number[]>([])
  const [depth, setDepth] = useState<1 | 2 | 3>(1)
  const [padding, setPadding] = useState<number>(0)
  const [animation, setAnimation] = useState({})
  const [image, setImage] = useState<string | void>()
  const [search, setSearch] = useState<string>(exampleUri)
  const [mlResults, setMlResults] = useState<any>()
  useEffect(() => {
    if (search.includes('http')) {
      TextRecognition.recognize(search).then((res) => {
        if (!res) return
        console.log(res)
        setMlResults(res)
        setImage(search)
      })
    }
  }, [search])
  const onSetAnimation = useCallback((type?: string) => {
    setAnimation(type ? { type, duration: 2000, delay: 0, infinite: true } : {})
  }, [])
  const onPress = useCallback(
    ({ block: { text }, index }: { block: { text: string }; index: number }) => {
      Alert.alert(
        'Matched Text:',
        text,
        [
          {
            text: 'Ok',
            style: 'cancel',
            onPress: () => setItemsDone([...itemsDone, index]),
          },
          {
            text: 'Error',
            style: 'destructive',
            onPress: () => setErrorItems([...errorItems, index]),
          },
        ],
        {
          cancelable: true,
        }
      )
    },
    [errorItems, itemsDone]
  )
  if (!image) {
    return (
      <SafeAreaView style={styles.container}>
        <TextInput onChangeText={(text) => setSearch(text)} placeholder="enter a url" />
      </SafeAreaView>
    )
  }
  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        onPress={() => {
          setSearch('')
          setImage()
          setMlResults([])
        }}
      >
        <Text style={{ marginTop: 80 }}>Restart</Text>
      </TouchableOpacity>
      {image && mlResults?.blocks && (
        <MlTextOverlay
          limit={0}
          imageSource={{ uri: image }}
          padding={padding}
          depth={depth}
          ocrResults={mlResults?.blocks}
          boundingKey="frame"
          onPress={onPress}
          animation={animation}
          itemsDone={itemsDone}
          itemsError={errorItems}
          blockPadding={20}
          blockIcon={(props) => <LoaderFunc {...props} />}
          doneStyle={styles.doneStyle}
          blockStyle={styles.blockStyle}
          errorStyle={styles.errorStyle}
        />
      )}

      <Text>Depth</Text>
      <View style={styles.block}>
        <Button
          onPress={() => setDepth(1)}
          title="1"
          accessibilityLabel="Learn more about this purple button"
        />
        <Button
          onPress={() => setDepth(2)}
          title="2"
          accessibilityLabel="Learn more about this purple button"
        />
        <Button
          onPress={() => setDepth(3)}
          title="3"
          accessibilityLabel="Learn more about this purple button"
        />
      </View>
      <Text>Padding</Text>
      <View style={styles.block}>
        <Button
          onPress={() => setPadding(0)}
          title="0"
          accessibilityLabel="Learn more about this purple button"
        />
        <Button
          onPress={() => setPadding(40)}
          title="40"
          accessibilityLabel="Learn more about this purple button"
        />
        <Button
          onPress={() => setPadding(80)}
          title="80"
          accessibilityLabel="Learn more about this purple button"
        />
      </View>
      <Text>Animation</Text>
      <View style={styles.block}>
        <Button
          onPress={() => onSetAnimation()}
          title="none"
          accessibilityLabel="Learn more about this purple button"
        />
        <Button
          onPress={() => onSetAnimation('pulse')}
          title="pulse"
          accessibilityLabel="Learn more about this purple button"
        />
        <Button
          onPress={() => onSetAnimation('fadeIn')}
          title="fadeIn"
          accessibilityLabel="Learn more about this purple button"
        />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 50,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 20,
    margin: 20,
  },
  block: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  doneStyle: {
    backgroundColor: transparentColor('#62f705', 0.5),
  },
  blockStyle: {
    borderColor: transparentColor('#ffffff', 0.5),
    backgroundColor: transparentColor('#000000', 0.5),
    borderWidth: 1,
    padding: 0,
    borderRadius: 10,
  },
  errorStyle: {
    backgroundColor: transparentColor('#ed2020', 0.5),
  },
})

// {
//   /* <MlTextOverlay /> */
// }
// const TextOverlayExample = ({}) => {
//   return (
//     <SafeAreaView>
//       <Text>Test</Text>
//     </SafeAreaView>
//   )
// }

// export default TextOverlayExample

export default function AppWrapper() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <App />
    </GestureHandlerRootView>
  )
}
