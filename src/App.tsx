import { useState } from "react";
import { LanguageSelect } from "./components/LanguageSelect";
import { TextChat } from "./components/TextChat";
import { VoiceChat } from "./components/VoiceChat";

type Language = "en" | "jp";
type Page = "language" | "text-chat" | "voice-chat";

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("text-chat");
  const [language, setLanguage] = useState<Language>("en");

  const handleLanguageSelect = (lang: Language, mode: "text" | "voice") => {
    setLanguage(lang);
    setCurrentPage(mode === "text" ? "text-chat" : "voice-chat");
  };

  const handleBack = () => {
    setCurrentPage("language");
  };

  return (
    <>
      {currentPage === "language" && (
        <LanguageSelect onSelect={handleLanguageSelect} />
      )}
      {currentPage === "text-chat" && (
        <TextChat language={language} onBack={handleBack} />
      )}
      {currentPage === "voice-chat" && (
        <VoiceChat language={language} onBack={handleBack} />
      )}
    </>
  );
}
