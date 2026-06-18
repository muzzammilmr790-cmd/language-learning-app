import { Text, StyleSheet, ActivityIndicator, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { AnimatedPressable } from "./AnimatedPressable";

interface PrimaryButtonProps {
  label: string;
  onPress: () => void;
  color?: string;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ComponentProps<typeof Feather>["name"];
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  label,
  onPress,
  color = "#5B4CFA",
  disabled = false,
  loading = false,
  icon,
}) => {
  return (
    <AnimatedPressable
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.button,
        { backgroundColor: disabled ? "#E5E5E5" : color },
        disabled && styles.disabled,
      ]}
      className="py-4 rounded-2xl items-center shadow-sm"
    >
      {loading ? (
        <ActivityIndicator color="white" />
      ) : (
        <View className="flex-row items-center justify-center">
          <Text
            className={`text-base font-poppins-bold uppercase tracking-wider ${
              disabled ? "text-neutral-400" : "text-white"
            } ${icon ? "mr-2" : ""}`}
          >
            {label}
          </Text>
          {icon && (
            <Feather
              name={icon}
              size={18}
              color={disabled ? "#A3A3A3" : "white"}
            />
          )}
        </View>
      )}
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  button: {
    borderBottomWidth: 4,
    borderColor: "rgba(0,0,0,0.15)",
  },
  disabled: {
    borderColor: "#D4D4D4",
  },
});
