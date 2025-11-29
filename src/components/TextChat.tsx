import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { VideoUpload } from "./VideoUpload";
import { ChatMessage } from "./ChatMessage";
import { RotateCcw, Mic } from "lucide-react";

type Language = "en" | "jp";

export type Message = {
  id: number;
  sender: "user" | "ai";
  text: string;
  image?: string;
  isAnalyzing?: boolean;
};

const conversations = [
  {
    sender: "user" as const,
    text: "最も重要な改善点を1つ教えてください",
  },
  {
    sender: "ai" as const,
    image: "/image.png",
    text: "最も重要な改善点は、ダウンスイングのパスです。クラブヘッドが体のラインの内側を維持することで、曲がりを減らし、真っ直ぐな飛距離を確保できます。ミラーやヘッドラインのドリルを使用して、インサイドアウトのパスを練習してください。",
    delay: 10000,
  },
  {
    sender: "user" as const,
    text: "What's the best drill to practice this? ",
  },
  {
    sender: "ai" as const,
    text: "The best drill to practice the downswing path is the “mirror drill.” Stand in front of a mirror and focus on keeping the club head inside the line of your body throughout the downswing, ensuring an inside-out path. This visual feedback helps reinforce proper technique and consistency.",
    delay: 2000,
  },
];

interface TextChatProps {
  language: Language;
  onBack: () => void;
}

function VoiceInputBar({
  disabled,
  onSend,
}: {
  disabled: boolean;
  onSend: () => void;
}) {
  const [listening, setListening] = useState(false);
  const [level, setLevel] = useState(0);

  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const timeDataRef = useRef<Uint8Array | null>(null);
  const rafRef = useRef<number | null>(null);

  const hardTimeoutRef = useRef<number | null>(null);

  const lastActiveAtRef = useRef<number>(0);
  const calibSumRef = useRef(0);
  const calibCountRef = useRef(0);

  const speakingFramesRef = useRef(0);
  const hasSpeechRef = useRef(false);

  const listeningRef = useRef(false);
  const sentRef = useRef(false);

  const cleanup = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    if (hardTimeoutRef.current) {
      window.clearTimeout(hardTimeoutRef.current);
      hardTimeoutRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((t) => t.stop());
      mediaStreamRef.current = null;
    }
    if (audioCtxRef.current) {
      try {
        audioCtxRef.current.close();
      } catch {}
      audioCtxRef.current = null;
    }
    analyserRef.current = null;
    timeDataRef.current = null;

    calibSumRef.current = 0;
    calibCountRef.current = 0;
    speakingFramesRef.current = 0;
    hasSpeechRef.current = false;
    lastActiveAtRef.current = 0;

    setLevel(0);
  }, []);

  const stop = useCallback(
    (shouldSend: boolean) => {
      if (sentRef.current && shouldSend) return;
      if (shouldSend) sentRef.current = true;

      cleanup();
      listeningRef.current = false;
      setListening(false);

      if (shouldSend) onSend();
    },
    [cleanup, onSend]
  );

  const stopAndMaybeSend = useCallback(() => {
    stop(hasSpeechRef.current && !sentRef.current);
  }, [stop]);

  const startListening = useCallback(async () => {
    if (disabled || listeningRef.current) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true },
        video: false,
      });
      mediaStreamRef.current = stream;

      const AC: any =
        (window as any).AudioContext || (window as any).webkitAudioContext;
      const ctx: AudioContext = new AC();
      audioCtxRef.current = ctx;
      if (ctx.state === "suspended") {
        try {
          await ctx.resume();
        } catch {}
      }

      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 1024;
      analyser.smoothingTimeConstant = 0.6;
      analyserRef.current = analyser;
      source.connect(analyser);

      const time = new Uint8Array(analyser.fftSize);
      timeDataRef.current = time;

      sentRef.current = false;
      listeningRef.current = true;
      setListening(true);

      calibSumRef.current = 0;
      calibCountRef.current = 0;
      speakingFramesRef.current = 0;
      hasSpeechRef.current = false;
      lastActiveAtRef.current = 0;

      const SILENCE_MS = 2000;
      const MAX_MS = 15000;
      const ACTIVATE_FRAMES = 6;

      hardTimeoutRef.current = window.setTimeout(() => {
        stop(false);
      }, MAX_MS);

      const tick = () => {
        const analyserNode = analyserRef.current;
        const td = timeDataRef.current;
        if (!analyserNode || !td) return;

        analyserNode.getByteTimeDomainData(td);

        let sumSquares = 0;
        for (let i = 0; i < td.length; i++) {
          const v = (td[i] - 128) / 128;
          sumSquares += v * v;
        }
        let rms = Math.sqrt(sumSquares / td.length);
        rms = Math.min(1, rms * 2.5);

        if (calibCountRef.current < 18) {
          calibSumRef.current += rms;
          calibCountRef.current += 1;
        }
        const base =
          calibCountRef.current > 0
            ? calibSumRef.current / calibCountRef.current
            : 0.01;

        const threshold = Math.min(Math.max(base + 0.02, 0.02), 0.25);

        const now = Date.now();

        if (rms > threshold) {
          speakingFramesRef.current += 1;
          if (
            !hasSpeechRef.current &&
            speakingFramesRef.current >= ACTIVATE_FRAMES
          ) {
            hasSpeechRef.current = true;
            lastActiveAtRef.current = now;
          }
          if (hasSpeechRef.current) {
            lastActiveAtRef.current = now;
          }
        } else {
          speakingFramesRef.current = Math.max(
            0,
            speakingFramesRef.current - 1
          );
        }

        if (
          hasSpeechRef.current &&
          lastActiveAtRef.current > 0 &&
          now - lastActiveAtRef.current >= SILENCE_MS
        ) {
          stop(true);
          return;
        }

        setLevel((prev) => {
          const target = Math.min(1, rms / 0.35);
          return prev * 0.65 + target * 0.35;
        });

        rafRef.current = requestAnimationFrame(tick);
      };

      rafRef.current = requestAnimationFrame(tick);
    } catch {
      stop(false);
    }
  }, [disabled, stop]);

  const handleButtonClick = () => {
    if (disabled) return;
    if (!listeningRef.current) startListening();
    else stopAndMaybeSend();
  };

  useEffect(() => {
    return () => cleanup();
  }, [cleanup]);

  const outerGlowOpacity = listening ? 0.25 + level * 0.6 : 0.25;
  const outerGlowScale = listening ? 1 + level * 0.3 : 1;
  const plateScale = listening ? 1 + level * 0.06 : 1;

  return (
    <div className="w-full">
      <div className="relative z-50 max-w-3xl mx-auto p-6">
        <div className="flex items-center justify-center">
          <motion.button
            onClick={handleButtonClick}
            disabled={disabled}
            className="relative w-28 h-28 rounded-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed border border-zinc-700/60 bg-zinc-800/60"
            whileHover={{ scale: disabled ? 1 : 1.05 }}
            whileTap={{ scale: disabled ? 1 : 0.95 }}
          >
            <motion.div
              className="absolute inset-0 rounded-full blur-2xl"
              style={{ background: "rgba(16, 185, 129, 0.35)" }}
              animate={{ scale: outerGlowScale, opacity: outerGlowOpacity }}
              transition={{ type: "spring", stiffness: 140, damping: 18 }}
            />
            <motion.div
              className="absolute inset-4 rounded-full bg-white/10 backdrop-blur-sm"
              animate={{ scale: plateScale }}
              transition={{ type: "spring", stiffness: 180, damping: 16 }}
            />

            <div className="relative z-10">
              {listening ? (
                <div className="flex gap-1.5 items-end">
                  {[0, 1, 2].map((i) => {
                    const barScale = Math.max(
                      0.6,
                      Math.min(2, 0.7 + level * (1 + i * 0.25))
                    );
                    return (
                      <motion.div
                        key={i}
                        className="w-1.5 bg-white rounded-full origin-bottom"
                        style={{ height: "24px" }}
                        animate={{ scaleY: barScale }}
                        transition={{
                          type: "spring",
                          stiffness: 220,
                          damping: 18,
                        }}
                      />
                    );
                  })}
                </div>
              ) : (
                <Mic className="w-10 h-10 text-white" />
              )}
            </div>
          </motion.button>
        </div>
      </div>
    </div>
  );
}

export function TextChat({ language, onBack }: TextChatProps) {
  const [videoUploaded, setVideoUploaded] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [showChat, setShowChat] = useState(false);

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isResponding, setIsResponding] = useState(false);
  const [convIndex, setConvIndex] = useState(0);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const translations = {
    en: {
      uploadPrompt: "Upload your swing video to start analysis!",
      analyzing: "Analyzing your swing",
      analysisComplete: "I've analyzed your video. Tap the mic to talk.",
      startOver: "Start Over",
      thinking: "Thinking",
    },
    jp: {
      uploadPrompt: "スイング動画をアップロードして分析開始！",
      analyzing: "スイングを分析中...",
      analysisComplete:
        "分析が完了しました。マイクをタップして話してください。",
      startOver: "最初から",
      thinking: "考え中...",
    },
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (videoUploaded && !showChat) {
      setConvIndex(0);
      setIsResponding(false);

      setTimeout(() => {
        setShowChat(true);
        setIsAnalyzing(true);

        const analyzeMessageId = Date.now();
        setMessages([
          {
            id: analyzeMessageId,
            sender: "ai",
            text: translations[language].analyzing,
            isAnalyzing: true,
          },
        ]);

        const timeoutId = setTimeout(() => {
          // Replace text in the same chat bubble (keep same id)
          setMessages((prev) =>
            prev.map((m) =>
              m.id === analyzeMessageId
                ? {
                    ...m,
                    text: translations[language].analysisComplete,
                    isAnalyzing: false,
                  }
                : m
            )
          );
          setIsAnalyzing(false);
        }, 3000);

        return () => clearTimeout(timeoutId);
      }, 600);
    }
  }, [videoUploaded, showChat, language]);

  const handleVideoUpload = (file: File) => {
    const url = URL.createObjectURL(file);
    setVideoUrl(url);
    setVideoUploaded(true);
  };

  const handleVoiceSend = () => {
    if (!conversations || convIndex >= conversations.length) return;
    if (isAnalyzing || isResponding) return;

    let idx = convIndex;
    if (conversations[idx]?.sender !== "user") {
      while (idx < conversations.length && conversations[idx].sender !== "user")
        idx++;
      if (idx >= conversations.length) return;
    }

    const userMsg = conversations[idx];
    const aiMsg = conversations[idx + 1];
    const aiDelay = aiMsg?.delay ?? 1200;

    // Add user message
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), sender: "user", text: userMsg.text },
    ]);

    // Add single loader message (will be replaced in-place)
    const loaderId = Date.now() + 1;
    setIsResponding(true);
    setMessages((prev) => [
      ...prev,
      {
        id: loaderId,
        sender: "ai",
        text: translations[language].thinking,
        isAnalyzing: true,
      },
    ]);

    setTimeout(() => {
      // Replace text in the same message, do not add/remove bubbles
      setMessages((prev) =>
        prev.map((m) =>
          m.id === loaderId
            ? {
                ...m,
                text: aiMsg.text,
                image: aiMsg.image,
                isAnalyzing: false,
              }
            : m
        )
      );
      setConvIndex(idx + 2);
      setIsResponding(false);
    }, aiDelay);
  };

  const handleStartOver = () => {
    setVideoUploaded(false);
    setVideoUrl(null);
    setMessages([]);
    setShowChat(false);
    setIsAnalyzing(false);
    setIsResponding(false);
    setConvIndex(0);
  };

  const micDisabled =
    isResponding || isAnalyzing || convIndex >= conversations.length;

  return (
    <div className="h-dvh bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 text-white relative overflow-hidden flex flex-col">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-40 -right-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <header className="relative z-10 flex items-center p-6 flex-shrink-0 max-w-5xl mx-auto w-full">
        <div className="mr-auto flex items-center gap-4">
          <AnimatePresence>
            {videoUploaded && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                onClick={handleStartOver}
                className="flex items-center gap-2 px-4 py-2 bg-zinc-800/50 hover:bg-zinc-700/50 rounded-xl transition-colors border border-zinc-700/50"
              >
                <RotateCcw className="w-4 h-4" />
                <div className="hidden md:block text-sm">
                  {translations[language].startOver}
                </div>
              </motion.button>
            )}
          </AnimatePresence>
        </div>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute left-1/2 -translate-x-1/2 flex items-center gap-3"
        >
          <h1 className="text-2xl min-h-[34px] md:text-3xl bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">
            Golf Swing AI
          </h1>
        </motion.div>
        <div className="h-[34px]" />
      </header>

      <main className="relative z-10 flex-1 flex flex-col min-h-0">
        <AnimatePresence mode="wait">
          {!videoUploaded ? (
            <motion.div
              key="upload"
              className="flex-1 flex flex-col items-center justify-center px-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <VideoUpload onUpload={handleVideoUpload} />
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-6 text-zinc-400"
              >
                {translations[language].uploadPrompt}
              </motion.p>
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              className="flex-1 flex flex-col min-h-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="flex-1 overflow-y-auto px-6 pb-4 min-h-0">
                <div className="max-w-3xl mx-auto space-y-4">
                  <motion.div
                    initial={{ y: "40vh", scale: 0.8 }}
                    animate={{ y: 0, scale: 1 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="p-6 pb-4 flex-shrink-0"
                  >
                    <div className="flex w-full justify-end">
                      <div className="relative max-w-[70%] rounded-2xl overflow-hidden w-fit border border-blue-500/30 shadow-2xl">
                        <video
                          src={videoUrl || ""}
                          controls
                          className="w-auto h-96 object-cover bg-zinc-900"
                        />
                      </div>
                    </div>
                  </motion.div>

                  <div className="space-y-4">
                    {messages.map((message) => (
                      <ChatMessage
                        key={message.id}
                        message={message}
                        isAnalyzing={message.isAnalyzing}
                      />
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                </div>
              </div>

              <AnimatePresence>
                {showChat && !isAnalyzing && (
                  <motion.div
                    initial={{ y: "-20vh", opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
                    className="flex-shrink-0"
                  >
                    <VoiceInputBar
                      disabled={micDisabled}
                      onSend={handleVoiceSend}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
