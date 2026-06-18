import { Feather } from "@expo/vector-icons";
import { Redirect, useRouter } from "expo-router";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../constants/images";
import { useAuth } from "@clerk/expo";

export default function OnboardingScreen() {
  const router = useRouter();
  const { isSignedIn, isLoaded } = useAuth();

  if (isLoaded && isSignedIn) {
    return <Redirect href="/" />;
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
      <View className="flex-1 px-6 pb-10 pt-4">
        {/* Header Section */}
        <View className="flex-row items-center w-full justify-center h-20">
          <Image
            source={images.mascotLogo}
            className="size-20  mr-1"
            resizeMode="contain"
          />
          <Text className="text-3xl font-extrabold text-[#111827] tracking-tight">
            muolingo
          </Text>
        </View>

        {/* Text Content */}
        <View className="mt-12 w-full">
          <Text className="text-[40px] leading-[48px] font-extrabold text-[#111827]">
            Your AI language{"\n"}
            <Text className="text-[#5B4CFA]">teacher.</Text>
          </Text>

          <Text className="text-[#6B7280] text-lg mt-4 font-medium pr-8">
            Real conversations, personalized lessons, anytime, anywhere.
          </Text>
        </View>

        {/* Center Content Section */}
        <View className="flex-1 justify-center items-center mt-8 relative w-full">
          <Image
            source={images.mascotWelcome}
            className="w-full h-full max-h-[360px]"
            resizeMode="contain"
          />

          {/* Hello! Speech Bubble */}
          <View className="absolute left-[2%] top-[10%] items-end">
            <View className="bg-[#EFF6FF] px-4 py-2 rounded-2xl shadow-sm border border-[#DBEAFE]">
              <Text className="text-[#1E3A8A] font-bold text-base">Hello!</Text>
            </View>
            {/* Tail */}
            <View
              style={{
                width: 0,
                height: 0,
                backgroundColor: "transparent",
                borderStyle: "solid",
                borderLeftWidth: 6,
                borderRightWidth: 6,
                borderTopWidth: 8,
                borderLeftColor: "transparent",
                borderRightColor: "transparent",
                borderTopColor: "#EFF6FF",
                marginRight: 12,
                marginTop: -1,
              }}
            />
          </View>

          {/* ¡Hola! Speech Bubble */}
          <View className="absolute right-[5%] top-[0%] items-start">
            <View className="bg-[#EEF2FF] px-4 py-2 rounded-2xl shadow-sm border border-[#E0E7FF]">
              <Text className="text-[#4F46E5] font-bold text-base">¡Hola!</Text>
            </View>
            {/* Tail */}
            <View
              style={{
                width: 0,
                height: 0,
                backgroundColor: "transparent",
                borderStyle: "solid",
                borderLeftWidth: 6,
                borderRightWidth: 6,
                borderTopWidth: 8,
                borderLeftColor: "transparent",
                borderRightColor: "transparent",
                borderTopColor: "#EEF2FF",
                marginLeft: 12,
                marginTop: -1,
              }}
            />
          </View>

          {/* 你好! Speech Bubble */}
          <View className="absolute right-[2%] top-[30%] items-start">
            <View className="bg-[#FEF2F2] px-4 py-2 rounded-2xl shadow-sm border border-[#FEE2E2]">
              <Text className="text-[#EF4444] font-bold text-base">你好!</Text>
            </View>
            {/* Tail */}
            <View
              style={{
                width: 0,
                height: 0,
                backgroundColor: "transparent",
                borderStyle: "solid",
                borderLeftWidth: 6,
                borderRightWidth: 6,
                borderTopWidth: 8,
                borderLeftColor: "transparent",
                borderRightColor: "transparent",
                borderTopColor: "#FEF2F2",
                marginLeft: 12,
                marginTop: -1,
              }}
            />
          </View>
        </View>

        {/* Page Indicator Dots */}
        {/* <View className="flex-row justify-center items-center mt-6" style={{ gap: 8 }}>
          <View className="w-2.5 h-2.5 rounded-full bg-[#5B4CFA]" />
          <View className="w-2.5 h-2.5 rounded-full bg-[#E5E7EB]" />
          <View className="w-2.5 h-2.5 rounded-full bg-[#E5E7EB]" />
          <View className="w-2.5 h-2.5 rounded-full bg-[#E5E7EB]" />
        </View> */}

        {/* Bottom Actions Section */}
        <View className="w-full mt-auto pt-8">
          <TouchableOpacity 
            onPress={() => router.push("/(auth)/sign-up")}
            className="w-full bg-[#5B4CFA] py-4 rounded-2xl flex-row items-center justify-center shadow-sm active:opacity-80"
          >
            <Text className="text-white text-xl font-bold">Get Started</Text>
            <View className="absolute right-6">
              <Feather name="chevron-right" size={24} color="white" />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
