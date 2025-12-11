"use client";
const BACKEND_URL = "http://localhost:4000";

import { Room, createLocalAudioTrack } from "livekit-client";

import React, { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import {
  MessageCircle,
  X,
  Send,
  Mic,
  MicOff,
  Paperclip,
  Globe,
  Shield,
  ChevronUp,
  Volume2,
  VolumeX,
  Phone,
} from "lucide-react";

interface Message {
  text: string;
  isUser: boolean;
  timestamp: Date;
  isSpeech?: boolean;
}

type ViewMode = "chat" | "voice";

const ITPChatbot: React.FC = () => {
  const pathname = usePathname();

  // Dynamic city detection from URL
  const detectCity = () => {
    if (!pathname) return "Islamabad";

    const path = pathname.toLowerCase();
    
    // Extract city from URL pattern like /city/peshawar or /city/karachi
    const cityMatch = path.match(/\/city\/([^\/]+)/);
    
    if (cityMatch && cityMatch[1]) {
      // Capitalize the city name
      const cityName = cityMatch[1]
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      return cityName;
    }

    return "Islamabad"; // Default fallback
  };

  const [currentCity, setCurrentCity] = useState(detectCity());
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("chat");
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const [isRecording, setIsRecording] = useState(false);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [isPlayingSpeech, setIsPlayingSpeech] = useState<number | null>(null);
  const [isBotSpeaking, setIsBotSpeaking] = useState(false);
  const [isVoiceModeActive, setIsVoiceModeActive] = useState(false);


    // -----------------------------
  // 🔊 START LIVEKIT VOICE AGENT
  // -----------------------------
  const startVoiceAgent = async () => {
    try {
      // 1) Request LiveKit token from backend
      const res = await fetch(`${BACKEND_URL}/voice-token?identity=itp_user`);
      const { url, token } = await res.json();

      // 2) Create the LiveKit room
      const room = new Room({
        adaptiveStream: true,
        dynacast: true,
      });

      // 3) Connect to LiveKit Cloud
      await room.connect(url, token);
      console.log("Connected to LiveKit Room!");

      // 4) Capture mic
      const micTrack = await createLocalAudioTrack();
      await room.localParticipant.publishTrack(micTrack);

      // 5) Play assistant audio
      room.on("trackSubscribed", (track) => {
        if (track.kind === "audio") {
          const audio = track.attach();
          audio.play();
        }
      });

      // 6) Switch UI to voice mode
      setViewMode("voice");
      setIsVoiceModeActive(true);
    } catch (err) {
      console.error("Voice Agent error:", err);
    }
  };


  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const recognitionRef = useRef<any>(null);


  
  // Dynamic city configuration
  const getCityConfig = (cityName: string) => {
    const defaultConfig = {
      name: `${cityName} Traffic Police`,
      shortName: cityName.slice(0, 3).toUpperCase() + "TP",
      greeting: `السلام علیکم! I'm the ${cityName} Traffic Police Assistant. How can I help you with traffic information, challan services, route planning, or emergency assistance in ${cityName}?`,
      color: "#0066b3",
      accentColor: "#d4af37",
    };

    // Special configurations for major cities
    const cityConfigs: { [key: string]: any } = {
      "Islamabad": {
        name: "Islamabad Traffic Police",
        shortName: "ITP",
        greeting: "السلام علیکم! I'm the Islamabad Traffic Police Assistant. How can I help you with traffic management in the capital city?",
        color: "#0066b3",
        accentColor: "#d4af37",
      },
      "Karachi": {
        name: "Karachi Traffic Police",
        shortName: "KTP",
        greeting: "السلام علیکم! I'm the Karachi Traffic Police Assistant. How can I assist you with traffic services in Karachi?",
        color: "#1e6b3e",
        accentColor: "#fdb913",
      },
      "Lahore": {
        name: "Lahore Traffic Police",
        shortName: "LTP",
        greeting: "السلام علیکم! I'm the Lahore Traffic Police Assistant. How can I help you with traffic management in Lahore?",
        color: "#ff6b00",
        accentColor: "#ffff00",
      },
      "Peshawar": {
        name: "Peshawar Traffic Police",
        shortName: "PTP",
        greeting: "السلام علیکم! I'm the Peshawar Traffic Police Assistant. How can I assist you with Khyber Pakhtunkhwa traffic services?",
        color: "#800080",
        accentColor: "#32cd32",
      },
      "Multan": {
        name: "Multan Traffic Police",
        shortName: "MTP",
        greeting: "السلام علیکم! I'm the Multan Traffic Police Assistant. How can I help you with traffic services in the City of Saints?",
        color: "#8b0000",
        accentColor: "#ffd700",
      },
      "Rawalpindi": {
        name: "Rawalpindi Traffic Police",
        shortName: "RTP",
        greeting: "السلام علیکم! I'm the Rawalpindi Traffic Police Assistant. How can I assist you with twin cities traffic management?",
        color: "#8b4513",
        accentColor: "#add8e6",
      },
      "Quetta": {
        name: "Quetta Traffic Police",
        shortName: "QTP",
        greeting: "السلام علیکم! I'm the Quetta Traffic Police Assistant. How can I help you with Balochistan traffic services?",
        color: "#2f4f4f",
        accentColor: "#ffa500",
      },
      "Faisalabad": {
        name: "Faisalabad Traffic Police",
        shortName: "FTP",
        greeting: "السلام علیکم! I'm the Faisalabad Traffic Police Assistant. How can I assist you with Manchester of Pakistan's traffic?",
        color: "#dc143c",
        accentColor: "#00ced1",
      },
    };

    return cityConfigs[cityName] || defaultConfig;
  };

  const cityConfig = getCityConfig(currentCity);

  const languages = [
    { name: "English", code: "en-US", flag: "🇬🇧" },
    { name: "اردو", code: "ur-PK", flag: "🇵🇰" },
    { name: "پنجابی", code: "pa-PK", flag: "🇵🇰" },
  ];

  // Update city when pathname changes
  useEffect(() => {
    const newCity = detectCity();
    if (newCity !== currentCity) {
      setCurrentCity(newCity);
      console.log(`🤖 Chatbot dynamically adapted to: ${newCity}`);
    }
  }, [pathname]);

  // Reset messages when city changes
  useEffect(() => {
    setMessages([
      {
        text: cityConfig.greeting,
        isUser: false,
        timestamp: new Date(),
        isSpeech: false,
      },
    ]);
    setInputMessage("");
    setIsRecording(false);
    setShowLanguageMenu(false);
    handleStopSpeech();
  }, [currentCity, cityConfig.greeting]);

  useEffect(() => {
    if (isChatOpen)
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isChatOpen]);



  const normalizeCity = (cityName: string) => {
  const map: any = {
    Islamabad: "islamabad",
    Karachi: "karachi",
    Multan: "multan"
  };
  return map[cityName] || "islamabad";
};

  const sendQuery = async (question: string, enableTTS: boolean = false) => {
    try {
      const formData = new FormData();
      formData.append("question", question);
      formData.append("language", selectedLanguage === "English" ? "en" : "ur");
      formData.append("city", normalizeCity(currentCity));
      formData.append("top_k", "5");
      formData.append("score_threshold", "0.15");

      const res = await fetch(`${BACKEND_URL}/query/`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      const botReply = data.answer || `I'm here to help with ${currentCity} traffic services. How can I assist you?`;

      if (viewMode !== "voice") {
        setMessages((prev) => [
          ...prev,
          {
            text: botReply,
            isUser: false,
            timestamp: new Date(),
            isSpeech: false,
          },
        ]);
      }

      if (enableTTS || viewMode === "voice") {
        try {
          const ttsRes = await fetch(`${BACKEND_URL}/tts/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              text: botReply,
              language: selectedLanguage === "English" ? "en" : "ur",
            }),
          });
          if (ttsRes.ok) {
            const audioBlob = await ttsRes.blob();
            const audio = new Audio(URL.createObjectURL(audioBlob));

            audio.onplay = () => setIsBotSpeaking(true);
            audio.onended = () => setIsBotSpeaking(false);
            audio.onerror = () => setIsBotSpeaking(false);

            await audio.play();
          } else {
            setIsBotSpeaking(false);
          }
        } catch (err) {
          console.log("TTS failed:", err);
          setIsBotSpeaking(false);
        }
      }
    } catch (error) {
      if (viewMode !== "voice") {
        setMessages((prev) => [
          ...prev,
          {
            text: `I'm the ${currentCity} Traffic Police Assistant. Currently, I can help you with:\n• Traffic rules and regulations\n• Challan information\n• Route planning\n• Emergency contacts\n• License services\n\nWhat would you like to know about ${currentCity} traffic?`,
            isUser: false,
            timestamp: new Date(),
            isSpeech: false,
          },
        ]);
      }
      setIsBotSpeaking(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;
    setMessages((prev) => [
      ...prev,
      {
        text: inputMessage,
        isUser: true,
        timestamp: new Date(),
        isSpeech: false,
      },
    ]);
    const q = inputMessage;
    setInputMessage("");
    sendQuery(q, false);
  };

  const handleVoiceInput = async () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setMessages((prev) => [
        ...prev,
        {
          text: "⚠ Browser doesn't support Speech Recognition.",
          isUser: false,
          timestamp: new Date(),
          isSpeech: false,
        },
      ]);
      return;
    }

    if (isBotSpeaking) return;

    if (!isRecording) {
      const recog = new SpeechRecognition();
      const langObj =
        languages.find((l) => l.name === selectedLanguage) || languages[0];
      recog.lang = langObj.code;
      recog.interimResults = false;
      recog.maxAlternatives = 1;
      recog.continuous = false;
      recognitionRef.current = recog;

      recog.onstart = () => setIsRecording(true);
      recog.onerror = () => setIsRecording(false);
      recog.onresult = (e: any) => {
        const transcript = e.results[0][0].transcript;
        setMessages((prev) => [
          ...prev,
          {
            text: transcript,
            isUser: true,
            timestamp: new Date(),
            isSpeech: true,
          },
        ]);
        sendQuery(transcript, viewMode === "voice");
      };
      recog.onend = () => setIsRecording(false);
      recog.start();
    } else {
      recognitionRef.current?.stop();
      setIsRecording(false);
    }
  };

  const speakText = (text: string, idx?: number) => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const lang = languages.find((l) => l.name === selectedLanguage);
    utterance.lang = lang?.code || "en-US";
    utterance.rate = 0.9;
    utterance.onstart = () => {
      setIsBotSpeaking(true);
      if (idx !== undefined) setIsPlayingSpeech(idx);
    };
    utterance.onend = () => {
      setIsBotSpeaking(false);
      setIsPlayingSpeech(null);
    };
    utterance.onerror = () => {
      setIsBotSpeaking(false);
      setIsPlayingSpeech(null);
    };
    window.speechSynthesis.speak(utterance);
  };

  const handleStopSpeech = () => {
    window.speechSynthesis?.cancel();
    setIsBotSpeaking(false);
    setIsPlayingSpeech(null);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setMessages((prev) => [
        ...prev,
        {
          text: "⚠ File too large (max 5MB).",
          isUser: false,
          timestamp: new Date(),
          isSpeech: false,
        },
      ]);
      e.target.value = "";
      return;
    }
    const formData = new FormData();
    formData.append("file", file);
    formData.append("city", normalizeCity(currentCity));

    setMessages((prev) => [
      ...prev,
      {
        text: `📎 Uploading ${file.name}...`,
        isUser: true,
        timestamp: new Date(),
        isSpeech: false,
      },
    ]);
    try {
      const res = await fetch(`${BACKEND_URL}/upload/`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        {
          text: `✅ Upload done: ${data.chunks} chunks added.`,
          isUser: false,
          timestamp: new Date(),
          isSpeech: false,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          text: "⚠ Upload failed.",
          isUser: false,
          timestamp: new Date(),
          isSpeech: false,
        },
      ]);
    }
    e.target.value = "";
  };

  const startVoiceMode = () => {
    setViewMode("voice");
    setIsVoiceModeActive(true);
  };

  const endVoiceMode = () => {
    setViewMode("chat");
    setIsVoiceModeActive(false);
    setIsRecording(false);
    recognitionRef.current?.stop();
    handleStopSpeech();
  };

  return (
    <>
      <style jsx>{`
        .itp-btn {
          position: fixed;
          bottom: 2rem;
          right: 2rem;
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: linear-gradient(
            135deg,
            ${cityConfig.color} 0%,
            ${cityConfig.color}dd 100%
          );
          border: 3px solid ${cityConfig.accentColor};
          box-shadow: 0 4px 20px ${cityConfig.color}66;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s;
          z-index: 1000;
        }
        .itp-btn:hover {
          transform: scale(1.1);
          box-shadow: 0 6px 30px ${cityConfig.color}99;
        }
        .itp-window {
          position: fixed;
          bottom: 6rem;
          right: 2rem;
          width: 380px;
          height: 550px;
          background: #fff;
          border: 3px solid ${cityConfig.accentColor};
          border-radius: 1rem;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
          display: flex;
          flex-direction: column;
          z-index: 1000;
          overflow: hidden;
        }
        .itp-header {
          background: linear-gradient(
            135deg,
            ${cityConfig.color} 0%,
            ${cityConfig.color}dd 100%
          );
          padding: 1rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 3px solid ${cityConfig.accentColor};
        }
        .itp-msgs {
          flex: 1;
          overflow-y: auto;
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          background: #f9fafb;
        }
        .itp-msgs::-webkit-scrollbar {
          width: 6px;
        }
        .itp-msgs::-webkit-scrollbar-thumb {
          background: ${cityConfig.color};
          border-radius: 3px;
        }
        .itp-msg {
          padding: 0.75rem 1rem;
          border-radius: 0.75rem;
          max-width: 80%;
          word-wrap: break-word;
          animation: slideIn 0.3s;
        }
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .itp-msg-user {
          background: linear-gradient(
            135deg,
            ${cityConfig.color} 0%,
            ${cityConfig.color}dd 100%
          );
          color: #fff;
          align-self: flex-end;
          border: 2px solid ${cityConfig.accentColor};
        }
        .itp-msg-bot {
          background: #fff;
          color: #1f2937;
          align-self: flex-start;
          border: 2px solid #e5e7eb;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
        .itp-input-area {
          padding: 1rem;
          border-top: 2px solid #e5e7eb;
          background: #fff;
          position: relative;
        }
        .itp-controls {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 0.75rem;
        }
        .itp-input-row {
          display: flex;
          gap: 0.5rem;
        }
        .itp-icon-btn {
          padding: 0.5rem;
          border-radius: 0.5rem;
          border: 2px solid #e5e7eb;
          background: #fff;
          cursor: pointer;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .itp-icon-btn:hover {
          border-color: ${cityConfig.accentColor};
          background: #f9fafb;
          transform: translateY(-2px);
        }
        .recording-btn {
          animation: recordPulse 1s infinite;
          border-color: #ef4444;
        }
        @keyframes recordPulse {
          0%,
          100% {
            box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4);
          }
          50% {
            box-shadow: 0 0 0 8px rgba(239, 68, 68, 0);
          }
        }
        .itp-send-btn {
          background: linear-gradient(
            135deg,
            ${cityConfig.color} 0%,
            ${cityConfig.color}dd 100%
          );
          color: #fff;
          border: 2px solid ${cityConfig.accentColor};
          padding: 0.5rem 1rem;
          border-radius: 0.5rem;
          cursor: pointer;
          transition: all 0.3s;
        }
        .itp-send-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px ${cityConfig.color}66;
        }
        .itp-send-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }
        .itp-text-input {
          flex: 1;
          padding: 0.75rem;
          border: 2px solid #e5e7eb;
          border-radius: 0.5rem;
          outline: none;
          transition: all 0.3s;
          font-size: 0.875rem;
        }
        .itp-text-input:focus {
          border-color: ${cityConfig.color};
          box-shadow: 0 0 0 3px ${cityConfig.color}22;
        }
        .voice-mode-btn {
          width: 100%;
          padding: 0.75rem;
          background: linear-gradient(135deg, #0f9d58 0%, #0c7b41 100%);
          color: #fff;
          border: none;
          border-radius: 0.5rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          font-weight: 600;
          transition: all 0.3s;
          margin-top: 0.5rem;
        }
        .voice-mode-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(15, 157, 88, 0.4);
        }
        .lang-menu {
          position: absolute;
          bottom: 100%;
          left: 0;
          background: #fff;
          border: 2px solid ${cityConfig.accentColor};
          border-radius: 0.5rem;
          box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.15);
          margin-bottom: 0.5rem;
          min-width: 180px;
          z-index: 1001;
          animation: slideUp 0.2s;
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .lang-item {
          padding: 0.75rem 1rem;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          border-bottom: 1px solid #e5e7eb;
        }
        .lang-item:last-child {
          border-bottom: none;
        }
        .lang-item:hover {
          background: #f9fafb;
          padding-left: 1.25rem;
        }
        .lang-item.active {
          background: #e6f2ff;
          font-weight: 600;
        }
        .lang-header {
          padding: 0.75rem 1rem;
          font-weight: 600;
          border-bottom: 2px solid ${cityConfig.accentColor};
          color: ${cityConfig.color};
          font-size: 0.875rem;
        }
        .voice-view {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: linear-gradient(
            180deg,
            ${cityConfig.color} 0%,
            ${cityConfig.color}dd 50%,
            #1a1a2e 100%
          );
          padding: 2rem;
          position: relative;
        }
        .voice-header {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          background: ${cityConfig.color}aa;
          color: white;
        }
        .voice-exit-btn {
          background: rgba(255, 255, 255, 0.2);
          border: none;
          border-radius: 50%;
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s;
        }
        .voice-exit-btn:hover {
          background: rgba(255, 255, 255, 0.3);
        }
        .voice-avatar {
          width: 140px;
          height: 140px;
          border-radius: 50%;
          background: linear-gradient(
            135deg,
            ${cityConfig.accentColor} 0%,
            ${cityConfig.accentColor}cc 100%
          );
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.5rem;
          box-shadow: 0 0 40px ${cityConfig.accentColor}66;
          position: relative;
          border: 4px solid rgba(255, 255, 255, 0.3);
        }
        .voice-avatar::before {
          content: "";
          position: absolute;
          width: 160px;
          height: 160px;
          border-radius: 50%;
          border: 2px solid ${cityConfig.accentColor}44;
          animation: ${isRecording || isBotSpeaking
            ? "none"
            : "ripple 2s infinite"};
        }
        @keyframes ripple {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          100% {
            transform: scale(1.3);
            opacity: 0;
          }
        }
        .police-badge {
          width: 70px;
          height: 70px;
          background: #fff;
          border-radius: 50% 50% 0 50%;
          transform: rotate(-45deg) ${isBotSpeaking ? "scale(1.1)" : "scale(1)"};
          transition: transform 0.3s ease-in-out;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }
        .police-badge-inner {
          width: 60px;
          height: 60px;
          background: linear-gradient(
            135deg,
            ${cityConfig.color} 0%,
            ${cityConfig.color}dd 100%
          );
          border-radius: 50% 50% 0 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .voice-title {
          color: #fff;
          font-size: 1.25rem;
          font-weight: 700;
          margin-bottom: 0.25rem;
        }
        .voice-subtitle {
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.875rem;
          margin-bottom: 2rem;
        }
        .voice-status {
          color: rgba(255, 255, 255, 0.9);
          font-size: 0.875rem;
          margin-bottom: 2rem;
          min-height: 1.5rem;
        }
        .mic-btn {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s;
          margin-bottom: 1.5rem;
        }
        .mic-btn.idle {
          background: rgba(255, 255, 255, 0.2);
        }
        .mic-btn.idle:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: scale(1.05);
        }
        .mic-btn.recording {
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
          animation: pulse 1.5s infinite;
        }
        @keyframes pulse {
          0%,
          100% {
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7);
          }
          50% {
            transform: scale(1.05);
            box-shadow: 0 0 0 20px rgba(239, 68, 68, 0);
          }
        }
        .wave-container {
          display: flex;
          gap: 4px;
          align-items: flex-end;
          height: 40px;
          margin-bottom: 1rem;
        }
        .wave-bar {
          width: 4px;
          background: ${cityConfig.accentColor};
          border-radius: 2px;
          ${isRecording || isBotSpeaking
            ? "animation: wave 0.6s ease-in-out infinite;"
            : "height: 8px;"}
        }
        .wave-bar:nth-child(1) {
          animation-delay: 0s;
        }
        .wave-bar:nth-child(2) {
          animation-delay: 0.1s;
        }
        .wave-bar:nth-child(3) {
          animation-delay: 0.2s;
        }
        .wave-bar:nth-child(4) {
          animation-delay: 0.3s;
        }
        .wave-bar:nth-child(5) {
          animation-delay: 0.4s;
        }
        @keyframes wave {
          0%,
          100% {
            height: 8px;
          }
          50% {
            height: 32px;
          }
        }
        .voice-btn {
          padding: 0.25rem 0.5rem;
          border-radius: 0.25rem;
          background: rgba(255, 255, 255, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.3);
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          min-width: 24px;
          min-height: 24px;
        }
        .voice-btn:hover {
          background: rgba(255, 255, 255, 0.3);
        }
        .itp-msg-bot .voice-btn {
          background: ${cityConfig.color}22;
          border-color: ${cityConfig.color}44;
          color: ${cityConfig.color};
        }
        @media (max-width: 640px) {
          .itp-window {
            width: calc(100vw - 2rem);
            right: 1rem;
            height: calc(100vh - 10rem);
            max-height: 600px;
          }
          .itp-btn {
            right: 1rem;
            bottom: 1rem;
          }
        }
      `}</style>

      <button
        className="itp-btn"
        onClick={() => setIsChatOpen(!isChatOpen)}
        title={`${cityConfig.name} Assistant`}
      >
        {isChatOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <MessageCircle className="w-6 h-6 text-white" />
        )}
      </button>

      {isChatOpen && (
        <div className="itp-window">
          {viewMode === "chat" ? (
            <>
              <div className="itp-header">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-white" />
                  <div>
                    <h3 className="text-white font-bold text-sm">
                      {cityConfig.name}
                    </h3>
                    <p className="text-xs text-blue-100">Always here to help</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setIsChatOpen(false);
                    handleStopSpeech();
                  }}
                  className="text-white hover:bg-white/20 p-1 rounded transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="itp-msgs">
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`itp-msg ${
                      msg.isUser ? "itp-msg-user" : "itp-msg-bot"
                    }`}
                  >
                    <div className="flex justify-between items-end gap-2">
                      <div className="flex-1">
                        <div className="text-sm">{msg.text}</div>
                        {msg.isSpeech && msg.isUser && (
                          <div className="text-xs mt-1 opacity-80">
                            🎤 Voice
                          </div>
                        )}
                      </div>
                      {!msg.isUser && (
                        <button
                          className={`voice-btn ${
                            isPlayingSpeech === i ? "playing" : ""
                          }`}
                          onClick={() =>
                            isPlayingSpeech === i
                              ? handleStopSpeech()
                              : speakText(msg.text, i)
                          }
                          title={isPlayingSpeech === i ? "Stop" : "Play"}
                        >
                          {isPlayingSpeech === i ? (
                            <VolumeX className="w-3 h-3" />
                          ) : (
                            <Volume2 className="w-3 h-3" />
                          )}
                        </button>
                      )}
                    </div>
                    <div
                      className={`text-xs mt-1 ${
                        msg.isUser ? "text-blue-100" : "text-gray-500"
                      }`}
                    >
                      {msg.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              <div className="itp-input-area">
                {showLanguageMenu && (
                  <div className="lang-menu">
                    <div className="lang-header">Select Language</div>
                    {languages.map((l) => (
                      <div
                        key={l.code}
                        className={`lang-item ${
                          selectedLanguage === l.name ? "active" : ""
                        }`}
                        onClick={() => {
                          setSelectedLanguage(l.name);
                          setShowLanguageMenu(false);
                        }}
                      >
                        <span className="text-lg">{l.flag}</span>
                        <span className="text-sm">{l.name}</span>
                      </div>
                    ))}
                  </div>
                )}
                <div className="itp-controls">
                  <button
                    className="itp-icon-btn flex items-center gap-1 px-2"
                    onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                    title="Language"
                  >
                    <Globe
                      className="w-4 h-4"
                      style={{ color: cityConfig.color }}
                    />
                    <span
                      className="text-xs font-semibold"
                      style={{ color: cityConfig.color }}
                    >
                      {selectedLanguage === "اردو"
                        ? "اردو"
                        : selectedLanguage === "پنجابی"
                        ? "پنجابی"
                        : "EN"}
                    </span>
                    <ChevronUp
                      className="w-3 h-3"
                      style={{ color: cityConfig.color }}
                    />
                  </button>
                  <button
                    className="itp-icon-btn"
                    onClick={() => fileInputRef.current?.click()}
                    title="Upload"
                  >
                    <Paperclip
                      className="w-4 h-4"
                      style={{ color: cityConfig.color }}
                    />
                    <input
                      ref={fileInputRef}
                      type="file"
                      className="hidden"
                      onChange={handleFileUpload}
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt,.csv,.xlsx,.xls"
                    />
                  </button>
                </div>
                <div className="itp-input-row">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={`Ask about ${currentCity} traffic...`}
                    className="itp-text-input"
                  />
                  <button
                    onClick={handleVoiceInput}
                    className={`itp-icon-btn ${
                      isRecording ? "recording-btn" : ""
                    }`}
                    title={isRecording ? "Stop Recording" : "Voice Input"}
                  >
                    {isRecording ? (
                      <MicOff className="w-4 h-4 text-red-500" />
                    ) : (
                      <Mic
                        className="w-4 h-4"
                        style={{ color: cityConfig.color }}
                      />
                    )}
                  </button>
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim()}
                    className="itp-send-btn"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
                <button className="voice-mode-btn" onClick={startVoiceAgent}>
                <Phone className="w-5 h-5" /> Call-to-Agent
              </button>

              </div>
            </>
          ) : (
            <div className="voice-view">
              <div className="voice-header">
                <h4 className="font-bold text-sm">call-to-Agent</h4>
                <button
                  className="voice-exit-btn"
                  onClick={endVoiceMode}
                  title="Exit Speech-to-Speech"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>

              <div className="voice-avatar">
                <div className="police-badge">
                  <div className="police-badge-inner">
                    <Shield
                      className="w-8 h-8 text-white"
                      style={{ transform: "rotate(45deg)" }}
                    />
                  </div>
                </div>
              </div>
              <div className="voice-title">{cityConfig.name}</div>
              <div className="voice-subtitle">Speech-to-Speech Assistant</div>

              {(isRecording || isBotSpeaking) && (
                <div className="wave-container">
                  <div className="wave-bar" />
                  <div className="wave-bar" />
                  <div className="wave-bar" />
                  <div className="wave-bar" />
                  <div className="wave-bar" />
                </div>
              )}

              <div className="voice-status">
                {isRecording
                  ? "🎤 Listening to your question..."
                  : isBotSpeaking
                  ? "🔊 Assistant is speaking..."
                  : "Tap microphone to start conversation"}
              </div>
              <button
                className={`mic-btn ${isRecording ? "recording" : "idle"}`}
                onClick={handleVoiceInput}
                disabled={isBotSpeaking}
              >
                {isRecording ? (
                  <MicOff className="w-8 h-8 text-white" />
                ) : (
                  <Mic className="w-8 h-8 text-white" />
                )}
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default ITPChatbot;