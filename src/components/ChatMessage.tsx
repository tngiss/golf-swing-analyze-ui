import { motion } from "motion/react";
import type { Message } from "./TextChat";
import { Bot } from "lucide-react";

interface ChatMessageProps {
  message: Message;
  isAnalyzing?: boolean;
}

export function ChatMessage({
  message,
  isAnalyzing: isAnalyzingProp,
}: ChatMessageProps) {
  const isUser = message.sender === "user";
  const analyzing = isAnalyzingProp ?? message.isAnalyzing;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className={`flex w-full items-end gap-2 ${isUser ? "justify-end" : "justify-start"}`}
    >
      {!isUser && (
        <div className="flex-shrink-0 size-8 mb-1 rounded-full flex items-center justify-center bg-gradient-to-br from-emerald-600 to-emerald-700">
          <Bot className="w-5 h-5 text-white" />
        </div>
      )}
      <div className="max-w-[80%]">
        {message.image && !analyzing && (
          <div className="mb-4 h-96 overflow-hidden">
            <img
              src={message.image}
              alt=""
              className="w-auto h-full object-cover rounded-xl"
            />
          </div>
        )}
        <div
          className={`w-full rounded-2xl px-4 py-3 border ${isUser ? "bg-emerald-600/20 border-emerald-600/30" : "bg-zinc-800/60 border-zinc-700/60"}`}
        >
          <div className="flex items-center gap-2">
            <div className="whitespace-pre-wrap text-sm md:text-base text-zinc-100">
              {message.text}
            </div>
            {analyzing && (
              <div className="flex items-center gap-1 pl-1">
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    className={`w-1.5 h-1.5 rounded-full ${
                      isUser ? "bg-emerald-300" : "bg-zinc-300"
                    }`}
                    animate={{ opacity: [0.3, 1, 0.3], y: [0, -2, 0] }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      delay: i * 0.15,
                      ease: "easeInOut",
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
