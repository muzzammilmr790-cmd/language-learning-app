import React from "react";
import { View, Text, Image, TouchableOpacity, ActivityIndicator } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Message } from "../types/chat";
import { images } from "../constants/images";

interface ChatMessageProps {
  item: Message;
  languageColor: string;
  onTranslate: (msgId: string) => void;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  item,
  languageColor,
  onTranslate,
}) => {
  const isUser = item.role === "user";

  return (
    <View className="my-2">
      <View className={`flex-row ${isUser ? "justify-end" : "justify-start"}`}>
        {!isUser && (
          <Image
            source={images.mascotWelcome}
            className="rounded-full mr-2 self-end bg-[#E6F4FE] p-1 border border-neutral-100"
            style={{ width: 40, height: 40 }}
            resizeMode="contain"
          />
        )}
        <View
          style={{
            backgroundColor: isUser ? languageColor : "#F3F4F6",
            borderBottomLeftRadius: !isUser ? 0 : 20,
            borderBottomRightRadius: isUser ? 0 : 20,
          }}
          className="max-w-[75%] px-4 py-3 rounded-2xl shadow-sm relative"
        >
          <Text
            className={`text-base font-poppins leading-5 ${
              isUser ? "text-white" : "text-[#1F2937]"
            }`}
          >
            {item.text}
          </Text>

          {/* Translation Text Block */}
          {item.showTranslation && item.translation && (
            <View
              className={`mt-2 pt-2 border-t ${
                isUser ? "border-white/20" : "border-neutral-200"
              }`}
            >
              <Text
                className={`text-sm font-poppins italic ${
                  isUser ? "text-white/90" : "text-neutral-500"
                }`}
              >
                {item.translation}
              </Text>
            </View>
          )}

          <View className="flex-row items-center justify-between mt-1">
            <TouchableOpacity
              onPress={() => onTranslate(item.id)}
              className="flex-row items-center"
              disabled={item.isTranslating}
            >
              {item.isTranslating ? (
                <ActivityIndicator
                  size="small"
                  color={isUser ? "white" : languageColor}
                />
              ) : (
                <>
                  <MaterialCommunityIcons
                    name="translate"
                    size={14}
                    color={isUser ? "rgba(255,255,255,0.7)" : "#777777"}
                  />
                  <Text
                    className={`text-[10px] font-poppins ml-1 ${
                      isUser ? "text-white/70" : "text-neutral-400"
                    }`}
                  >
                    {item.showTranslation ? "Hide" : "Translate"}
                  </Text>
                </>
              )}
            </TouchableOpacity>

            <Text
              className={`text-[10px] ${
                isUser ? "text-white/70" : "text-neutral-400"
              }`}
            >
              {item.timestamp.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};
