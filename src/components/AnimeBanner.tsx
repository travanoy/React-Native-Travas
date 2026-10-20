import { Ionicons } from "@expo/vector-icons";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { BannerAnime } from "@/components/mock/anime";

export function AnimeBanner({ anime }: { anime: BannerAnime }) {
  return (
    <View style={styles.container}>
      <Image source={{ uri: anime.coverImage }} style={styles.image} />
      <View style={styles.overlay} />

      <View style={styles.rating}>
        <Ionicons name="star" size={14} color="#FFD700" />
        <Text style={styles.ratingText}>{anime.rating.toFixed(1)}</Text>
      </View>

      <View style={styles.info}>
        <Text style={styles.title}>{anime.title}</Text>
        <Text style={styles.englishTitle}>{anime.englishTitle}</Text>
      </View>

      <Pressable style={styles.watchButton}>
        <Ionicons name="play" size={16} color="#FFFFFF" />
        <Text style={styles.watchText}>Watch</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 200,
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 28,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(13, 14, 21, 0.4)",
  },
  rating: {
    position: "absolute",
    top: 16,
    right: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(26, 28, 40, 0.8)",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  ratingText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  info: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 56,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 2,
  },
  englishTitle: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.7)",
  },
  watchButton: {
    position: "absolute",
    left: 16,
    bottom: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#6B52FA",
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  watchText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});
