import { useAuth, useUser } from "@clerk/expo";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Image, Text, TouchableOpacity, View, StyleSheet, ScrollView, Alert, Modal, TouchableWithoutFeedback } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { images } from "../../constants/images";
import { useLanguageStore } from "../../store/useLanguageStore";

export default function ProfileScreen() {
  const { signOut } = useAuth();
  const { user } = useUser();
  const router = useRouter();
  const { getSelectedLanguage, setSelectedLanguageId } = useLanguageStore();
  const selectedLanguage = getSelectedLanguage();
  
  const [showPickerModal, setShowPickerModal] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    router.replace("/onboarding");
  };

  const handleClearStorage = async () => {
    try {
      setSelectedLanguageId(null);
      await AsyncStorage.clear();
      router.replace("/language-selection");
    } catch (e) {
      console.error("Failed to clear AsyncStorage:", e);
    }
  };

  const handleImageSelect = async (useCamera: boolean) => {
    try {
      if (useCamera) {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission needed', 'Camera permission is required to take a photo.');
          return;
        }
      } else {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission needed', 'Gallery permission is required to select a photo.');
          return;
        }
      }

      const options: ImagePicker.ImagePickerOptions = {
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
        base64: true,
      };

      const result = useCamera
        ? await ImagePicker.launchCameraAsync(options)
        : await ImagePicker.launchImageLibraryAsync(options);

      if (!result.canceled && result.assets?.[0]?.base64) {
        const base64 = `data:image/jpeg;base64,${result.assets[0].base64}`;
        
        await user?.setProfileImage({
          file: base64,
        });
        
        // Removed success alert for smoother UX
      }
    } catch (err: any) {
      console.error('Error updating profile image:', err);
      Alert.alert('Error', err.message || 'Failed to update profile image');
    }
  };

  const showImagePickerOptions = () => {
    setShowPickerModal(true);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }} edges={["top", "left", "right"]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <View className="items-center py-6 px-6 border-b border-neutral-100">
          <TouchableOpacity 
            onPress={showImagePickerOptions}
            className="w-24 h-24 rounded-full bg-neutral-50 items-center justify-center mb-4 border-2 border-neutral-200 overflow-hidden relative active:opacity-80"
          >
            {user?.imageUrl ? (
              <Image
                source={{ uri: user.imageUrl }}
                style={{ width: '100%', height: '100%' }}
                resizeMode="cover"
              />
            ) : (
              <Image
                source={images.mascotWelcome}
                style={{ width: 80, height: 80 }}
                resizeMode="contain"
              />
            )}
            <View className="absolute bottom-0 w-full bg-black/40 py-1 items-center">
              <Text className="text-white text-[10px] font-poppins-bold">EDIT</Text>
            </View>
          </TouchableOpacity>
          <Text className="text-2xl font-poppins-bold text-[#111827]">
            {user?.fullName || user?.firstName || 'My Profile'}
          </Text>
          <Text className="text-neutral-500 font-poppins text-sm mt-1">
            {user?.primaryEmailAddress?.emailAddress || 'Language Learner'}
          </Text>
        </View>

        {/* Selected Language Details */}
        {selectedLanguage && (
          <View className="px-6 py-4 border-b border-neutral-100 bg-neutral-50">
            <Text className="text-xs font-poppins-bold text-neutral-400 uppercase tracking-wider mb-2">
              Learning Language
            </Text>
            <View className="flex-row items-center bg-white p-3 rounded-2xl border border-neutral-200">
              <View className="w-10 h-10 rounded-full bg-neutral-50 items-center justify-center mr-3 border border-neutral-100 overflow-hidden">
                {selectedLanguage.flag.includes('http') ? (
                  <Image source={{ uri: selectedLanguage.flag }} style={{ width: 24, height: 24, borderRadius: 12 }} resizeMode="cover" />
                ) : (
                  <Text className="text-xl">{selectedLanguage.flag}</Text>
                )}
              </View>
              <View className="flex-1">
                <Text className="font-poppins-bold text-[#111827]">
                  {selectedLanguage.name}
                </Text>
                <Text className="text-neutral-500 text-xs font-poppins mt-0.5">
                  Native name: {selectedLanguage.nativeName}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Settings / Actions */}
        <View className="px-6 py-6 gap-4">
          <Text className="text-xs font-poppins-bold text-neutral-400 uppercase tracking-wider mb-1">
            Settings & Utilities
          </Text>

          {/* Edit Profile Link */}
          <TouchableOpacity
            onPress={() => router.push("/edit-profile")}
            className="flex-row items-center justify-between bg-white p-4 rounded-2xl border border-neutral-200 active:opacity-85"
          >
            <View className="flex-row items-center">
              <View className="bg-green-50 p-2 rounded-xl mr-3">
                <Feather name="user" size={18} color="#22C55E" />
              </View>
              <Text className="font-poppins-bold text-[#111827]">
                Edit Profile
              </Text>
            </View>
            <Feather name="chevron-right" size={20} color="#AFAFAF" />
          </TouchableOpacity>

          {/* Change Language Link */}
          <TouchableOpacity
            onPress={() => router.push("/language-selection")}
            className="flex-row items-center justify-between bg-white p-4 rounded-2xl border border-neutral-200 active:opacity-85"
          >
            <View className="flex-row items-center">
              <View className="bg-blue-50 p-2 rounded-xl mr-3">
                <Feather name="globe" size={18} color="#1CB0F6" />
              </View>
              <Text className="font-poppins-bold text-[#111827]">
                Change Language
              </Text>
            </View>
            <Feather name="chevron-right" size={20} color="#AFAFAF" />
          </TouchableOpacity>

          {/* Clear Storage Utility */}
          <TouchableOpacity
            onPress={handleClearStorage}
            className="flex-row items-center justify-between bg-white p-4 rounded-2xl border border-neutral-200 active:opacity-85"
          >
            <View className="flex-row items-center">
              <View className="bg-red-50 p-2 rounded-xl mr-3">
                <Feather name="trash-2" size={18} color="#EF4444" />
              </View>
              <Text className="font-poppins-bold text-[#111827]">
                Clear App Storage
              </Text>
            </View>
            <Feather name="chevron-right" size={20} color="#AFAFAF" />
          </TouchableOpacity>

          {/* Sign Out Action */}
          <TouchableOpacity
            onPress={handleSignOut}
            className="flex-row items-center justify-between bg-white p-4 rounded-2xl border border-neutral-200 active:opacity-85"
          >
            <View className="flex-row items-center">
              <View className="bg-neutral-100 p-2 rounded-xl mr-3">
                <Feather name="log-out" size={18} color="#4B4B4B" />
              </View>
              <Text className="font-poppins-bold text-[#111827]">
                Sign Out
              </Text>
            </View>
            <Feather name="chevron-right" size={20} color="#AFAFAF" />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Image Picker Modal */}
      <Modal
        visible={showPickerModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowPickerModal(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowPickerModal(false)}>
          <View className="flex-1 bg-black/50 justify-end">
            <TouchableWithoutFeedback>
              <View className="bg-white rounded-t-3xl p-6 pb-10">
                <Text className="text-xl font-poppins-bold text-[#111827] mb-6 text-center">
                  Change Profile Picture
                </Text>
                
                <TouchableOpacity 
                  className="bg-blue-50 p-4 rounded-2xl mb-3 flex-row items-center justify-center active:opacity-80"
                  onPress={() => {
                    setShowPickerModal(false);
                    setTimeout(() => handleImageSelect(true), 300);
                  }}
                >
                  <Feather name="camera" size={20} color="#1CB0F6" />
                  <Text className="font-poppins-bold text-[#1CB0F6] ml-3 text-lg">Take Photo</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  className="bg-neutral-100 p-4 rounded-2xl mb-3 flex-row items-center justify-center active:opacity-80"
                  onPress={() => {
                    setShowPickerModal(false);
                    setTimeout(() => handleImageSelect(false), 300);
                  }}
                >
                  <Feather name="image" size={20} color="#4B4B4B" />
                  <Text className="font-poppins-bold text-[#4B4B4B] ml-3 text-lg">Choose from Gallery</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  className="p-4 rounded-2xl mt-2 flex-row items-center justify-center active:opacity-80"
                  onPress={() => setShowPickerModal(false)}
                >
                  <Text className="font-poppins-bold text-[#EF4444] text-lg">Cancel</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 40,
  },
});
