import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { VideoUpload } from "./VideoUpload";
import { ChatMessage } from "./ChatMessage";
import { RotateCcw, ArrowLeft, Mic } from "lucide-react";

type Language = "en" | "jp";

type Message = {
  id: number;
  sender: "user" | "ai";
  text: string;
  isAnalyzing?: boolean;
};

const conversations = {
  en: [
    {
      sender: "user" as const,
      text: "Messed up again. What exactly is wrong here?",
    },
    {
      sender: "ai" as const,
      text: "Watched it! Great scenery. But I noticed you stumbled backward at the end. That was a 'Push-Slice' into the right, wasn't it? You have great speed, so let's fix this!",
    },
    {
      sender: "user" as const,
      text: "Yeah, straight into the woods... I always slice and lose my balance.",
    },
    {
      sender: "ai" as const,
      text: "I see. Based on the guidelines, the issues are an 'Outside-In Path' and 'Insufficient Weight Transfer.' Stumbling back means you're hanging back on your right foot to lift the ball.",
    },
    {
      sender: "user" as const,
      text: "I get told I 'hang back' a lot lol. How do I fix it?",
    },
    {
      sender: "ai" as const,
      text: "There's a great drill for this: 'Stabilize the Finish.' Next time, I want you to 'stand on your left leg and freeze for 3 seconds' after every shot. No matter where the ball goes.",
    },
    {
      sender: "user" as const,
      text: "Stop for 3 seconds? Sounds impossible right now... Will that actually fix the slice?",
    },
    {
      sender: "ai" as const,
      text: "It will! Because you have to transfer your weight to hold that pose. That naturally corrects your swing path. No full power swings for now—stick to 70%.",
    },
    {
      sender: "user" as const,
      text: "Got it. Also, I tend to start with my hands from the top. Is that related?",
    },
    {
      sender: "ai" as const,
      text: "Definitely! You need the 'Lower Body Lead' mentioned in the guidelines. Try to keep your 'back facing the target' for a split second while you step down with your left foot.",
    },
    {
      sender: "user" as const,
      text: "'Back to the target,' okay. I guess steering with my hands was making it worse.",
    },
    {
      sender: "ai" as const,
      text: "Exactly! Steering with hands opens the face. Use 'Slow-Motion Swings' to drill that feeling into your body. It's the fastest way to improve.",
    },
    {
      sender: "user" as const,
      text: "Understood! I'll try slow swings and the '3-second stop' next time.",
    },
    {
      sender: "ai" as const,
      text: "Perfect. Once your balance is set, you'll hit it even further. Focus on that finish!",
    },
    {
      sender: "user" as const,
      text: "Going to practice this weekend! Can you check my next video?",
    },
    {
      sender: "ai" as const,
      text: "Of course! Can't wait. Try to get 'Face-On' and 'Behind' angles next time. Good luck! 🏌️‍♂️✨",
    },
  ],
  jp: [
    {
      sender: "user" as const,
      text: "またミスしちゃいました。これ、どこが悪いですか？",
    },
    {
      sender: "ai" as const,
      text: "動画拝見しました！いい景色ですね。 でも打った後のリアクションと、後ろによろけているのが気になります。これ、『右へのプッシュスライス』が出ちゃいましたよね？すごく振れているのにもったいない！",
    },
    {
      sender: "user" as const,
      text: "そう、右の林へ一直線です…。いつもスライスするし、フィニッシュでよろけちゃうんです。",
    },
    {
      sender: "ai" as const,
      text: "なるほど。ガイドラインで見ると、『アウトサイドイン軌道』と『インパクト後の体重移動不足』が原因ですね。 よろけるのは、ボールを上げようとして右足に体重が残りすぎている（明治の大砲）からですよ。",
    },
    {
      sender: "user" as const,
      text: "『明治の大砲』よく言われます（笑）。どうすれば直りますか？",
    },
    {
      sender: "ai" as const,
      text: "特効薬があります！ガイドラインにある『フィニッシュの安定』ドリルです。 次回の練習では、どんな球が出てもいいので、『打ち終わった後に左足一本で立ち、3秒間ピタッと止まる』ことだけ意識してください。",
    },
    {
      sender: "user" as const,
      text: "3秒止まる？今は絶対無理そう…。それでスライスも直るんですか？",
    },
    {
      sender: "ai" as const,
      text: "直ります！3秒止まるには左足に乗り切る必要があるからです。 そうすると自然に軌道が修正されますよ。まずはマン振り禁止で、7割の力でやってみてください。",
    },
    {
      sender: "user" as const,
      text: "なるほど。あと、切り返しで手から行っちゃう癖も関係ありますか？",
    },
    {
      sender: "ai" as const,
      text: "大いに関係あります！上級者ガイドラインにある『下半身リード』が必要です。 トップで一瞬『背中をターゲットに向けたまま』、左足を踏み込むイメージを持ってみてください。",
    },
    {
      sender: "user" as const,
      text: "『背中を向けたまま』ですね。手で合わせに行ってたから余計ダメだったのか。",
    },
    {
      sender: "ai" as const,
      text: "その通りです！手先だとフェースが開きます。 まずは**『スローモーションスイング』で、今の動きを体に覚え込ませるのが一番の近道ですよ。",
    },
    {
      sender: "user" as const,
      text: "了解です！次はマン振りせず、スロー素振りと『3秒止め』やってみます。",
    },
    {
      sender: "ai" as const,
      text: "いいですね！バランスが整えばもっと飛びますよ。 まずはフィニッシュ重視でいきましょう！",
    },
    {
      sender: "user" as const,
      text: "週末練習してきます！また動画見てもらえますか？",
    },
    {
      sender: "ai" as const,
      text: "もちろんです！楽しみに待ってますね。 次は『後ろ』と『正面』**から撮れると嬉しいです。応援してます！🏌️‍♂️✨",
    },
  ],
};

interface TextChatProps {
  language: Language;
  onBack: () => void;
}

function VoiceInputBar({
  disabled,
  onSend,
}: {
  disabled: boolean;
  onSend: () => void; // parent uses static scripted message
}) {
  const [listening, setListening] = useState(false);
  const [bars, setBars] = useState<number[]>(() =>
    Array.from({ length: 24 }, () => 0)
  );

  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const timeDataRef = useRef<Uint8Array | null>(null);
  const rafRef = useRef<number | null>(null);

  const silenceTimeoutRef = useRef<number | null>(null);
  const hardTimeoutRef = useRef<number | null>(null);

  const cleanup = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    if (silenceTimeoutRef.current) {
      window.clearTimeout(silenceTimeoutRef.current);
      silenceTimeoutRef.current = null;
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
    setBars(Array.from({ length: 24 }, () => 0));
  }, []);

  const stopAndSend = useCallback(() => {
    if (!listening) return;
    cleanup();
    setListening(false);
    onSend();
  }, [cleanup, listening, onSend]);

  const armSilence = useCallback(
    (ms: number) => {
      if (silenceTimeoutRef.current) {
        window.clearTimeout(silenceTimeoutRef.current);
        silenceTimeoutRef.current = null;
      }
      silenceTimeoutRef.current = window.setTimeout(() => {
        stopAndSend();
      }, ms);
    },
    [stopAndSend]
  );

  const startListening = useCallback(async () => {
    if (disabled || listening) return;

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
      analyser.smoothingTimeConstant = 0.7;
      analyserRef.current = analyser;
      source.connect(analyser);

      const time = new Uint8Array(analyser.fftSize);
      timeDataRef.current = time;

      setListening(true);

      // Auto-send even if totally silent
      const SILENCE_MS = 1200;
      const MAX_MS = 15000;
      armSilence(SILENCE_MS);
      hardTimeoutRef.current = window.setTimeout(() => stopAndSend(), MAX_MS);

      // Dynamic baseline calibration for the first ~300ms
      let calibFrames = 0;
      let baseline = 0;

      const groups = 24;
      const samplesPerGroup = Math.floor(time.length / groups) || 1;

      const tick = () => {
        if (!analyserRef.current || !timeDataRef.current) return;

        analyserRef.current.getByteTimeDomainData(timeDataRef.current);

        // Compute per-group amplitude from time-domain data
        const td = timeDataRef.current;
        const newBars: number[] = new Array(groups).fill(0);
        let totalRms = 0;

        for (let g = 0; g < groups; g++) {
          const start = g * samplesPerGroup;
          const end = Math.min(td.length, start + samplesPerGroup);
          let acc = 0;
          for (let i = start; i < end; i++) {
            const v = (td[i] - 128) / 128; // -1..1
            acc += Math.abs(v);
          }
          const avgAbs = acc / Math.max(1, end - start); // 0..1
          newBars[g] = avgAbs; // keep 0..1
          totalRms += avgAbs * avgAbs;
        }

        // Push bars visibly (scale to pixels later in render)
        setBars(newBars);

        // Global RMS
        const rms = Math.sqrt(totalRms / groups); // 0..~1

        // Calibrate baseline for noise floor
        if (calibFrames < 18) {
          baseline += rms;
          calibFrames++;
        }

        const base = calibFrames > 0 ? baseline / calibFrames : 0.01;
        const threshold = Math.min(Math.max(base + 0.02, 0.02), 0.08);

        // If above threshold (speech/noise), re-arm silence timer
        if (rms > threshold) {
          armSilence(SILENCE_MS);
        }

        rafRef.current = requestAnimationFrame(tick);
      };

      rafRef.current = requestAnimationFrame(tick);
    } catch (e) {
      // If mic fails, still proceed so UX isn't blocked
      stopAndSend();
    }
  }, [armSilence, disabled, listening, stopAndSend]);

  const handleButtonClick = () => {
    if (disabled) return;
    if (!listening) startListening();
    else stopAndSend();
  };

  useEffect(() => {
    return () => cleanup();
  }, [cleanup]);

  return (
    <div className="w-full">
      <div className="max-w-3xl mx-auto px-6 py-5">
        <div className="flex items-center justify-center">
          <motion.button
            onClick={handleButtonClick}
            disabled={disabled}
            className="relative w-28 h-28 rounded-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed border border-zinc-700/60 bg-zinc-800/60"
            whileHover={{ scale: disabled ? 1 : 1.05 }}
            whileTap={{ scale: disabled ? 1 : 0.95 }}
            animate={{ rotate: listening ? [0, 3, -3, 0] : 0 }}
            transition={{
              rotate: { duration: 2, repeat: listening ? Infinity : 0 },
            }}
          >
            <motion.div
              className="absolute inset-0 rounded-full blur-2xl"
              style={{ background: "rgba(16, 185, 129, 0.35)" }}
              animate={{
                scale: listening ? [1, 1.2, 1] : [1, 1.05, 1],
                opacity: listening ? [0.45, 0.75, 0.45] : [0.25, 0.45, 0.25],
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
            <div className="absolute inset-4 rounded-full bg-white/10 backdrop-blur-sm" />
            <div className="relative z-10">
              {listening ? (
                <div className="flex gap-1.5">
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="w-1.5 h-6 bg-white rounded-full"
                      animate={{ scaleY: [1, 1.8, 1] }}
                      transition={{
                        duration: 0.8,
                        repeat: Infinity,
                        delay: i * 0.15,
                      }}
                    />
                  ))}
                </div>
              ) : (
                <Mic className="w-10 h-10 text-white" />
              )}
            </div>
          </motion.button>
        </div>

        <div className="flex items-end justify-center gap-1.5 h-14">
          {bars.map((v, i) => {
            // Map 0..~1 to visible pixels: 6..60
            const px = Math.max(6, Math.min(60, Math.round(v * 60)));
            return (
              <div
                key={i}
                className="w-1.5 rounded-full transition-[height,background] duration-80"
                style={{
                  height: `${listening ? px : 6}px`,
                  background: listening
                    ? "linear-gradient(180deg, rgba(16,185,129,0.95), rgba(16,185,129,0.45))"
                    : "rgba(63,63,70,0.6)",
                }}
              />
            );
          })}
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
      analyzing: "Analyzing your swing...",
      analysisComplete: "I've analyzed your video. Tap the mic to talk.",
      startOver: "Start Over",
      thinking: "Thinking...",
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

        setMessages([
          {
            id: Date.now(),
            sender: "ai",
            text: translations[language].analyzing,
            isAnalyzing: true,
          },
        ]);

        const timeoutId = setTimeout(() => {
          setIsAnalyzing(false);
          setMessages([
            {
              id: Date.now() + 1,
              sender: "ai",
              text: translations[language].analysisComplete,
            },
          ]);
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
    const conv = conversations[language];
    if (!conv || convIndex >= conv.length) return;
    if (isAnalyzing || isResponding) return;

    let idx = convIndex;
    if (conv[idx]?.sender !== "user") {
      while (idx < conv.length && conv[idx].sender !== "user") idx++;
      if (idx >= conv.length) return;
    }

    const userMsg = conv[idx];
    const aiMsg = conv[idx + 1];

    setMessages((prev) => [
      ...prev,
      { id: Date.now(), sender: "user", text: userMsg.text },
    ]);

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
      setMessages((prev) => {
        const withoutLoader = prev.filter((m) => m.id !== loaderId);
        if (aiMsg && aiMsg.sender === "ai") {
          return [
            ...withoutLoader,
            { id: Date.now() + 2, sender: "ai", text: aiMsg.text },
          ];
        }
        return withoutLoader;
      });
      setConvIndex(idx + 2);
      setIsResponding(false);
    }, 1200);
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
    isResponding || isAnalyzing || convIndex >= conversations[language].length;

  return (
    <div className="h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 text-white relative overflow-hidden flex flex-col">
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
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 bg-zinc-800/50 hover:bg-zinc-700/50 rounded-xl transition-colors border border-zinc-700/50"
        >
          <ArrowLeft className="w-4 h-4" />
          <div className="hidden md:block">
            {language === "en" ? "Back" : "戻る"}
          </div>
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute left-1/2 -translate-x-1/2 flex items-center gap-3"
        >
          <h1 className="text-2xl md:text-3xl bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">
            Golf Swing AI
          </h1>
        </motion.div>

        <div className="ml-auto flex items-center gap-4">
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
                <div className="hidden md:block">
                  {translations[language].startOver}
                </div>
              </motion.button>
            )}
          </AnimatePresence>
        </div>
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
              <motion.div
                initial={{ y: "40vh", scale: 0.8 }}
                animate={{ y: 0, scale: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="p-6 pb-4 flex-shrink-0"
              >
                <div className="max-w-md mx-auto">
                  <div className="relative rounded-2xl overflow-hidden border border-zinc-800/50 shadow-2xl">
                    <video
                      src={videoUrl || ""}
                      controls
                      className="w-full h-48 object-cover bg-zinc-900"
                    />
                  </div>
                </div>
              </motion.div>

              <div className="flex-1 overflow-y-auto px-6 pb-4 min-h-0">
                <div className="max-w-3xl mx-auto space-y-4">
                  <AnimatePresence mode="popLayout">
                    {messages.map((message) => (
                      <ChatMessage
                        key={message.id}
                        message={message}
                        isAnalyzing={message.isAnalyzing}
                      />
                    ))}
                  </AnimatePresence>
                  <div ref={messagesEndRef} />
                </div>
              </div>

              <AnimatePresence>
                {showChat && !isAnalyzing && (
                  <motion.div
                    initial={{ y: "-30vh", opacity: 0 }}
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
