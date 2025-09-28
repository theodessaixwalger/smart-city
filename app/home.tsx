import { Text, Pressable, Animated } from "react-native";
import { Link } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useRef } from "react";
import styles from "../styles/Home_styles"

export default function Home() {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  return (
    <LinearGradient
      colors={["#4A90E2", "#50E3C2"]}
      style={styles.container}
    >
      <Text style={styles.title}>SKIBIDI TOILETS</Text>
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <Pressable
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed,
          ]}
        >
          <Link href="/toilets-map" style={styles.link}>
            <Text style={styles.buttonText}>Voir la carte</Text>
          </Link>
        </Pressable>
      </Animated.View>
    </LinearGradient>
  );
}
