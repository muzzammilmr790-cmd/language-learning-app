import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, ScrollView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useUser } from "@clerk/expo";

export default function EditProfileScreen() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [username, setUsername] = useState(user?.username || "");
  
  // Initialize with current values
  const [email, setEmail] = useState(user?.primaryEmailAddress?.emailAddress || "");
  const [phone, setPhone] = useState((user?.unsafeMetadata?.phoneNumber as string) || user?.primaryPhoneNumber?.phoneNumber || "");
  
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!user) return;
    setIsSaving(true);
    console.log("Starting handleSave...");
    try {
      // Basic profile updates
      const updateData: any = {
        firstName,
        lastName,
        unsafeMetadata: {
          ...user.unsafeMetadata,
          phoneNumber: phone,
        }
      };
      if (username) {
        updateData.username = username;
      }
      
      console.log("Updating user with data:", updateData);
      await user.update(updateData);
      console.log("User update successful");

      const currentEmail = user.primaryEmailAddress?.emailAddress || "";

      let messages = [];

      // Email update requires verification flow in Clerk normally
      if (email !== currentEmail && email.trim() !== "") {
        try {
          console.log("Attempting to create email:", email);
          const newEmail = await user.createEmailAddress({ email });
          console.log("Email created, preparing verification...");
          await newEmail.prepareVerification({ strategy: "email_code" });
          messages.push("A verification code has been sent to your new email address.");
        } catch (emailErr: any) {
          console.error("Email update error:", emailErr);
          messages.push(`Email error: ${emailErr.errors?.[0]?.message || "Could not add email"}`);
        }
      }

      console.log("Messages length:", messages.length);
      if (messages.length > 0) {
        if (Platform.OS === 'web') {
          window.alert(`Profile saved.\n\n${messages.join("\n")}`);
          router.back();
        } else {
          Alert.alert("Profile Updated", `Profile saved.\n\n${messages.join("\n")}`, [
            { text: "OK", onPress: () => router.back() }
          ]);
        }
      } else {
        router.back();
      }

    } catch (err: any) {
      console.error("Update Error:", err);
      const errorMsg = err.errors?.[0]?.message || err.message || "Failed to update profile";
      if (Platform.OS === 'web') {
        window.alert(`Error: ${errorMsg}`);
      } else {
        Alert.alert("Error", errorMsg);
      }
    } finally {
      setIsSaving(false);
      console.log("handleSave finished");
    }
  };

  if (!isLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#1CB0F6" />
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }} edges={["top", "left", "right"]}>
      {/* Header */}
      <View className="flex-row items-center px-6 py-4 border-b border-neutral-100">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 items-center justify-center rounded-full active:opacity-70"
        >
          <Feather name="chevron-left" size={28} color="#4B4B4B" />
        </TouchableOpacity>

        <Text className="flex-1 text-xl font-poppins-bold text-[#111827] text-center mr-10">
          Edit Profile
        </Text>
      </View>

      <ScrollView className="flex-1 px-6 pt-6" showsVerticalScrollIndicator={false}>
        <View className="mb-6">
          <Text className="text-sm font-poppins-bold text-neutral-500 mb-2 uppercase">First Name</Text>
          <View className="bg-neutral-50 border border-neutral-200 rounded-2xl px-4 py-3">
            <TextInput
              value={firstName}
              onChangeText={setFirstName}
              placeholder="First Name"
              placeholderTextColor="#9CA3AF"
              className="text-base font-poppins text-[#111827]"
              style={{ outlineStyle: 'none' } as any}
            />
          </View>
        </View>

        <View className="mb-6">
          <Text className="text-sm font-poppins-bold text-neutral-500 mb-2 uppercase">Last Name</Text>
          <View className="bg-neutral-50 border border-neutral-200 rounded-2xl px-4 py-3">
            <TextInput
              value={lastName}
              onChangeText={setLastName}
              placeholder="Last Name"
              placeholderTextColor="#9CA3AF"
              className="text-base font-poppins text-[#111827]"
              style={{ outlineStyle: 'none' } as any}
            />
          </View>
        </View>

        <View className="mb-6">
          <Text className="text-sm font-poppins-bold text-neutral-500 mb-2 uppercase">Username</Text>
          <View className="bg-neutral-50 border border-neutral-200 rounded-2xl px-4 py-3">
            <TextInput
              value={username}
              onChangeText={setUsername}
              placeholder="Username"
              placeholderTextColor="#9CA3AF"
              className="text-base font-poppins text-[#111827]"
              style={{ outlineStyle: 'none' } as any}
              autoCapitalize="none"
            />
          </View>
        </View>

        <View className="mb-6">
          <Text className="text-sm font-poppins-bold text-neutral-500 mb-2 uppercase">Email Address</Text>
          <View className="flex-row items-center bg-neutral-50 border border-neutral-200 rounded-2xl px-4 py-3">
            <Feather name="mail" size={18} color="#9CA3AF" style={{ marginRight: 12 }} />
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="Email Address"
              placeholderTextColor="#9CA3AF"
              className="flex-1 text-base font-poppins text-[#111827]"
              style={{ outlineStyle: 'none' } as any}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
        </View>

        <View className="mb-10">
          <Text className="text-sm font-poppins-bold text-neutral-500 mb-2 uppercase">Phone Number</Text>
          <View className="flex-row items-center bg-neutral-50 border border-neutral-200 rounded-2xl px-4 py-3">
            <Feather name="phone" size={18} color="#9CA3AF" style={{ marginRight: 12 }} />
            <TextInput
              value={phone}
              onChangeText={setPhone}
              placeholder="Phone Number (e.g., +1234567890)"
              placeholderTextColor="#9CA3AF"
              className="flex-1 text-base font-poppins text-[#111827]"
              style={{ outlineStyle: 'none' } as any}
              keyboardType="phone-pad"
            />
          </View>
        </View>
      </ScrollView>

      <View className="p-6 pb-8 border-t border-neutral-100">
        <TouchableOpacity
          onPress={handleSave}
          disabled={isSaving}
          className={`w-full py-4 rounded-2xl items-center shadow-sm ${isSaving ? 'bg-neutral-300' : 'bg-[#5B4CFA]'}`}
          activeOpacity={0.9}
        >
          {isSaving ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="font-poppins-bold text-white text-lg uppercase tracking-wider">
              Save Changes
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
