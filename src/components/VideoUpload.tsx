import { useRef, useState } from "react";
import { motion } from "motion/react";
import { Upload, Video } from "lucide-react";

interface VideoUploadProps {
  onUpload: (file: File) => void;
}

export function VideoUpload({ onUpload }: VideoUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("video/")) {
      onUpload(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUpload(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="relative w-full flex justify-center"
    >
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
            relative max-w-96 w-full h-64 rounded-3xl border-2 border-dashed cursor-pointer
            transition-all duration-300 overflow-hidden
            ${
              isDragging
                ? "border-emerald-500 bg-emerald-500/10"
                : "border-zinc-700 bg-zinc-900/50 hover:border-emerald-500/50 hover:bg-zinc-800/50"
            }
          `}
      >
        {/* Animated gradient background */}
        <div className="absolute inset-0 opacity-50">
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 via-transparent to-blue-500/20"
            animate={{
              rotate: [0, 360],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        </div>

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center gap-4 p-8">
          <motion.div
            animate={{
              y: isDragging ? -10 : [0, -8, 0],
            }}
            transition={{
              y: {
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              },
            }}
            className="relative"
          >
            {/* <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full" /> */}
            <div className="relative w-20 h-20 bg-gradient-to-br from-white/5 to-white/5 backdrop-blur-xs rounded-2xl flex items-center justify-center">
              {isDragging ? (
                <Video className="size-8 text-emerald-500" />
              ) : (
                <Upload className="size-8 text-emerald-500" />
              )}
            </div>
          </motion.div>

          <div className="text-center">
            <p className="text-zinc-300 mb-1">
              {isDragging
                ? "Drop your video here"
                : "Drop your swing video here"}
            </p>
            <p className="text-sm text-zinc-500">or click to browse</p>
          </div>

          <div className="flex gap-2 text-xs text-zinc-600">
            <span className="px-3 py-1 bg-zinc-800/50 rounded-lg border border-zinc-700/50">
              MP4
            </span>
            <span className="px-3 py-1 bg-zinc-800/50 rounded-lg border border-zinc-700/50">
              MOV
            </span>
            <span className="px-3 py-1 bg-zinc-800/50 rounded-lg border border-zinc-700/50">
              AVI
            </span>
          </div>
        </div>

        {/* Shimmer effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
          animate={{
            x: ["-100%", "200%"],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear",
            repeatDelay: 2,
          }}
        />
        <input
          ref={fileInputRef}
          type="file"
          accept="video/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </motion.div>
    </motion.div>
  );
}
