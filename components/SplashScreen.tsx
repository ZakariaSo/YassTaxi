import React, { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  View,
} from "react-native";

const { width, height } = Dimensions.get("window");

interface SplashScreenProps {
  onFinish: () => void;
}

export default function SplashScreen({ onFinish }: SplashScreenProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.3)).current;
  const bounceAnim = useRef(new Animated.Value(0)).current;
  const spinAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animation d'entrée
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    // Animation de rebond
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: -15,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Animation spinner
    Animated.loop(
      Animated.timing(spinAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      })
    ).start();

    // Timer de sortie
    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        onFinish();
      });
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.circle1, { opacity: fadeAnim }]} />
      <Animated.View style={[styles.circle2, { opacity: fadeAnim }]} />
      <Animated.View style={[styles.circle3, { opacity: fadeAnim }]} />

      <Animated.View
        style={[
          styles.content,
          { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
        ]}
      >
        <View>
          <Animated.View
            style={[
              styles.logoContainer,
              { transform: [{ translateY: bounceAnim }] },
            ]}
          >
            <Image
              source={require("../assets/zakia.png")}
              style={{ width: 200, height: 200, borderRadius: 50 }}
            />
          </Animated.View>
        </View>

        <Text style={styles.brandName}>YassTaxi</Text>
        <Text style={styles.tagline}>PETIT TAXI CASA</Text>

        <View style={styles.routeDots}>
          <View style={styles.dot} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>

        <View style={styles.loadingContainer}>
          <Animated.View
            style={[styles.spinner, { transform: [{ rotate: spin }] }]}
          />
          <Text style={styles.loadingText}>Chargement...</Text>
        </View>

        <View style={styles.locationBadge}>
          <Text style={styles.locationIcon}>📍</Text>
          <Text style={styles.locationText}>Casablanca, Maroc</Text>
        </View>

        <Text style={styles.version}>v1.0.0</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#DC2626",
    justifyContent: "center",
    alignItems: "center",
  },
  circle1: {
    position: "absolute",
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    top: -150,
    left: -100,
  },
  circle2: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    bottom: -100,
    right: -50,
  },
  circle3: {
    position: "absolute",
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    top: height * 0.5,
    right: width * 0.1,
  },
  content: {
    alignItems: "center",
  },
  logoContainer: {
    marginBottom: 30,
  },
  taxiIcon: {
    width: 140,
    height: 140,
    backgroundColor: "#FFF",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.3,
    shadowRadius: 30,
    elevation: 10,
  },
  taxiEmoji: {
    fontSize: 70,
  },
  brandName: {
    fontSize: 52,
    fontWeight: "900",
    color: "#FFF",
    letterSpacing: 2,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 20,
    marginBottom: 10,
  },
  tagline: {
    fontSize: 16,
    fontWeight: "300",
    color: "rgba(255, 255, 255, 0.9)",
    letterSpacing: 3,
    marginBottom: 50,
  },
  routeDots: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 30,
  },
  dot: {
    width: 10,
    height: 10,
    backgroundColor: "#FFF",
    borderRadius: 5,
    opacity: 0.7,
  },
  loadingContainer: {
    alignItems: "center",
    gap: 20,
    marginBottom: 40,
  },
  spinner: {
    width: 50,
    height: 50,
    borderWidth: 4,
    borderColor: "rgba(255, 255, 255, 0.3)",
    borderTopColor: "#FFF",
    borderRadius: 25,
  },
  loadingText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "500",
    letterSpacing: 1,
  },
  locationBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 50,
    gap: 10,
    marginBottom: 20,
  },
  locationIcon: {
    fontSize: 18,
  },
  locationText: {
    color: "#FFF",
    fontSize: 15,
    fontWeight: "600",
  },
  version: {
    color: "rgba(255, 255, 255, 0.6)",
    fontSize: 12,
    letterSpacing: 1,
  },
});
