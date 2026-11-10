import { ErrorState, LoadingState } from "@/components/StateView";
import { palette } from "@/constants/theme";
import { playerApi } from "@/api/player.api";
import { usePlayer } from "@/hooks/use-player";
import { useLanguage } from "@/hooks/use-language";
import { useTheme } from "@/hooks/use-theme";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import {
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";

const normalizeUrl = (url: string) =>
  url.startsWith("//") ? `https:${url}` : url;

const isHlsUrl = (url: string) => url.includes(".m3u8");

const buildHlsHtml = (url: string) => `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<style>html,body{margin:0;height:100%;background:#000;overflow:hidden}video{width:100%;height:100%;object-fit:contain}</style>
</head>
<body>
<video id="v" controls autoplay playsinline></video>
<script src="https://cdn.jsdelivr.net/npm/hls.js@1/dist/hls.min.js"></script>
<script>
  var src = ${JSON.stringify(url)};
  var video = document.getElementById('v');
  if (window.Hls && window.Hls.isSupported()) {
    var hls = new window.Hls();
    hls.loadSource(src);
    hls.attachMedia(video);
    hls.on(window.Hls.Events.MANIFEST_PARSED, function () { video.play().catch(function () {}); });
  } else {
    video.src = src;
  }
</script>
</body>
</html>`;

export default function WatchScreen() {
  const params = useLocalSearchParams<{ id: string; shikimoriId?: string }>();
  const shikimoriId = params.shikimoriId ? Number(params.shikimoriId) : null;
  const validShikimoriId =
    shikimoriId !== null && Number.isFinite(shikimoriId) ? shikimoriId : null;

  const { colorScheme } = useTheme();
  const { t } = useLanguage();
  const colors = palette[colorScheme];
  const styles = getStyles(colorScheme);
  const { data, loading, error, refetch } = usePlayer(validShikimoriId);

  const [translationId, setTranslationId] = useState<number | null>(null);
  const [episodeNumber, setEpisodeNumber] = useState<number | null>(null);

  const translation = useMemo(
    () =>
      data?.translations.find((item) => item.id === translationId) ??
      data?.translations[0],
    [data, translationId],
  );

  const episode =
    translation?.episodes.find((item) => item.number === episodeNumber) ??
    translation?.episodes[0];

  const saveSelection = useCallback(
    (nextEpisode: { number: number } | undefined, nextTranslation: { id: number } | undefined) => {
      if (validShikimoriId === null || !nextEpisode || !nextTranslation) {
        return;
      }

      void playerApi
        .saveProgress({
          shikimoriId: validShikimoriId,
          episode: nextEpisode.number,
          translationId: nextTranslation.id,
          position: 0,
          duration: 0,
        })
        .catch(() => undefined);
    },
    [validShikimoriId],
  );

  const goBack = () =>
    router.canGoBack() ? router.back() : router.replace("/(tabs)/home");

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={goBack}>
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </Pressable>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {data?.title ?? t("watch.player")}
        </Text>
      </View>

      {loading && !data ? <LoadingState label={t("watch.loading")} /> : null}
      {error ? <ErrorState message={error} onRetry={() => void refetch()} /> : null}

      {!loading && !error && data && !episode ? (
        <ErrorState message={t("watch.noSources")} />
      ) : null}

      {episode ? (
        <View style={styles.playerWrapper}>
          <WebView
            key={episode.url}
            source={
              isHlsUrl(episode.url)
                ? { html: buildHlsHtml(episode.url), baseUrl: "https://anilibria.top/" }
                : { uri: normalizeUrl(episode.url) }
            }
            style={styles.player}
            originWhitelist={["*"]}
            allowsFullscreenVideo
            allowsInlineMediaPlayback
            mediaPlaybackRequiresUserAction={false}
            javaScriptEnabled
            domStorageEnabled
            startInLoadingState
            renderLoading={() => (
              <View style={styles.webviewLoading}>
                <LoadingState label={t("watch.buffering")} />
              </View>
            )}
          />
        </View>
      ) : null}

      {translation && translation.episodes.length > 1 ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("watch.episodes")}</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipsRow}
          >
            {translation.episodes.map((item) => {
              const active = item.number === episode?.number;

              return (
                <Pressable
                  key={item.number}
                  style={[styles.chip, active && styles.chipActive]}
                  onPress={() => {
                    setEpisodeNumber(item.number);
                    saveSelection(item, translation);
                  }}
                >
                  <Text style={[styles.chipText, active && styles.chipTextActive]}>
                    {item.number}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      ) : null}

      {data && data.translations.length > 0 ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("watch.voiceover")}</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipsRow}
          >
            {data.translations.map((item) => {
              const active = item.id === translation?.id;

              return (
                <Pressable
                  key={item.id}
                  style={[styles.chip, active && styles.chipActive]}
                  onPress={() => {
                    setTranslationId(item.id);
                    saveSelection(item.episodes[0] ?? episode, item);
                  }}
                >
                  <Text style={[styles.chipText, active && styles.chipTextActive]}>
                    {item.title}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      ) : null}
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
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      paddingHorizontal: 16,
      paddingTop: 10,
      paddingBottom: 16,
    },
    backButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.surface,
      alignItems: "center",
      justifyContent: "center",
    },
    headerTitle: {
      flex: 1,
      fontSize: 20,
      fontWeight: "700",
      color: colors.text,
    },
    playerWrapper: {
      width: "100%",
      aspectRatio: 16 / 9,
      backgroundColor: "#000000",
    },
    player: {
      flex: 1,
      backgroundColor: "#000000",
    },
    webviewLoading: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "#000000",
      justifyContent: "center",
    },
    section: {
      paddingTop: 20,
    },
    sectionTitle: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.textMuted,
      marginBottom: 10,
      paddingHorizontal: 16,
    },
    chipsRow: {
      gap: 10,
      paddingHorizontal: 16,
      paddingBottom: 4,
    },
    chip: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
    },
    chipActive: {
      borderColor: colors.primary,
      backgroundColor: colors.primary,
    },
    chipText: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.textMuted,
    },
    chipTextActive: {
      color: colors.primaryText,
    },
  });
};
