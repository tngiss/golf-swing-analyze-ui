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
  const [level, setLevel] = useState(0); // 0..1 audio level for animations

  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const timeDataRef = useRef<Uint8Array | null>(null);
  const rafRef = useRef<number | null>(null);

  const hardTimeoutRef = useRef<number | null>(null);

  const lastActiveAtRef = useRef<number>(0);
  const calibSumRef = useRef(0);
  const calibCountRef = useRef(0);

  // Speech detection flags
  const speakingFramesRef = useRef(0);
  const hasSpeechRef = useRef(false);

  // Robust guards against stale state and double-send
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

    // reset detection/calibration
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
    // Only send if we actually detected speech
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

      // set "recording" flags
      sentRef.current = false;
      listeningRef.current = true;
      setListening(true);

      // Reset calibration and speech detection
      calibSumRef.current = 0;
      calibCountRef.current = 0;
      speakingFramesRef.current = 0;
      hasSpeechRef.current = false;
      lastActiveAtRef.current = 0; // will set when speech starts

      // Silence detection config
      const SILENCE_MS = 2000; // auto-send after 1s of no activity, but only after speech started
      const MAX_MS = 15000; // hard cap (no send if speech never started)
      const ACTIVATE_FRAMES = 6; // ~100ms of activity to confirm speech start

      const startAt = Date.now();
      hardTimeoutRef.current = window.setTimeout(() => {
        // If timeout hits without speech, just stop (no send)
        stop(false);
      }, MAX_MS);

      const tick = () => {
        const analyserNode = analyserRef.current;
        const td = timeDataRef.current;
        if (!analyserNode || !td) return;

        analyserNode.getByteTimeDomainData(td);

        // Compute RMS
        let sumSquares = 0;
        for (let i = 0; i < td.length; i++) {
          const v = (td[i] - 128) / 128;
          sumSquares += v * v;
        }
        let rms = Math.sqrt(sumSquares / td.length);
        rms = Math.min(1, rms * 2.5); // mild visual boost

        // Calibrate ambient baseline for ~300ms
        if (calibCountRef.current < 18) {
          calibSumRef.current += rms;
          calibCountRef.current += 1;
        }
        const base =
          calibCountRef.current > 0
            ? calibSumRef.current / calibCountRef.current
            : 0.01;

        // Dynamic threshold above noise floor
        const threshold = Math.min(Math.max(base + 0.02, 0.02), 0.25);

        const now = Date.now();

        // Confirm speech start: require a few consecutive frames above threshold
        if (rms > threshold) {
          speakingFramesRef.current += 1;
          if (
            !hasSpeechRef.current &&
            speakingFramesRef.current >= ACTIVATE_FRAMES
          ) {
            hasSpeechRef.current = true;
            lastActiveAtRef.current = now; // start tracking silence window
          }
          if (hasSpeechRef.current) {
            lastActiveAtRef.current = now; // refresh while talking
          }
        } else {
          // decay speaking frames slightly to avoid flicker
          speakingFramesRef.current = Math.max(
            0,
            speakingFramesRef.current - 1
          );
        }

        // Auto-stop only if speech has started, then we've had silence
        if (
          hasSpeechRef.current &&
          lastActiveAtRef.current > 0 &&
          now - lastActiveAtRef.current >= SILENCE_MS
        ) {
          stop(true);
          return;
        }

        // Smooth visual level 0..1
        setLevel((prev) => {
          const target = Math.min(1, rms / 0.35);
          return prev * 0.65 + target * 0.35;
        });

        rafRef.current = requestAnimationFrame(tick);
      };

      rafRef.current = requestAnimationFrame(tick);
    } catch (e) {
      // If mic fails, stop without sending
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

  // Map level to responsive animations
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

            {/* Icon / mini bars react to level */}
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
        {/* <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 bg-zinc-800/50 hover:bg-zinc-700/50 rounded-xl transition-colors border border-zinc-700/50"
        >
          <ArrowLeft className="w-4 h-4" />
          <div className="hidden md:block">
            {language === "en" ? "Back" : "戻る"}
          </div>
        </motion.button> */}
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
                    className="p-6 pb-4 flex-shrink-0 "
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
