export interface Message {
  id: string;
  role: "user" | "model";
  text: string;
  timestamp: Date;
  translation?: string;
  showTranslation?: boolean;
  isTranslating?: boolean;
}
