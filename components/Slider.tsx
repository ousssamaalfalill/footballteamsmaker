import { StyleSheet, View } from 'react-native';
import { useState, useEffect } from 'react';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  runOnJS,
  withSpring
} from 'react-native-reanimated';

export function Slider({ 
  minimumValue, 
  maximumValue, 
  value, 
  onValueChange,
  minimumTrackTintColor = '#1E5631',
  maximumTrackTintColor = '#E0E0E0',
  step = 1,
  style,
}) {
  const [sliderWidth, setSliderWidth] = useState(0);
  const position = useSharedValue(0);
  
  useEffect(() => {
    if (sliderWidth > 0) {
      const percentage = (value - minimumValue) / (maximumValue - minimumValue);
      position.value = percentage * sliderWidth;
    }
  }, [value, sliderWidth, minimumValue, maximumValue]);
  
  const positionToValue = (pos: number) => {
    const percentage = pos / sliderWidth;
    let exactValue = minimumValue + percentage * (maximumValue - minimumValue);
    
    if (step > 0) {
      exactValue = Math.round(exactValue / step) * step;
    }
    
    return Math.min(Math.max(exactValue, minimumValue), maximumValue);
  };
  
  const onSliderLayout = (event) => {
    const { width } = event.nativeEvent.layout;
    setSliderWidth(width);
  };
  
  const pan = Gesture.Pan()
    .onBegin(() => {
      position.value = withSpring(position.value);
    })
    .onUpdate((event) => {
      const newPosition = Math.min(Math.max(0, event.absoluteX - event.x), sliderWidth);
      position.value = newPosition;
      const newValue = positionToValue(newPosition);
      runOnJS(onValueChange)(newValue);
    })
    .onFinalize(() => {
      const finalValue = positionToValue(position.value);
      position.value = withSpring((finalValue - minimumValue) / (maximumValue - minimumValue) * sliderWidth);
      runOnJS(onValueChange)(finalValue);
    });
    
  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: position.value }],
  }));
  
  const trackStyle = useAnimatedStyle(() => ({
    width: position.value + 10,
  }));
  
  return (
    <View style={[styles.container, style]}>
      <View 
        style={[styles.track, { backgroundColor: maximumTrackTintColor }]} 
        onLayout={onSliderLayout}>
        <Animated.View 
          style={[
            styles.activeTrack, 
            trackStyle, 
            { backgroundColor: minimumTrackTintColor }
          ]} 
        />
        <GestureDetector gesture={pan}>
          <Animated.View 
            style={[
              styles.thumb, 
              thumbStyle, 
              { backgroundColor: minimumTrackTintColor }
            ]} 
          />
        </GestureDetector>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 40,
    justifyContent: 'center',
  },
  track: {
    height: 4,
    borderRadius: 2,
  },
  activeTrack: {
    height: 4,
    borderRadius: 2,
    position: 'absolute',
    left: 0,
  },
  thumb: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    top: -8,
    left: -10,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});