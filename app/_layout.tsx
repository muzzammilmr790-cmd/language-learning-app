import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useRef } from "react";
import "../global.css";
import { ClerkProvider, useUser } from "@clerk/expo";
import { tokenCache as nativeCache } from "@clerk/expo/token-cache";
import { Platform, View, StyleSheet, useWindowDimensions, Text, Image } from "react-native";
import { PostHogProvider } from "posthog-react-native";
import { posthog } from "../lib/posthog";
import { useLanguageStore } from "../store/useLanguageStore";
import { Feather } from "@expo/vector-icons";
import { images } from "../constants/images";

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

if (!publishableKey) {
  throw new Error("Missing EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY. Please set it in your .env file.");
}

const tokenCache = Platform.OS === "web" ? undefined : nativeCache;

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

function PostHogIdentifier() {
  const { user, isLoaded } = useUser();
  const selectedLanguageId = useLanguageStore((state) => state.selectedLanguageId);
  const previousUserId = useRef<string | null>(null);
  const previousLanguageId = useRef<string | null>(null);

  useEffect(() => {
    if (!isLoaded) return;

    if (!user) {
      if (previousUserId.current) {
        posthog.reset();
        previousUserId.current = null;
        previousLanguageId.current = null;
      }
      return;
    }

    const userId = user.id;
    const isNewUser = previousUserId.current !== userId;
    const hasLanguageChanged = previousLanguageId.current !== selectedLanguageId;

    if (isNewUser || hasLanguageChanged) {
      const properties: Record<string, any> = {};

      if (isNewUser) {
        properties.$set_once = {
          signup_date: new Date().toISOString(),
        };
      }

      properties.preferred_language = selectedLanguageId;

      posthog.identify(userId, properties);

      previousUserId.current = userId;
      previousLanguageId.current = selectedLanguageId;
    }
  }, [isLoaded, user, selectedLanguageId]);

  return null;
}

export default function RootLayout() {
  const { width } = useWindowDimensions();
  const [loaded, error] = useFonts({
    // NOTE: Ensure your .ttf files are placed in the assets/fonts/ directory
    // Alternatively, you can install and use @expo-google-fonts/nunito
    Poppins_400Regular: require("../assets/fonts/Poppins-Regular.ttf"),
    Poppins_700Bold: require("../assets/fonts/Poppins-Bold.ttf"),
    // Poppins_800ExtraBold: require("../assets/fonts/Poppins-ExtraBold.ttf"),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <PostHogProvider client={posthog}>
      <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
        <PostHogIdentifier />
        <View style={Platform.OS === 'web' ? styles.webContainer as any : styles.mobileContainer as any}>
          <View style={Platform.OS === 'web' ? styles.webAppWrapper as any : styles.mobileContainer as any}>
            <Stack>
              <Stack.Screen name="index" options={{ headerShown: false }} />
              <Stack.Screen name="onboarding" options={{ headerShown: false }} />
              <Stack.Screen name="(auth)" options={{ headerShown: false }} />
              <Stack.Screen name="language-selection" options={{ headerShown: false }} />
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="audio-lesson" options={{ headerShown: false }} />
            </Stack>
          </View>
        </View>
      </ClerkProvider>
    </PostHogProvider>
  );
}

const styles = StyleSheet.create({
  mobileContainer: {
    flex: 1,
  },
  webContainer: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
    // Ensure it takes full height on web
    //@ts-ignore
    height: Platform.OS === 'web' ? '100vh' : undefined,
  },
  webAppWrapper: {
    flex: 1,
    width: '100%',
    maxWidth: 480,
    backgroundColor: '#FFFFFF',
    // Clip absolutely positioned elements to this container
    overflow: 'hidden',
    // Box shadow for web
    // @ts-ignore
    boxShadow: '0px 0px 20px rgba(0,0,0,0.5)',
  }
});
