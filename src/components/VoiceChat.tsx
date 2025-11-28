import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Mic, Send, ArrowLeft, ArrowUp } from "lucide-react";

type Language = "en" | "jp";

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
      text: "動画拝見しました！いい景色ですね。 でも打った後のリアクションと、後ろによろけているのが気になります。これ、**『右へのプッシュスライス』**が出ちゃいましたよね？すごく振れているのにもったいない！",
    },
    {
      sender: "user" as const,
      text: "そう、右の林へ一直線です…。いつもスライスするし、フィニッシュでよろけちゃうんです。",
    },
    {
      sender: "ai" as const,
      text: "なるほど。ガイドラインで見ると、**『アウトサイドイン軌道』と『インパクト後の体重移動不足』**が原因ですね。 よろけるのは、ボールを上げようとして右足に体重が残りすぎている（明治の大砲）からですよ。",
    },
    {
      sender: "user" as const,
      text: "『明治の大砲』よく言われます（笑）。どうすれば直りますか？",
    },
    {
      sender: "ai" as const,
      text: "特効薬があります！ガイドラインにある**『フィニッシュの安定』ドリルです。 次回の練習では、どんな球が出てもいいので、『打ち終わった後に左足一本で立ち、3秒間ピタッと止まる』**ことだけ意識してください。",
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
      text: "大いに関係あります！上級者ガイドラインにある**『下半身リード』が必要です。 トップで一瞬『背中をターゲットに向けたまま』**、左足を踏み込むイメージを持ってみてください。",
    },
    {
      sender: "user" as const,
      text: "『背中を向けたまま』ですね。手で合わせに行ってたから余計ダメだったのか。",
    },
    {
      sender: "ai" as const,
      text: "その通りです！手先だとフェースが開きます。 まずは**『スローモーションスイング』**で、今の動きを体に覚え込ませるのが一番の近道ですよ。",
    },
    {
      sender: "user" as const,
      text: "了解です！次はマン振りせず、スロ��素振りと『3秒止め』やってみます。",
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
      text: "もちろんです！楽しみに待ってますね。 次は**『後ろ』と『正面』**から撮れると嬉しいです。応援してます！🏌️‍♂️✨",
    },
  ],
};

interface VoiceChatProps {
  language: Language;
  onBack: () => void;
}

type ButtonState = "idle" | "recording" | "ai-speaking";

export function VoiceChat({ language, onBack }: VoiceChatProps) {
  const [buttonState, setButtonState] = useState<ButtonState>("idle");
  const [currentStep, setCurrentStep] = useState(0);
  const [currentText, setCurrentText] = useState("");

  const translations = {
    en: {
      tapToSpeak: "Tap to speak",
      listening: "Listening...",
      aiSpeaking: "AI Coach speaking...",
      conversationEnded: "Conversation ended",
    },
    jp: {
      tapToSpeak: "タップして話す",
      listening: "聞いています...",
      aiSpeaking: "AIコーチが話しています...",
      conversationEnded: "会話終了",
    },
  };

  useEffect(() => {
    if (currentStep < conversations[language].length) {
      const message = conversations[language][currentStep];
      setCurrentText(message.text);
    } else {
      setCurrentText(translations[language].conversationEnded);
    }
  }, [currentStep, language]);

  const handleButtonClick = () => {
    if (currentStep >= conversations[language].length) return;

    if (buttonState === "idle") {
      // Start recording
      setButtonState("recording");
      setCurrentText(translations[language].listening);
    } else if (buttonState === "recording") {
      // Send message (user's turn)
      setButtonState("ai-speaking");

      // Simulate AI speaking
      setTimeout(() => {
        setCurrentStep((prev) => prev + 1);

        // After AI finishes, if there's a next user message, go back to idle
        setTimeout(() => {
          if (currentStep + 1 < conversations[language].length) {
            setButtonState("idle");
          } else {
            setButtonState("idle");
          }
        }, 3000);
      }, 500);
    }
  };

  const getButtonIcon = () => {
    switch (buttonState) {
      case "idle":
        return <Mic className="w-12 h-12 text-white" />;
      case "recording":
        return <ArrowUp className="w-12 h-12 text-white" />;
      case "ai-speaking":
        return (
          <div className="flex gap-1.5">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="w-1.5 h-6 bg-white rounded-full"
                animate={{
                  scaleY: [1, 1.8, 1],
                }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  delay: i * 0.15,
                }}
              />
            ))}
          </div>
        );
    }
  };

  const getPromptText = () => {
    switch (buttonState) {
      case "idle":
        return translations[language].tapToSpeak;
      case "recording":
        return translations[language].listening;
      case "ai-speaking":
        return translations[language].aiSpeaking;
    }
  };

  return (
    <div className="min-h-dvh bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 text-white relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/3 left-1/3 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"
          animate={{
            scale: buttonState === "ai-speaking" ? [1, 1.4, 1] : [1, 1.2, 1],
            opacity:
              buttonState === "ai-speaking" ? [0.3, 0.7, 0.3] : [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: buttonState === "ai-speaking" ? 2 : 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
          animate={{
            scale: buttonState === "recording" ? [1, 1.4, 1] : [1.2, 1, 1.2],
            opacity:
              buttonState === "recording" ? [0.3, 0.7, 0.3] : [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: buttonState === "recording" ? 2 : 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center p-6 flex-shrink-0 max-w-5xl mx-auto w-full">
        {/* Left */}
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

        {/* Centered title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute left-1/2 -translate-x-1/2 flex items-center gap-3"
        >
          <h1 className="text-xl bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">
            Golf Swing AI
          </h1>
        </motion.div>
      </header>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-[calc(100vh-88px)] px-6">
        {/* Text Display */}
        <motion.div
          className="mb-16 text-center max-w-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* <AnimatePresence mode="wait">
            <motion.p
              key={currentText}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-2xl text-zinc-300 mb-4 min-h-[4rem]"
            >
              {currentText}
            </motion.p>
          </AnimatePresence> */}

          <motion.p
            className="text-sm text-zinc-500"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {getPromptText()}
          </motion.p>
        </motion.div>

        {/* Voice Button */}
        <div className="relative mb-20">
          {/* Outer ripple rings */}
          <AnimatePresence>
            {buttonState !== "idle" && (
              <>
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute inset-0 rounded-full border-2"
                    style={{
                      borderColor:
                        buttonState === "recording"
                          ? "rgba(59, 130, 246, 0.5)"
                          : "rgba(16, 185, 129, 0.5)",
                    }}
                    initial={{ scale: 1, opacity: 0.6 }}
                    animate={{ scale: [1, 2.5], opacity: [0.6, 0] }}
                    exit={{ opacity: 0 }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.4,
                      ease: "easeOut",
                    }}
                  />
                ))}
              </>
            )}
          </AnimatePresence>

          {/* Rotating particles */}
          {buttonState === "ai-speaking" && (
            <>
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-3 h-3 bg-emerald-400/60 rounded-full"
                  style={{
                    top: "50%",
                    left: "50%",
                    marginTop: "-6px",
                    marginLeft: "-6px",
                  }}
                  animate={{
                    x: Math.cos((i / 12) * Math.PI * 2) * 140,
                    y: Math.sin((i / 12) * Math.PI * 2) * 140,
                    scale: [1, 1.5, 1],
                    opacity: [0.3, 0.8, 0.3],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: (i / 12) * 0.5,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </>
          )}

          {/* Pulsing glow */}
          <motion.div
            className="absolute inset-0 rounded-full blur-2xl"
            style={{
              background:
                buttonState === "recording"
                  ? "rgba(59, 130, 246, 0.4)"
                  : buttonState === "ai-speaking"
                    ? "rgba(16, 185, 129, 0.4)"
                    : "rgba(16, 185, 129, 0.3)",
            }}
            animate={{
              scale: buttonState === "idle" ? [1, 1.1, 1] : [1, 1.3, 1],
              opacity:
                buttonState === "idle" ? [0.3, 0.5, 0.3] : [0.5, 0.8, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Main button */}
          <motion.button
            onClick={handleButtonClick}
            disabled={
              currentStep >= conversations[language].length &&
              buttonState === "idle"
            }
            className="relative w-40 h-40 rounded-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background:
                buttonState === "recording"
                  ? "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)"
                  : buttonState === "ai-speaking"
                    ? "linear-gradient(135deg, #10b981 0%, #059669 100%)"
                    : "linear-gradient(135deg, #10b981 0%, #059669 100%)",
            }}
            whileHover={{
              scale: currentStep >= conversations[language].length ? 1 : 1.05,
            }}
            whileTap={{
              scale: currentStep >= conversations[language].length ? 1 : 0.95,
            }}
            animate={{
              scale:
                buttonState === "idle"
                  ? 1
                  : buttonState === "recording"
                    ? [1, 1.1, 1]
                    : 1,
              rotate: buttonState === "ai-speaking" ? [0, 5, -5, 0] : 0,
            }}
            transition={{
              scale: {
                duration: 1.5,
                repeat: buttonState === "recording" ? Infinity : 0,
              },
              rotate: {
                duration: 2,
                repeat: buttonState === "ai-speaking" ? Infinity : 0,
              },
            }}
          >
            {/* Inner glow */}
            <div className="absolute inset-4 rounded-full bg-white/10 backdrop-blur-sm" />

            {/* Icon */}
            <div className="relative z-10">{getButtonIcon()}</div>
          </motion.button>

          {/* Waveform visualization for recording */}
          {buttonState === "recording" && (
            <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 flex gap-1.5">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-1 bg-blue-400 rounded-full"
                  animate={{
                    height: [20, Math.random() * 60 + 20, 20],
                  }}
                  transition={{
                    duration: 0.5,
                    repeat: Infinity,
                    delay: i * 0.05,
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Step indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-2"
        >
          {conversations[language]
            .filter((_, i) => i % 2 === 0)
            .map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  i <= Math.floor(currentStep / 2)
                    ? "bg-emerald-500 w-8"
                    : "bg-zinc-700"
                }`}
              />
            ))}
        </motion.div>
      </div>
    </div>
  );
}
