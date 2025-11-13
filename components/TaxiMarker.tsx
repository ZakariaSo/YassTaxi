import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming,
} from 'react-native-reanimated';

interface TaxiMarkerProps {
  size?: number;
  animated?: boolean;
}

export const TaxiMarker: React.FC<TaxiMarkerProps> = ({ 
  size = 40, 
  animated = true 
}) => {
  const scale = useSharedValue(1);
  const rotate = useSharedValue(0);

  useEffect(() => {
    if (animated) {
      scale.value = withRepeat(
        withTiming(1.1, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
        -1,
        true
      );

      rotate.value = withRepeat(
        withTiming(360, { duration: 3000, easing: Easing.linear }),
        -1,
        false
      );
    }
  }, [animated]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { rotate: `${rotate.value}deg` },
    ],
  }));

  return (
    <Animated.View style={[styles.container, { width: size, height: size }, animatedStyle]}>
      <View style={styles.taxi}>
        <View style={styles.taxiBody} />
        <View style={styles.taxiTop} />
        <View style={styles.taxiWindow} />
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  taxi: {
    width: '100%',
    height: '100%',
    backgroundColor: '#EF4444',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  taxiBody: {
    width: '80%',
    height: '60%',
    backgroundColor: '#DC2626',
    borderRadius: 4,
  },
  taxiTop: {
    position: 'absolute',
    top: 8,
    width: '50%',
    height: '30%',
    backgroundColor: '#FEE2E2',
    borderRadius: 2,
  },
  taxiWindow: {
    position: 'absolute',
    top: 12,
    width: '40%',
    height: '20%',
    backgroundColor: '#60A5FA',
    borderRadius: 2,
  },
});