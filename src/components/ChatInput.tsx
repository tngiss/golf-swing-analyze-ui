import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Sparkles } from 'lucide-react';

interface ChatInputProps {
  quickOptions: string[];
  onQuickSend: (option: string) => void;
  disabled?: boolean;
  language: 'en' | 'jp';
}

export function ChatInput({ quickOptions, onQuickSend, disabled, language }: ChatInputProps) {
  const [inputValue, setInputValue] = useState('');

  const handleQuickOption = (option: string) => {
    if (disabled) return;
    setInputValue('');
    onQuickSend(option);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !disabled) {
      onQuickSend(inputValue);
      setInputValue('');
    }
  };

  const placeholder = language === 'en' 
    ? 'Type your message...' 
    : 'メッセージを入力...';

  return (
    <div className="border-t border-zinc-800/50 bg-zinc-900/50 backdrop-blur-xl">
      <div className="max-w-3xl mx-auto p-6 space-y-4">
        {/* Quick send options */}
        <AnimatePresence mode="wait">
          {quickOptions.length > 0 && !disabled && (
            <motion.div
              key={quickOptions.join('-')}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="flex flex-wrap gap-2"
            >
              <div className="flex items-center gap-2 text-xs text-zinc-500 mb-1 w-full">
                <Sparkles className="w-3 h-3" />
                <span>{language === 'en' ? 'Quick replies' : 'クイック返信'}</span>
              </div>
              {quickOptions.map((option, index) => (
                <motion.button
                  key={option}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleQuickOption(option)}
                  className="px-4 py-2 bg-zinc-800/50 hover:bg-zinc-700/50 border border-zinc-700/50 hover:border-emerald-500/50 rounded-xl transition-all duration-200 text-sm text-zinc-300 hover:text-emerald-400"
                >
                  {option}
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Input field */}
        <form onSubmit={handleSubmit} className="relative">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={disabled ? (language === 'en' ? 'Conversation ended' : '会話終了') : placeholder}
            disabled={disabled}
            className="w-full px-6 py-4 pr-14 bg-zinc-800/50 border border-zinc-700/50 rounded-2xl focus:outline-none focus:border-emerald-500/50 focus:bg-zinc-800 transition-all text-zinc-200 placeholder-zinc-500 disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <motion.button
            type="submit"
            disabled={disabled || !inputValue.trim()}
            whileHover={{ scale: disabled || !inputValue.trim() ? 1 : 1.1 }}
            whileTap={{ scale: disabled || !inputValue.trim() ? 1 : 0.9 }}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
          >
            <Send className="w-5 h-5 text-white" />
          </motion.button>
        </form>
      </div>
    </div>
  );
}
