import { EmptyState, ErrorState, LoadingState } from "@/components/StateView";
import { StarRating } from "@/components/StarRating";
import { palette } from "@/constants/theme";
import { useLanguage } from "@/hooks/use-language";
import { useReviews } from "@/hooks/use-reviews";
import { useTheme } from "@/hooks/use-theme";
import { getAuthToken, getStoredUser } from "@/lib/user-storage";
import type { User } from "@/types/user-types";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

interface ReviewsSectionProps {
  animeId: string;
}

interface ReviewFormProps {
  initialRating: number;
  initialText: string;
  existing: boolean;
  saving: boolean;
  onSubmit: (rating: number, text: string) => void;
  onDelete: () => void;
}

const formatDate = (iso: string) => {
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? "" : date.toLocaleDateString();
};

function ReviewForm({
  initialRating,
  initialText,
  existing,
  saving,
  onSubmit,
  onDelete,
}: ReviewFormProps) {
  const { colorScheme } = useTheme();
  const { t } = useLanguage();
  const colors = palette[colorScheme];
  const styles = getStyles(colorScheme);

  const [rating, setRating] = useState(initialRating);
  const [text, setText] = useState(initialText);

  const handleSubmit = () => {
    if (rating < 1) {
      Alert.alert(t("common.error"), t("reviews.ratingRequired"));
      return;
    }

    onSubmit(rating, text);
  };

  return (
    <View style={styles.form}>
      <View style={styles.formHeader}>
        <Text style={styles.formTitle}>
          {existing ? t("reviews.yourReview") : t("reviews.writeReview")}
        </Text>
        {existing ? (
          <Pressable hitSlop={8} onPress={onDelete} disabled={saving}>
            <Ionicons name="trash-outline" size={20} color={colors.danger} />
          </Pressable>
        ) : null}
      </View>

      <StarRating value={rating} onChange={setRating} size={30} />

      <TextInput
        style={styles.input}
        value={text}
        onChangeText={setText}
        placeholder={t("reviews.placeholder")}
        placeholderTextColor={colors.textMuted}
        multiline
        maxLength={2000}
      />

      <Pressable
        style={({ pressed }) => [
          styles.submit,
          rating < 1 && styles.submitDisabled,
          pressed && styles.pressed,
        ]}
        onPress={handleSubmit}
        disabled={saving}
      >
        {saving ? (
          <ActivityIndicator color={colors.primaryText} />
        ) : (
          <Text style={styles.submitText}>{t("reviews.submit")}</Text>
        )}
      </Pressable>
    </View>
  );
}

export function ReviewsSection({ animeId }: ReviewsSectionProps) {
  const { colorScheme } = useTheme();
  const { t } = useLanguage();
  const colors = palette[colorScheme];
  const styles = getStyles(colorScheme);

  const { reviews, loading, error, saving, submit, remove, refetch } =
    useReviews(animeId);

  const [user, setUser] = useState<User | null>(null);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    let active = true;

    void (async () => {
      const [token, storedUser] = await Promise.all([
        getAuthToken(),
        getStoredUser(),
      ]);

      if (active) {
        setLoggedIn(Boolean(token));
        setUser(storedUser);
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  const myReview = user ? reviews.find((item) => item.authorId === user.id) : null;

  const average = reviews.length
    ? reviews.reduce((sum, item) => sum + item.rating, 0) / reviews.length
    : 0;

  const handleSubmit = async (rating: number, text: string) => {
    try {
      await submit(rating, text);
    } catch (cause) {
      Alert.alert(
        t("common.error"),
        cause instanceof Error ? cause.message : t("reviews.couldNotSave"),
      );
    }
  };

  const handleDelete = () => {
    Alert.alert(t("reviews.delete"), t("reviews.deleteConfirm"), [
      { text: t("common.cancel"), style: "cancel" },
      {
        text: t("reviews.delete"),
        style: "destructive",
        onPress: () => {
          void (async () => {
            try {
              await remove();
            } catch (cause) {
              Alert.alert(
                t("common.error"),
                cause instanceof Error ? cause.message : t("reviews.couldNotDelete"),
              );
            }
          })();
        },
      },
    ]);
  };

  return (
    <View style={styles.wrapper}>
      <Text style={styles.sectionTitle}>{t("reviews.title")}</Text>

      {loggedIn ? (
        <ReviewForm
          key={myReview?.id ?? "new"}
          initialRating={myReview?.rating ?? 0}
          initialText={myReview?.text ?? ""}
          existing={Boolean(myReview)}
          saving={saving}
          onSubmit={(rating, text) => void handleSubmit(rating, text)}
          onDelete={handleDelete}
        />
      ) : null}

      {average > 0 ? (
        <View style={styles.summary}>
          <StarRating value={Math.round(average)} />
          <Text style={styles.summaryText}>
            {average.toFixed(1)} · {t("reviews.count", { n: reviews.length })}
          </Text>
        </View>
      ) : null}

      {loading ? <LoadingState label={t("common.loading")} /> : null}
      {error ? <ErrorState message={error} onRetry={() => void refetch()} /> : null}

      {!loading && !error && reviews.length === 0 ? (
        <EmptyState message={t("reviews.empty")} />
      ) : null}

      {reviews.map((review) => (
        <View key={review.id} style={styles.reviewCard}>
          <View style={styles.reviewHeader}>
            {review.authorAvatar ? (
              <Image source={{ uri: review.authorAvatar }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Ionicons name="person" size={18} color={colors.textMuted} />
              </View>
            )}
            <View style={styles.authorBlock}>
              <Text style={styles.authorName} numberOfLines={1}>
                {review.authorName}
              </Text>
              <Text style={styles.date}>{formatDate(review.createdAt)}</Text>
            </View>
            <StarRating value={review.rating} size={16} />
          </View>

          {review.text ? <Text style={styles.reviewText}>{review.text}</Text> : null}
        </View>
      ))}
    </View>
  );
}

const getStyles = (scheme: "light" | "dark") => {
  const colors = palette[scheme];

  return StyleSheet.create({
    wrapper: {
      marginTop: 8,
      gap: 14,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: colors.text,
      marginBottom: 8,
    },
    form: {
      gap: 12,
      backgroundColor: colors.surface,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 16,
    },
    formHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    formTitle: {
      fontSize: 15,
      fontWeight: "600",
      color: colors.text,
    },
    input: {
      minHeight: 84,
      textAlignVertical: "top",
      padding: 12,
      borderRadius: 12,
      backgroundColor: colors.surfaceAlt,
      color: colors.text,
      fontSize: 15,
    },
    submit: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      borderRadius: 12,
      paddingVertical: 12,
      backgroundColor: colors.primary,
    },
    submitDisabled: {
      opacity: 0.5,
    },
    submitText: {
      fontSize: 15,
      fontWeight: "600",
      color: colors.primaryText,
    },
    pressed: {
      opacity: 0.85,
    },
    summary: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
    },
    summaryText: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.textMuted,
    },
    reviewCard: {
      gap: 8,
      backgroundColor: colors.surface,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 14,
    },
    reviewHeader: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
    },
    avatar: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: colors.surfaceAlt,
    },
    avatarPlaceholder: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: colors.surfaceAlt,
      alignItems: "center",
      justifyContent: "center",
    },
    authorBlock: {
      flex: 1,
      gap: 2,
    },
    authorName: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.text,
    },
    date: {
      fontSize: 12,
      color: colors.textMuted,
    },
    reviewText: {
      fontSize: 14,
      lineHeight: 21,
      color: colors.text,
    },
  });
};
