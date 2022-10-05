import { addIndex, flatten, map, path, take } from 'ramda';
import React, { ReactNode, useEffect, useState } from 'react';
import {
  Image,
  ImageRequireSource,
  ImageStyle,
  ImageURISource,
  View,
  ViewStyle,
} from 'react-native';
import Animated from 'react-native-reanimated';
import OverlayBlock, { AnimationProps } from './components/OverlayBlock';
import PinchToZoom from './components/PinchToZoom';
export { CloudML, cloudVisionToML, XYtoBoundary } from './utils/converter';

const mapIndexed = addIndex(map);
export interface MLTextOverlayProps {
  bounding?: Bounding;
  cornerPoints: CornerPoint[];
  lines?: Line[];
  text: string;
  locale?: string;
}
export interface Bounding {
  height: number;
  left: number;
  top: number;
  width: number;
}

export interface CornerPoint {
  x: number;
  y: number;
}

export interface Element {
  bounding: Bounding;
  cornerPoints: CornerPoint[];
  text: string;
}

export interface Line extends MLTextOverlayProps {
  elements: Element[];
}

export interface OverlayProps {
  animation?: AnimationProps;
  blockIcon?: (x: { done: boolean; error: boolean }) => ReactNode;
  blockPadding?: number;
  blockStyle?: ViewStyle;
  depth?: 1 | 2 | 3;
  hideDone?: boolean;
  zoom?: boolean;
  imageSource: ImageRequireSource | ImageURISource;
  imageStyle?: ImageStyle;
  itemsDone?: number[];
  itemsError?: number[];
  limit?: number;
  doneStyle?: ViewStyle;
  errorStyle?: ViewStyle;
  ocrResults: MLTextOverlayProps[];
  onPress?: (x: {
    block: MLTextOverlayProps | Element | Line;
    index: number;
  }) => void;
  onError?: (e: Error) => void;
  padding?: number;
}
const getRenderPath = (
  depth: number = 1,
  ocrResults: MLTextOverlayProps[]
): MLTextOverlayProps[] | Line[] | Element[] => {
  switch (depth) {
    case 2:
      return flatten(map(path(['lines']), ocrResults) as Line[]);
    case 3:
      return flatten(
        map(
          path(['elements']),
          flatten(map(path(['lines']), ocrResults) as Line[])
        ) as Element[]
      );
    default:
      return ocrResults;
  }
};

export interface CalcResult {
  width: number;
  height: number;
  aspectRatio: number;
}
export interface BlockCalc extends CalcResult {
  xRatio: number;
  yRatio: number;
  diffHeight: number;
}
const MLOverlay = ({
  animation,
  blockIcon,
  blockPadding,
  zoom = false,
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
  const [fullSize, setFullSize] = useState<CalcResult>();
  const [rootSize, setRootSize] = useState<CalcResult>();
  const [calSized, setCalSized] = useState<BlockCalc>();
  const [renderData, setRenderData] = useState<{
    data: MLTextOverlayProps[] | Line[] | Element[];
    animate: boolean;
  }>();
  useEffect(() => {
    if (typeof imageSource !== 'number' && imageSource.uri) {
      Image.getSize(
        imageSource.uri,
        (width, height) => {
          setFullSize({ width, height, aspectRatio: width / height });
        },
        (err) => {
          onError && onError(err);
        }
      );
    } else {
      try {
        const { width, height } = Image.resolveAssetSource(imageSource);
        setFullSize({ width, height, aspectRatio: width / height });
      } catch (err) {
        onError && onError(err as Error);
      }
    }
  }, []);
  useEffect(() => {
    if (fullSize && rootSize) {
      const xRatio = rootSize.width / fullSize.width;
      const width = rootSize.width;
      const height = fullSize.height * xRatio;
      const yRatio = height / fullSize.height;
      const diffHeight = rootSize.height - height;
      const out = {
        width,
        height,
        xRatio,
        yRatio,
        aspectRatio: width / height,
        diffHeight,
      };
      setCalSized(out);
    }
  }, [rootSize, fullSize, padding]);

  useEffect(() => {
    const getRenderData = getRenderPath(depth, ocrResults);
    const renderSize = getRenderData.length;
    const slicedData = take(limit ? limit : renderSize, getRenderData);
    setRenderData({ data: slicedData, animate: renderSize < 100 });
  }, [limit, ocrResults, depth]);
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
            const done = itemsDone.includes(index);
            const ds = done ? doneStyle : {};
            const error = itemsError.includes(index);
            const es = error ? errorStyle : {};
            return done && hideDone ? null : (
              <OverlayBlock
                block={block as MLTextOverlayProps}
                index={index as number}
                key={index}
                size={calSized}
                done={done}
                error={error}
                blockPadding={blockPadding}
                blockStyle={
                  error ? { ...blockStyle, ...es } : { ...blockStyle, ...ds }
                }
                onPress={onPress}
                blockIcon={blockIcon}
                animate={renderData?.animate}
                animation={animation}
              />
            );
          }, renderData?.data)}
      </View>
    );
    if (zoom) {
      return (
        <PinchToZoom>
          <Animated.View>{items}</Animated.View>
        </PinchToZoom>
      );
    }
    return items;
  }, [zoom, calSized, renderData, itemsDone, itemsError, animation]);
  return (
    <View
      onLayout={({ nativeEvent }) => {
        const { width, height } = nativeEvent.layout;
        setRootSize({ width, height, aspectRatio: width / height });
      }}
      style={{
        margin: padding,
        height: calSized?.height,
        alignSelf: 'stretch',
      }}
    >
      {out}
    </View>
  );
};
export default MLOverlay;
