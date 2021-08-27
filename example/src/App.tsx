import React, { useCallback, useState } from 'react'
import { Alert, Button, SafeAreaView, StyleSheet, Text, View } from 'react-native'
import MlTextOverlay, { MLTextOverlay } from 'react-native-ml-text-overlay'
import mlResults from '../fixtures/ml_results1.json'
import { transparentColor } from './utils/colors'
const exampleImage = require('../fixtures/friend.jpg')

const LoaderFunc = ({ done, error }: { done: boolean; error: boolean }): JSX.Element => {
  const altIcon = done ? '☑️' : '❓'
  const icon = error ? 'X' : altIcon
  console.log('icon')
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

export default function App() {
  const [itemsDone, setItemsDone] = useState<number[]>([])
  const [errorItems, setErrorItems] = useState<number[]>([])
  const [depth, setDepth] = useState<1 | 2 | 3>(1)
  const [padding, setPadding] = useState<number>(0)
  const [animation, setAnimation] = useState({})
  const onSetAnimation = useCallback((type?: string) => {
    setAnimation(type ? { type, duration: 2000, delay: 0, infinite: true } : {})
  }, [])
  const onPress = useCallback(
    ({ block: { text }, index }) => {
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
    [itemsDone]
  )
  return (
    <SafeAreaView style={styles.container}>
      <Text>Image:</Text>
      <MlTextOverlay
        limit={0}
        imageSource={exampleImage}
        padding={padding}
        depth={depth}
        ocrResults={mlResults as MLTextOverlay[]}
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
