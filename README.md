# react-native-ml-text-overlay

Overlay layer for OCR / Vision results, complete with depth rendering, loading icons and touch actions for blocks. Resizable (within limits)

Used internally at [Wail](https://www.wail.fm)

![How it works](https://media.giphy.com/media/FLQIca4UXBzomqcoyp/giphy.gif)

## Installation

```sh
yarn add react-native-ml-text-overlay
```

## Usage

```js
import MlTextOverlay from 'react-native-ml-text-overlay';

<MlTextOverlay
  limit={0}
  imageSource={image}
  padding={20}
  ocrResults={ocrResults}
  itemsDone={itemsDone}
/>;
```

## Props

| Name         | Type                                                                   | Required | default | comment                                                                                                                                                  |
| ------------ | ---------------------------------------------------------------------- | -------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| blockIcon    | (x: { done: boolean, error:boolean }) => ReactChild                    | no       | -       |
| blockPadding | number                                                                 | no       | 20      | Padding around each overlay block                                                                                                                        |
| blockStyle   | ViewStyle (RN)                                                         | no       | -       |
| depth        | 1 \| 2 \| 3                                                            | no       | 1       | decide the depth (granularity of the overlay), 1 is bigger blocks,3 is smaller (each letter), note: if over 100 blocks gets rendered animations turn off |
| doneStyle    | ViewStyle (RN)                                                         | no       | -       | style appending on blockStyle if index is contained in _itemsDone_                                                                                       |
| errorStyle   | ViewStyle (RN)                                                         | no       | -       | style appending on blockStyle if index is contained in _itemsError_                                                                                      |
| hideDone     | boolean                                                                | no       | false   | hide block if index is contained in _itemsDone_                                                                                                          |
| imageSource  | ImageStyle (RN)                                                        | yes      | -       | {uri:imguri} or imported image                                                                                                                           |
| imageStyle   | ImageRequireSource \| ImageURISource                                   | yes      | -       |
| itemsDone    | number[]                                                               | no       | -       | array of indexes for items somehow marked as done _example [1,2,3]_                                                                                      |
| itemsError   | number[]                                                               | no       | -       | array of indexes for items somehow marked as erroneous _example [1,2,3]_                                                                                 |
| limit        | number                                                                 | no       | -       | set a render limit of blocks                                                                                                                             |
| ocrResults   | MLTextOverlay[]                                                        | yes      | -       | the JSON object containing all coordinate data for rendering                                                                                             |
| onPress      | (x: { block: GoogleMLText \| Element \| Line; index: number }) => void | no       | -       | on press Item, return type includes index and the block data                                                                                             |
| padding      | number                                                                 | no       | 0       | padding around the root render                                                                                                                           |


## Sources

Any source is fine as long as it follows the interface for MLTextOverlay (see source)

primarly use for [Google ML Kit text](https://developers.google.com/ml-kit/vision/text-recognition) and RN implementations like [react-native-mlkit-ocr](https://github.com/agoldis/react-native-mlkit-ocr)

to convert other sources like google cloud vision ensure the format adheres to

```js
bounding: {
  height: number
  left: number
  top: number
  width: number
}

use the converter
```

## TODO

- [x] implement parser for Google ml kit
- [x] implement parser for Google Cloud ML
- [ ] implement block / paragraph parser for Cloud ML
- [ ] implement parser for AWS Rekognition
- [ ] implement parser for Azure Computer Vision

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT
