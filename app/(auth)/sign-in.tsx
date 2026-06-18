import { useSSO } from "@clerk/expo";
import { useSignIn } from "@clerk/expo/legacy";
import { Feather, FontAwesome } from "@expo/vector-icons";
import * as Linking from "expo-linking";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import React, { useEffect, useRef, useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../../constants/images";

WebBrowser.maybeCompleteAuthSession();

export default function SignInScreen() {
  const router = useRouter();
  const { isLoaded, signIn, setActive } = useSignIn();
  const { startSSOFlow } = useSSO();

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  // Modal State
  const [modalVisible, setModalVisible] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const inputRef = useRef<TextInput>(null);

  // Auto-focus input when modal becomes visible
  useEffect(() => {
    if (modalVisible) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [modalVisible]);

  // Handle verification code changes
  const handleCodeChange = async (text: string) => {
    if (!isLoaded) return;

    // Only allow digits
    const cleaned = text.replace(/[^0-9]/g, "");
    setVerificationCode(cleaned);

    if (cleaned.length === 6) {
      try {
        const result = await signIn.attemptFirstFactor({
          strategy: "email_code",
          code: cleaned,
        });

        if (result.status === "complete") {
          await setActive({ session: result.createdSessionId });
          setModalVisible(false);
          router.replace("/");
        } else {
          console.error("Sign in status not complete", result);
        }
      } catch (err: any) {
        console.error("Verification error:", err);
        if (err.errors && err.errors.length > 0) {
          setEmailError(err.errors[0].message);
        } else {
          setEmailError(err.message || "Invalid verification code");
        }
      }
    }
  };

  const handleSignIn = async () => {
    if (!isLoaded) return;

    // Email validation
    if (!email) {
      setEmailError("Email is required");
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Please enter a valid email address");
    } else {
      setEmailError("");
      try {
        const { supportedFirstFactors } = await signIn.create({
          identifier: email,
        });

        const emailCodeFactor = supportedFirstFactors?.find(
          (factor: any) => factor.strategy === "email_code"
        );

        if (emailCodeFactor && "emailAddressId" in emailCodeFactor) {
          await signIn.prepareFirstFactor({
            strategy: "email_code",
            emailAddressId: (emailCodeFactor as any).emailAddressId,
          });
          setVerificationCode("");
          setModalVisible(true);
        } else {
          setEmailError("Passwordless email sign-in is not enabled for this account");
        }
      } catch (err: any) {
        console.error("Sign in error:", err);
        if (err.errors && err.errors.length > 0) {
          setEmailError(err.errors[0].message);
        } else {
          setEmailError(err.message || "An error occurred during sign in");
        }
      }
    }
  };

  const handleResendCode = async () => {
    if (!isLoaded) return;
    try {
      const { supportedFirstFactors } = signIn;
      const emailCodeFactor = supportedFirstFactors?.find(
        (factor: any) => factor.strategy === "email_code"
      );
      if (emailCodeFactor && "emailAddressId" in emailCodeFactor) {
        await signIn.prepareFirstFactor({
          strategy: "email_code",
          emailAddressId: (emailCodeFactor as any).emailAddressId,
        });
      }
    } catch (err: any) {
      console.error("Resend code error:", err);
    }
  };

  const handleSocialAuth = async (strategy: "oauth_google" | "oauth_facebook" | "oauth_apple") => {
    if (!isLoaded) return;
    try {
      const { createdSessionId, setActive: setSessionActive } = await startSSOFlow({
        strategy,
        redirectUrl: Linking.createURL("/"),
      });

      if (createdSessionId) {
        await setSessionActive!({ session: createdSessionId });
        router.replace("/");
      }
    } catch (err: any) {
      console.error("Social auth error:", err);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View className="px-6 pt-4 flex-1">
            {/* Back Button */}
            <TouchableOpacity
              onPress={() => router.back()}
              className="w-10 h-10 items-start justify-center active:opacity-75"
            >
              <Feather name="chevron-left" size={28} color="#111827" />
            </TouchableOpacity>

            {/* Header copy */}
            <View className="mt-4">
              <Text className="text-3xl font-poppins-bold text-[#111827] tracking-tight">
                Sign in to your account
              </Text>
              <Text className="text-[#6B7280] font-poppins text-base mt-1.5">
                Welcome back! We missed you! 👋
              </Text>
            </View>

            {/* Mascot Auth Image */}
            <View className="items-center justify-center mt-6 z-0" style={{ marginBottom: -30 }}>
              <Image
                source={images.mascotAuth}
                className="w-55 h-50"
                resizeMode="contain"
              />
            </View>

            {/* Form Inputs */}
            <View className="gap-4 z-10" style={{ zIndex: 10 }}>
              {/* Email Input */}
              <View className="border border-neutral-200 rounded-2xl px-4 py-2 bg-white relative">
                <Text className="text-xs text-neutral-400 font-poppins-bold">Email</Text>
                <TextInput
                  placeholder="alex@gmail.com"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    if (emailError) setEmailError("");
                  }}
                  style={{
                    fontSize: 11,
                    color: "#111827",
                    fontFamily: "Poppins_700Bold",
                    padding: 0,
                    marginTop: 0,
                    height: 24,
                  }}
                />
              </View>
              {emailError ? (
                <Text className="text-red-500 text-xs font-poppins px-1 -mt-2">{emailError}</Text>
              ) : null}
            </View>

            {/* Main Action Button */}
            <TouchableOpacity
              onPress={handleSignIn}
              className="w-full bg-[#5B4CFA] py-4 rounded-2xl items-center justify-center mt-6 active:opacity-90 shadow-sm"
            >
              <Text className="text-white text-lg font-poppins-bold">Sign In</Text>
            </TouchableOpacity>

            {/* Divider */}
            <View className="flex-row items-center my-6">
              <View className="flex-1 h-[1px] bg-neutral-200" />
              <Text className="mx-4 text-neutral-400 font-poppins text-sm">
                or continue with
              </Text>
              <View className="flex-1 h-[1px] bg-neutral-200" />
            </View>

            {/* Social Buttons */}
            <View className="gap-3">
              <TouchableOpacity
                onPress={() => handleSocialAuth("oauth_google")}
                className="w-full border border-neutral-200 bg-white rounded-2xl py-3.5 flex-row items-center justify-center active:opacity-85 shadow-xs"
              >
                <FontAwesome name="google" size={20} color="#EA4335" style={{ marginRight: 10 }} />
                <Text className="text-neutral-800 text-base font-poppins-bold">
                  Continue with Google
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handleSocialAuth("oauth_facebook")}
                className="w-full border border-neutral-200 bg-white rounded-2xl py-3.5 flex-row items-center justify-center active:opacity-85 shadow-xs"
              >
                <FontAwesome name="facebook" size={20} color="#1877F2" style={{ marginRight: 10 }} />
                <Text className="text-neutral-800 text-base font-poppins-bold">
                  Continue with Facebook
                </Text>
              </TouchableOpacity>
            </View>

            {/* Footer Link */}
            <View className="flex-row justify-center items-center mt-8 pb-4">
              <Text className="text-[#6B7280] font-poppins text-sm">
                {"Don't have an account? "}
              </Text>
              <TouchableOpacity onPress={() => router.push("/(auth)/sign-up")}>
                <Text className="text-[#5B4CFA] font-poppins-bold text-sm">
                  Sign up
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Verification Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.keyboardAvoidingView}
          >
            <View style={styles.modalCard}>
              {/* Modal Header */}
              <View className="flex-row justify-between items-center w-full mb-3">
                <Text className="text-xl font-poppins-bold text-neutral-800">
                  Verify your email
                </Text>
                <TouchableOpacity
                  onPress={() => setModalVisible(false)}
                  className="w-8 h-8 items-center justify-center rounded-full bg-neutral-100"
                >
                  <Feather name="x" size={18} color="#4B4B4B" />
                </TouchableOpacity>
              </View>

              {/* Modal Copy */}
              <Text className="text-neutral-500 font-poppins text-sm leading-5 mb-4 text-center">
                {"We've sent a 6-digit verification code to\n"}
                <Text className="font-poppins-bold text-neutral-700">{email}</Text>.{"\n"}
                {"Please enter the code to sign in to your account."}
              </Text>

              {/* 6 Digit display boxes and invisible input overlay */}
              <View className="relative w-full my-4 px-1">
                <View className="flex-row justify-between w-full">
                  {Array(6)
                    .fill(0)
                    .map((_, i) => {
                      const char = verificationCode[i] || "";
                      const isFocused =
                        i === verificationCode.length ||
                        (i === 5 && verificationCode.length === 6);
                      return (
                        <View
                          key={i}
                          className={`w-11 h-14 border-2 rounded-xl justify-center items-center ${isFocused
                            ? "border-[#5B4CFA] bg-[#F5F3FF]"
                            : "border-neutral-200 bg-[#F9FAFB]"
                            }`}
                        >
                          <Text className="text-xl font-poppins-bold text-neutral-800">
                            {char}
                          </Text>
                        </View>
                      );
                    })}
                </View>

                {/* Invisible input overlaying the boxes */}
                <TextInput
                  ref={inputRef}
                  value={verificationCode}
                  onChangeText={handleCodeChange}
                  keyboardType="number-pad"
                  maxLength={6}
                  style={styles.hiddenInput}
                  autoFocus={true}
                />
              </View>

              {/* Help copy */}
              <Text className="text-neutral-400 font-poppins text-xs mt-2 text-center">
                {"Didn't receive the code? "}
                <Text onPress={handleResendCode} className="text-[#5B4CFA] font-poppins-bold">Resend Code</Text>
              </Text>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  keyboardAvoidingView: {
    width: "100%",
    justifyContent: "flex-end",
  },
  modalCard: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: Platform.OS === "ios" ? 44 : 28,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  hiddenInput: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    opacity: 0.01,
  },
});
