import { palette } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "expo-status-bar";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { router } from "expo-router";
import { signUpSchema, SignUpSchema } from "./auth.schema";

const USER_STORAGE_KEY = "user";
const USER_AUTH_STORAGE_KEY = "user_auth";

export default function SignUpForm() {
  const { colorScheme } = useTheme();
  const colors = palette[colorScheme];
  const styles = getStyles(colorScheme);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SignUpSchema>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  const onSubmit = async ({ confirmPassword, ...user }: SignUpSchema) => {
    try {
      await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
      await AsyncStorage.setItem(USER_AUTH_STORAGE_KEY, JSON.stringify(true));
      reset();
      Alert.alert("Success", "Account created");
      router.replace("/auth/sign-in");
    } catch (error) {
      console.error("Sign up failed:", error);
      Alert.alert("Error", "Could not create your account. Please try again.");
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
                <Text style={styles.logoText}>A</Text>
              </View>
            </View>

            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>join to travas</Text>

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
                name="name"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View style={styles.field}>
                    <Text style={styles.label}>Nickname</Text>
                    <View style={[styles.inputWrapper, errors.name && styles.inputError]}>
                      <TextInput
                        style={styles.input}
                        placeholder="Твой никнейм"
                        placeholderTextColor={colors.textMuted}
                        autoCapitalize="none"
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                      />
                    </View>
                    {errors.name && <Text style={styles.errorText}>{errors.name.message}</Text>}
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
                        placeholder="••••••••"
                        placeholderTextColor={colors.textMuted}
                        secureTextEntry
                        autoCapitalize="none"
                        autoComplete="new-password"
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

              <Controller
                control={control}
                name="confirmPassword"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View style={styles.field}>
                    <Text style={styles.label}>Confirm Password</Text>
                    <View style={[styles.inputWrapper, errors.confirmPassword && styles.inputError]}>
                      <TextInput
                        style={styles.input}
                        placeholder="••••••••"
                        placeholderTextColor={colors.textMuted}
                        secureTextEntry
                        autoCapitalize="none"
                        autoComplete="new-password"
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                      />
                    </View>
                    {errors.confirmPassword && (
                      <Text style={styles.errorText}>{errors.confirmPassword.message}</Text>
                    )}
                  </View>
                )}
              />

              <Pressable
                style={({ pressed }) => [
                  styles.button,
                  styles.primaryButton,
                  pressed && styles.pressed,
                ]}
                onPress={() => handleSubmit(onSubmit)()}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <ActivityIndicator color={colors.primaryText} />
                ) : (
                  <Text style={styles.buttonText}>Sign up</Text>
                )}
              </Pressable>

              <Pressable onPress={() => router.push("/auth/sign-in")} style={styles.footerLink}>
                <Text style={styles.footerText}>Уже есть аккаунт? Войти</Text>
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
