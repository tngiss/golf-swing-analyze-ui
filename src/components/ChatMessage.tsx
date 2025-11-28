import { motion } from "motion/react";
import { Bot, User } from "lucide-react";

interface ChatMessageProps {
  message: {
    sender: "user" | "ai";
    text: string;
  };
  isAnalyzing?: boolean;
}

export function ChatMessage({ message, isAnalyzing }: ChatMessageProps) {
  const isUser = message.sender === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className={`flex gap-3 items-end ${isUser ? "flex-row-reverse" : "flex-row"}`}
    >
      {/* Avatar */}
      <div
        className={`
        flex-shrink-0 size-8 mb-1 rounded-full flex items-center justify-center
        ${
          isUser
            ? "hidden"
            : "bg-gradient-to-br from-emerald-600 to-emerald-700"
        }
      `}
      >
        {isUser ? (
          <User className="w-5 h-5 text-white" />
        ) : (
          <Bot className="w-5 h-5 text-white" />
        )}
      </div>

      {/* Message bubble */}
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        className={`
          max-w-[80%] px-5 py-3 rounded-2xl backdrop-blur-sm
          ${
            isUser
              ? "bg-blue-500/20 border border-blue-500/30"
              : "bg-zinc-800/50 border border-zinc-700/50"
          }
        `}
      >
        {isAnalyzing ? (
          <div className="flex items-center gap-3">
            <span className="text-zinc-300">{message.text}</span>
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="flex gap-1"
            >
              <div className="size-1 bg-emerald-400 rounded-full" />
              <div
                className="size-1 bg-emerald-400 rounded-full"
                style={{ animationDelay: "0.2s" }}
              />
              <div
                className="size-1 bg-emerald-400 rounded-full"
                style={{ animationDelay: "0.4s" }}
              />
            </motion.div>
          </div>
        ) : (
          <p className="text-zinc-200 whitespace-pre-wrap">{message.text}</p>
        )}
      </motion.div>
    </motion.div>
  );
}
