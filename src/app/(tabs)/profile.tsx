import { ErrorState, LoadingState } from "@/components/StateView";
import { palette } from "@/constants/theme";
import { useProfile } from "@/hooks/use-profile";
import { useTheme } from "@/hooks/use-theme";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useFocusEffect } from "expo-router";
import { useCallback, useRef, useState } from "react";
import {
  Alert,
  Image,
  Pressable,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const pickAvatar = async (source: "camera" | "library") => {
  if (source === "camera") {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission required", "Allow camera access to take a photo.");
      return null;
    }
  } else {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission required", "Allow photo access to pick an image.");
      return null;
    }
  }

  const result =
    source === "camera"
      ? await ImagePicker.launchCameraAsync({
          mediaTypes: ["images"],
          allowsEditing: true,
          aspect: [1, 1],
          quality: 1,
        })
      : await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ["images"],
          allowsEditing: true,
          aspect: [1, 1],
          quality: 1,
        });

  return result.canceled ? null : result.assets[0].uri;
};

export default function Profile() {
  const { colorScheme, toggleTheme } = useTheme();
  const colors = palette[colorScheme];
  const styles = getStyles(colorScheme);
  const isDark = colorScheme === "dark";

  const { user, stats, loading, error, reload, reloadStats, updateName, updateAvatar } = useProfile();
  const [draftName, setDraftName] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const editingName = draftName !== null;

  // Обновляем статистику при возврате на вкладку (статусы меняются с других экранов).
  const firstFocus = useRef(true);
  useFocusEffect(
    useCallback(() => {
      if (firstFocus.current) {
        firstFocus.current = false;
        return;
      }

      void reloadStats();
    }, [reloadStats]),
  );

  const changeAvatar = () => {
    Alert.alert("Change photo", "Choose a source", [
      { text: "Take photo", onPress: () => void applyPatchFrom("camera") },
      { text: "Choose from gallery", onPress: () => void applyPatchFrom("library") },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const applyPatchFrom = async (source: "camera" | "library") => {
    const uri = await pickAvatar(source);

    if (!uri) {
      return;
    }

    try {
      await updateAvatar(uri);
    } catch (cause) {
      Alert.alert(
        "Error",
        cause instanceof Error ? cause.message : "Could not upload photo.",
      );
    }
  };

  const startEditName = () => {
    setDraftName(user?.name ?? "");
  };

  const cancelEditName = () => {
    setDraftName(null);
  };

  const saveName = async () => {
    const name = (draftName ?? "").trim();

    if (!name) {
      Alert.alert("Nickname required", "Please enter a nickname.");
      return;
    }

    setSaving(true);

    try {
      await updateName(name);
      setDraftName(null);
    } catch (cause) {
      Alert.alert(
        "Error",
        cause instanceof Error ? cause.message : "Could not save nickname.",
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading && !user) {
    return (
      <SafeAreaView style={styles.safe} edges={["top"]}>
        <LoadingState label="Loading profile..." />
      </SafeAreaView>
    );
  }

  if (error && !user) {
    return (
      <SafeAreaView style={styles.safe} edges={["top"]}>
        <ErrorState message={error} onRetry={() => void reload()} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
      </View>

      <View style={styles.profileCard}>
        <Pressable style={styles.avatarWrapper} onPress={changeAvatar}>
          {user?.avatar ? (
            <Image source={{ uri: user.avatar }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Ionicons name="person" size={40} color={colors.textMuted} />
            </View>
          )}
          <View style={styles.cameraBadge}>
            <Ionicons name="camera" size={16} color={colors.primaryText} />
          </View>
        </Pressable>

        {editingName ? (
          <View style={styles.nameEditRow}>
            <TextInput
              style={styles.nameInput}
              value={draftName ?? ""}
              onChangeText={setDraftName}
              placeholder="Nickname"
              placeholderTextColor={colors.textMuted}
              autoFocus
              maxLength={30}
              onSubmitEditing={() => void saveName()}
            />
            <Pressable hitSlop={8} onPress={() => void saveName()} disabled={saving}>
              <Ionicons name="checkmark-circle" size={28} color={colors.primary} />
            </Pressable>
            <Pressable hitSlop={8} onPress={cancelEditName}>
              <Ionicons name="close-circle" size={28} color={colors.textMuted} />
            </Pressable>
          </View>
        ) : (
          <Pressable style={styles.nameRow} onPress={startEditName}>
            <Text style={styles.name} numberOfLines={1}>
              {user?.name || "Set nickname"}
            </Text>
            <Ionicons name="pencil" size={16} color={colors.textMuted} />
          </Pressable>
        )}

        {user?.email ? <Text style={styles.email}>{user.email}</Text> : null}
      </View>

      {stats ? (
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Statistics</Text>

          <View style={styles.summaryRow}>
            <View style={styles.summaryCard}>
              <Ionicons name="albums-outline" size={18} color={colors.primary} />
              <Text style={styles.summaryValue}>{stats.totalAnime}</Text>
              <Text style={styles.summaryLabel}>Anime</Text>
            </View>
            <View style={styles.summaryCard}>
              <Ionicons name="play-circle-outline" size={18} color="#22C55E" />
              <Text style={styles.summaryValue}>{stats.episodesWatched}</Text>
              <Text style={styles.summaryLabel}>Episodes</Text>
            </View>
            <View style={styles.summaryCard}>
              <Ionicons name="time-outline" size={18} color="#F59E0B" />
              <Text style={styles.summaryValue}>{stats.daysWatched.toFixed(1)}</Text>
              <Text style={styles.summaryLabel}>Days</Text>
            </View>
          </View>

          <View style={styles.statusCard}>
            {[
              { key: "watching", label: "Watching", value: stats.watching, color: "#3B82F6" },
              { key: "completed", label: "Completed", value: stats.completed, color: "#22C55E" },
              { key: "planned", label: "Planned", value: stats.planned, color: "#A855F7" },
              { key: "onHold", label: "On hold", value: stats.onHold, color: "#F59E0B" },
              { key: "dropped", label: "Dropped", value: stats.dropped, color: "#EF4444" },
            ].map((item, index, list) => (
              <View
                key={item.key}
                style={[
                  styles.statusItem,
                  index < list.length - 1 && styles.statusItemDivider,
                ]}
              >
                <View style={[styles.statusDot, { backgroundColor: item.color }]} />
                <Text style={styles.statusItemLabel}>{item.label}</Text>
                <Text style={styles.statusItemValue}>{item.value}</Text>
              </View>
            ))}
          </View>
        </View>
      ) : null}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Appearance</Text>

        <View style={styles.option}>
          <View style={styles.optionLeft}>
            <Ionicons
              name={isDark ? "moon-outline" : "sunny-outline"}
              size={20}
              color={colors.text}
            />
            <Text style={styles.optionLabel}>{isDark ? "Dark theme" : "Light theme"}</Text>
          </View>

          <Switch
            value={isDark}
            onValueChange={(value) => toggleTheme(value ? "dark" : "light")}
            trackColor={{ false: colors.switchTrackOff, true: colors.switchTrackOn }}
            thumbColor={colors.switchThumb}
            ios_backgroundColor={colors.switchTrackOff}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const getStyles = (scheme: "light" | "dark") => {
  const colors = palette[scheme];

  return StyleSheet.create({
    safe: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      paddingHorizontal: 16,
      paddingTop: 10,
      paddingBottom: 20,
    },
    title: {
      fontSize: 28,
      fontWeight: "bold",
      color: colors.text,
    },
    profileCard: {
      alignItems: "center",
      paddingHorizontal: 16,
      paddingBottom: 28,
    },
    avatarWrapper: {
      width: 104,
      height: 104,
      borderRadius: 52,
      borderWidth: 2,
      borderColor: colors.primary,
      backgroundColor: colors.surface,
    },
    avatar: {
      width: "100%",
      height: "100%",
      borderRadius: 52,
    },
    avatarPlaceholder: {
      flex: 1,
      borderRadius: 52,
      backgroundColor: colors.surfaceAlt,
      alignItems: "center",
      justifyContent: "center",
    },
    cameraBadge: {
      position: "absolute",
      right: -2,
      bottom: -2,
      padding: 6,
      borderRadius: 16,
      backgroundColor: colors.primary,
      borderWidth: 2,
      borderColor: colors.background,
    },
    nameRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      marginTop: 14,
    },
    name: {
      fontSize: 20,
      fontWeight: "700",
      color: colors.text,
    },
    nameEditRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      marginTop: 14,
    },
    nameInput: {
      minWidth: 160,
      height: 44,
      paddingHorizontal: 12,
      borderRadius: 12,
      backgroundColor: colors.surfaceAlt,
      color: colors.text,
      fontSize: 16,
    },
    email: {
      fontSize: 13,
      color: colors.textMuted,
      marginTop: 4,
    },
    statsSection: {
      paddingHorizontal: 16,
      gap: 12,
      marginBottom: 28,
    },
    summaryRow: {
      flexDirection: "row",
      gap: 10,
    },
    summaryCard: {
      flex: 1,
      alignItems: "center",
      gap: 4,
      backgroundColor: colors.surface,
      borderRadius: 16,
      paddingVertical: 16,
      borderWidth: 1,
      borderColor: colors.border,
    },
    summaryValue: {
      fontSize: 20,
      fontWeight: "700",
      color: colors.text,
      marginTop: 2,
    },
    summaryLabel: {
      fontSize: 11,
      color: colors.textMuted,
    },
    statusCard: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.border,
      paddingHorizontal: 16,
    },
    statusItem: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      paddingVertical: 12,
    },
    statusItemDivider: {
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.border,
    },
    statusDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
    },
    statusItemLabel: {
      flex: 1,
      fontSize: 15,
      fontWeight: "500",
      color: colors.text,
    },
    statusItemValue: {
      fontSize: 15,
      fontWeight: "700",
      color: colors.text,
    },
    section: {
      paddingHorizontal: 16,
      gap: 10,
    },
    sectionTitle: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.textMuted,
      marginBottom: 4,
    },
    option: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: colors.surface,
      borderRadius: 14,
      paddingHorizontal: 16,
      paddingVertical: 16,
      borderWidth: 1,
      borderColor: colors.border,
    },
    optionLeft: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },
    optionLabel: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
    },
  });
};
