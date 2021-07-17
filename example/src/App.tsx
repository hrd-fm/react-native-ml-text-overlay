import React, { useCallback, useState } from 'react'
import { Alert, SafeAreaView, StyleSheet, Text } from 'react-native'
import MlTextOverlay, {
  CloudML,
  MLTextOverlay,
  cloudVisionToML,
} from 'react-native-ml-text-overlay'
import mlResults from '../fixtures/ml_results1.json'
import { transparentColor } from './utils/colors'
const exampleImage = require('../fixtures/poster1.jpeg')
import cloudMLResponse from '../fixtures/ml_vision_cloud_results.json'
const response = cloudVisionToML(cloudMLResponse as CloudML, { skip: 1 })

const LoaderFunc = ({ done }: { done: boolean }): JSX.Element => {
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
      {done ? '☑️ ' : '🎟'}
    </Text>
  )
}

const blockStyle = {
  borderColor: transparentColor('#FFFFFF', 0.5),
  backgroundColor: transparentColor('#000000', 0.5),
  borderWidth: 1,
  padding: 0,
  borderRadius: 10,
}
export default function App() {
  const [itemsDone, setItemsDone] = useState<number[]>([])
  const onPress = useCallback(
    ({ block: { text }, index }) => {
      Alert.alert(
        'You pressed',
        text,
        [
          {
            text: 'Ok',
            style: 'cancel',
          },
        ],
        {
          cancelable: true,
        }
      )
      setItemsDone([...itemsDone, index])
    },
    [itemsDone]
  )
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>Top</Text>
      <MlTextOverlay
        limit={10}
        imageSource={exampleImage}
        padding={40}
        depth={1}
        ocrResults={response as MLTextOverlay[]}
        onPress={onPress}
        itemsDone={itemsDone}
        blockPadding={20}
        blockIcon={({ done }) => <LoaderFunc done={done} />}
        blockStyle={blockStyle}
      />
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
})
