import { palette } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { zodResolver } from "@hookform/resolvers/zod";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { signInSchema, SignInSchema } from "./auth.schema";

const USER_STORAGE_KEY = "user";

export default function SignIn() {
  const { colorScheme } = useTheme();
  const colors = palette[colorScheme];
  const styles = getStyles(colorScheme);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SignInSchema>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: SignInSchema) => {
    try {
      const stored = await AsyncStorage.getItem(USER_STORAGE_KEY);
      const user = stored ? JSON.parse(stored) : null;

      if (!user || user.email !== data.email || user.password !== data.password) {
        Alert.alert("Error", "Invalid email or password");
        return;
      }

      reset();
      router.replace("/home");
    } catch (error) {
      console.error("Sign in failed:", error);
      Alert.alert("Error", "Could not log in. Please try again.");
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
      <FlatList
        data={[]}
        renderItem={() => null}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        bounces={false}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            <Text style={styles.headerBrand}>Travas</Text>

            <View style={styles.logoOuterCircle}>
              <View style={styles.logoInnerCircle}>
                <Text style={styles.logoText}>T</Text>
              </View>
            </View>

            <Text style={styles.title}>Welcome back</Text>
            <Text style={styles.subtitle}>Sign in to continue</Text>

            <View style={styles.formContainer}>
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View style={styles.field}>
                    <Text style={styles.label}>Email</Text>
                    <View style={[styles.inputWrapper, errors.email && styles.inputError]}>
                      <TextInput
                        style={styles.input}
                        placeholder="name@example.com"
                        placeholderTextColor={colors.textMuted}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoComplete="email"
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                      />
                    </View>
                    {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}
                  </View>
                )}
              />

              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View style={styles.field}>
                    <Text style={styles.label}>Password</Text>
                    <View style={[styles.inputWrapper, errors.password && styles.inputError]}>
                      <TextInput
                        style={styles.input}
                        placeholder="Your password"
                        placeholderTextColor={colors.textMuted}
                        secureTextEntry
                        autoCapitalize="none"
                        autoComplete="current-password"
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                      />
                    </View>
                    {errors.password && (
                      <Text style={styles.errorText}>{errors.password.message}</Text>
                    )}
                  </View>
                )}
              />

              <Pressable
                style={({ pressed }) => [styles.button, styles.primaryButton, pressed && styles.pressed]}
                onPress={() => handleSubmit(onSubmit)()}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <ActivityIndicator color={colors.primaryText} />
                ) : (
                  <Text style={styles.buttonText}>Sign in</Text>
                )}
              </Pressable>

              <Pressable onPress={() => router.push("/auth/sign-up")} style={styles.footerLink}>
                <Text style={styles.footerText}>Don&apos;t have an account? Sign up</Text>
              </Pressable>
            </View>
          </>
        }
      />
    </KeyboardAvoidingView>
  );
}

const getStyles = (scheme: "light" | "dark") => {
  const colors = palette[scheme];

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollContent: {
      flexGrow: 1,
      paddingHorizontal: 24,
      paddingTop: 60,
      paddingBottom: 40,
    },
    headerBrand: {
      fontSize: 24,
      fontWeight: "700",
      color: colors.text,
      marginBottom: 40,
    },
    logoOuterCircle: {
      alignSelf: "center",
      width: 140,
      height: 140,
      borderRadius: 70,
      backgroundColor: colors.surface,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 24,
    },
    logoInnerCircle: {
      width: 90,
      height: 90,
      borderRadius: 45,
      backgroundColor: colors.surfaceAlt,
      alignItems: "center",
      justifyContent: "center",
    },
    logoText: {
      fontSize: 48,
      fontWeight: "bold",
      color: colors.text,
    },
    title: {
      fontSize: 28,
      fontWeight: "700",
      color: colors.text,
      textAlign: "center",
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 14,
      color: colors.textMuted,
      textAlign: "center",
      marginBottom: 32,
    },
    formContainer: {
      width: "100%",
    },
    field: {
      marginBottom: 20,
    },
    label: {
      color: colors.text,
      fontSize: 14,
      fontWeight: "600",
      marginBottom: 8,
    },
    inputWrapper: {
      height: 52,
      backgroundColor: colors.surfaceAlt,
      borderRadius: 12,
      paddingHorizontal: 16,
      justifyContent: "center",
    },
    inputError: {
      borderWidth: 1,
      borderColor: colors.danger,
    },
    input: {
      flex: 1,
      fontSize: 15,
      color: colors.text,
    },
    errorText: {
      color: colors.danger,
      fontSize: 12,
      marginTop: 6,
      marginLeft: 4,
    },
    button: {
      height: 52,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "row",
      marginTop: 12,
    },
    primaryButton: {
      backgroundColor: colors.primary,
    },
    pressed: {
      opacity: 0.8,
    },
    buttonText: {
      color: colors.primaryText,
      fontSize: 16,
      fontWeight: "600",
    },
    footerLink: {
      marginTop: 24,
      alignItems: "center",
    },
    footerText: {
      color: colors.textMuted,
      fontSize: 14,
    },
  });
};
