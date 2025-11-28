import { motion } from "motion/react";
import { MessageSquare, Mic } from "lucide-react";

interface LanguageSelectProps {
  onSelect: (language: "en" | "jp", mode: "text" | "voice") => void;
}

export function LanguageSelect({ onSelect }: LanguageSelectProps) {
  return (
    <div className="min-h-screen py-4 bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 text-white relative overflow-hidden flex items-center justify-center">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-emerald-500/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}

        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1.3, 1, 1.3],
            x: [0, -50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-6">
        {/* Logo and Title */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-5xl md:text-6xl leading-18 mb-4 bg-gradient-to-r from-emerald-400 via-emerald-500 to-blue-500 bg-clip-text text-transparent"
          >
            Golf Swing AI
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-xl text-zinc-400"
          >
            Choose your language to begin
          </motion.p>
        </motion.div>

        {/* Language Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* English Card */}
          <LanguageCard
            language="en"
            title="English"
            subtitle="Start your golf journey"
            gradient="from-emerald-500 to-teal-500"
            delay={0.8}
            onSelect={onSelect}
          />

          {/* Japanese Card */}
          <LanguageCard
            language="jp"
            title="日本語"
            subtitle="ゴルフの旅を始めよう"
            gradient="from-blue-500 to-purple-500"
            delay={1}
            onSelect={onSelect}
          />
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="text-center text-sm text-zinc-600"
        >
          Powered by AI • Analyze • Improve • Excel
        </motion.div>
      </div>
    </div>
  );
}

interface LanguageCardProps {
  language: "en" | "jp";
  title: string;
  subtitle: string;
  gradient: string;
  delay: number;
  onSelect: (language: "en" | "jp", mode: "text" | "voice") => void;
}

function LanguageCard({
  language,
  title,
  subtitle,
  gradient,
  delay,
  onSelect,
}: LanguageCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6 }}
      className="relative group"
    >
      <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl blur-xl -z-10 from-emerald-500/50 to-blue-500/50" />

      <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800/50 rounded-3xl p-8 hover:border-zinc-700/50 transition-all duration-300">
        <div className="flex items-center gap-4 mb-6">
          <div
            className={`w-16 h-16 bg-gradient-to-br ${gradient} rounded-2xl flex items-center justify-center text-3xl shadow-xl`}
          >
            {language === "en" ? "🇬🇧" : "🇯🇵"}
          </div>
          <div>
            <h2 className="text-3xl mb-1">{title}</h2>
            <p className="text-zinc-500">{subtitle}</p>
          </div>
        </div>

        <div className="space-y-3">
          {/* Text Chat Option */}
          <motion.button
            whileHover={{ scale: 1.02, x: 5 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(language, "text")}
            className={`w-full flex items-center gap-4 p-5 bg-gradient-to-br ${gradient} rounded-2xl text-white shadow-lg hover:shadow-xl transition-all group/btn`}
          >
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover/btn:bg-white/30 transition-colors">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div className="flex-1 text-left">
              <div className="font-medium">
                {language === "en" ? "Text Chat" : "テキストチャット"}
              </div>
              <div className="text-sm text-white/80">
                {language === "en" ? "Type your questions" : "質問を入力"}
              </div>
            </div>
            <motion.div
              className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center"
              whileHover={{ x: 5 }}
            >
              <span className="text-xl">→</span>
            </motion.div>
          </motion.button>

          {/* Voice Chat Option */}
          <motion.button
            whileHover={{ scale: 1.02, x: 5 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(language, "voice")}
            className="w-full flex items-center gap-4 p-5 bg-zinc-800/50 border border-zinc-700/50 rounded-2xl text-white hover:bg-zinc-800 hover:border-zinc-600/50 transition-all group/btn"
          >
            <div
              className={`w-12 h-12 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center group-hover/btn:scale-110 transition-transform`}
            >
              <Mic className="w-6 h-6" />
            </div>
            <div className="flex-1 text-left">
              <div className="font-medium">
                {language === "en" ? "Voice Chat" : "ボイスチャット"}
              </div>
              <div className="text-sm text-zinc-400">
                {language === "en" ? "Speak naturally" : "自然に話す"}
              </div>
            </div>
            <motion.div
              className="w-8 h-8 bg-zinc-700/50 rounded-full flex items-center justify-center"
              whileHover={{ x: 5 }}
            >
              <span className="text-xl">→</span>
            </motion.div>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
