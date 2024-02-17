import React, { useRef } from 'react';
import { View, StyleSheet, Text, Animated, PanResponder } from 'react-native';
import { useNavigation } from '@react-navigation/native';

function Slider_Screen() {
  const navigation = useNavigation();
  const translateX = useRef(new Animated.Value(0)).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        translateX.setOffset(translateX._value);
      },
      onPanResponderMove: Animated.event(
        [null, { dx: translateX }],
        { useNativeDriver: false }
      ),
      onPanResponderRelease: (e, { vx, dx }) => {
        translateX.flattenOffset();
        if (dx > 150) { // Threshold to navigate
          navigation.navigate('Advice_Screen');
        }
        Animated.spring(translateX, {
          toValue: 0,
          bounciness: 10,
          useNativeDriver: false,
        }).start();
      },
    })
  ).current;  

  return (
    <View style={styles.container}>
      <View style={styles.sliderBar}>
        <Animated.View
          style={[
            styles.circle,
            {
              transform: [
                {
                  translateX: translateX.interpolate({
                    inputRange: [0, 150],
                    outputRange: [-10, 210],
                    extrapolate: 'clamp',
                  }),
                },
              ],
            },
          ]}
          {...panResponder.panHandlers}
        >
          <Text style={styles.arrowText}>→</Text>
        </Animated.View>
      </View>
      <Text style={styles.sliderText}>SLIDE FOR HELP</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  sliderBar: {
    width: 300,
    height: 80,
    backgroundColor: 'red',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    width: 80,
    height: 80,
    backgroundColor: '#fff',
    borderColor: '#000000',
    borderWidth: 2,
    borderRadius: 40,
    position: 'absolute',
    left: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowText: {
    color: 'red',
    fontSize: 24,
  },
  sliderText: {
    color: '#fff',
    fontWeight: 'bold',
    position: 'absolute',
    fontSize: 18,
  },
});

export default Slider_Screen;