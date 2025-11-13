import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated';

interface PriceCounterProps {
  initialPrice: number;
  isRunning: boolean;
  incrementRate?: number; // DH ajoutés toutes les secondes
}

export const PriceCounter: React.FC<PriceCounterProps> = ({
  initialPrice,
  isRunning,
  incrementRate = 0.5,
}) => {
  const [currentPrice, setCurrentPrice] = useState(initialPrice);
  const scale = useSharedValue(1);

  useEffect(() => {
    if (isRunning) {
      const interval = setInterval(() => {
        setCurrentPrice((prev) => {
          const newPrice = prev + incrementRate;
          // Animation à chaque incrément
          scale.value = withSpring(1.1, {}, () => {
            scale.value = withSpring(1);
          });
          return newPrice;
        });
      }, 2000); // Toutes les 2 secondes

      return () => clearInterval(interval);
    }
  }, [isRunning, incrementRate]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Prix de la course</Text>
      <Animated.View style={animatedStyle}>
        <Text style={styles.price}>{currentPrice.toFixed(2)} DH</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FEF3C7',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginVertical: 16,
  },
  label: {
    fontSize: 14,
    color: '#78350F',
    marginBottom: 8,
    fontWeight: '600',
  },
  price: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#DC2626',
  },
});