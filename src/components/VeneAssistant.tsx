import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Loader2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface VeneAssistantProps {
  enabled: boolean;
}

export const VeneAssistant: React.FC<VeneAssistantProps> = ({ enabled }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const wsRef = useRef<WebSocket | null>(null);
  const inputAudioCtxRef = useRef<AudioContext | null>(null);
  const outputAudioCtxRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);

  const nextStartTimeRef = useRef<number>(0);

  const isRecordingRef = useRef(false);

  useEffect(() => {
    return () => {
      stopRecording();
    };
  }, []);

  useEffect(() => {
    if (isOpen && !isRecordingRef.current) {
      startRecording(true);
    } else if (!isOpen && isRecordingRef.current) {
      stopRecording();
    }
  }, [isOpen]);

  if (!enabled) return null;

  const pcmToBase64 = (buffer: Float32Array) => {
    let l = buffer.length;
    let buf = new Int16Array(l);
    while (l--) {
      buf[l] = Math.min(1, buffer[l]) * 0x7FFF;
    }
    const arrayBuffer = buf.buffer;
    const bytes = new Uint8Array(arrayBuffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  };

  const playAudioChunk = (ctx: AudioContext, base64Audio: string) => {
    try {
      const binary = window.atob(base64Audio);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      const buffer = bytes.buffer;
      const view = new Int16Array(buffer);
      const audioBuffer = ctx.createBuffer(1, view.length, 24000);
      const channelData = audioBuffer.getChannelData(0);
      for (let i = 0; i < view.length; i++) {
        channelData[i] = view[i] / 0x8000;
      }
      const source = ctx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(ctx.destination);
      
      const currentTime = ctx.currentTime;
      if (nextStartTimeRef.current < currentTime) {
        nextStartTimeRef.current = currentTime;
      }
      source.start(nextStartTimeRef.current);
      nextStartTimeRef.current += audioBuffer.duration;
    } catch (e) {
      console.error("Error playing audio chunk:", e);
    }
  };

  const startRecording = async (isInitialGreeting = false) => {
    try {
      setError(null);
      setIsRecording(true);
      isRecordingRef.current = true;
      
      // We must use wss:// if https://
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/api/live-vene`;
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = async () => {
        setIsConnected(true);
        if (isInitialGreeting === true) {
          ws.send(JSON.stringify({ text: "Hola, acabo de abrir el chat. Por favor, ofréceme tu ayuda brevemente e inicia la conversación." }));
        }
        const inputAudioCtx = new AudioContext({ sampleRate: 16000 });
        inputAudioCtxRef.current = inputAudioCtx;
        
        const outputAudioCtx = new AudioContext({ sampleRate: 24000 });
        outputAudioCtxRef.current = outputAudioCtx;
        nextStartTimeRef.current = outputAudioCtx.currentTime;

        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        streamRef.current = stream;

        const source = inputAudioCtx.createMediaStreamSource(stream);
        sourceRef.current = source;

        const processor = inputAudioCtx.createScriptProcessor(4096, 1, 1);
        processorRef.current = processor;

        source.connect(processor);
        processor.connect(inputAudioCtx.destination);

        processor.onaudioprocess = (e) => {
          if (ws.readyState === WebSocket.OPEN) {
            const base64 = pcmToBase64(e.inputBuffer.getChannelData(0));
            ws.send(JSON.stringify({ audio: base64 }));
          }
        };
      };

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          if (msg.error) {
            setError(msg.error);
            stopRecording();
            return;
          }
          if (msg.audio && outputAudioCtxRef.current) {
            playAudioChunk(outputAudioCtxRef.current, msg.audio);
          }
          if (msg.interrupted && outputAudioCtxRef.current) {
             nextStartTimeRef.current = outputAudioCtxRef.current.currentTime;
          }
        } catch (e) {
          console.error("Error processing ws message:", e);
        }
      };

      ws.onerror = (e) => {
        console.error("WebSocket error:", e);
        setError("Connection error");
        stopRecording();
      };

      ws.onclose = () => {
        stopRecording();
      };

    } catch (err: any) {
      console.error("Error starting mic:", err);
      setError(err.message || "Microphone access denied");
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
    isRecordingRef.current = false;
    setIsConnected(false);
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }
    if (sourceRef.current) {
      sourceRef.current.disconnect();
      sourceRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (inputAudioCtxRef.current) {
      inputAudioCtxRef.current.close();
      inputAudioCtxRef.current = null;
    }
    if (outputAudioCtxRef.current) {
      outputAudioCtxRef.current.close();
      outputAudioCtxRef.current = null;
    }
  };

  return (
    <>
      {/* Floating Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-14 h-14 bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white rounded-full shadow-2xl flex items-center justify-center transition-all"
        >
          <span className="text-3xl leading-none" role="img" aria-label="Asistente Mujer">👩🏻‍⚕️</span>
        </button>
      </div>

      {/* Assistant Modal/Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 w-[320px] bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden z-50 flex flex-col"
          >
            <div className="p-4 border-b border-slate-800 bg-slate-950 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center">
                  <span className="text-lg leading-none" role="img" aria-label="Asistente">👩🏻‍⚕️</span>
                </div>
                <div>
                  <h3 className="text-white text-sm font-bold uppercase tracking-widest">Vene</h3>
                  <p className="text-indigo-400 text-[10px] uppercase font-black tracking-widest">Asistente de Ayuda</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 flex flex-col items-center justify-center min-h-[200px] gap-6">
              <div className="text-center space-y-2">
                <p className="text-slate-300 text-xs leading-relaxed">
                  Hola, soy Vene. Estoy aquí para ofrecerte las últimas noticias sobre el terremoto en Venezuela y brindarte apoyo si lo necesitas.
                </p>
                {error && (
                  <p className="text-red-400 text-[10px] uppercase font-bold tracking-wider mt-2">
                    Error: {error}
                  </p>
                )}
              </div>

              <div className="relative">
                <button
                  onClick={() => isRecording ? stopRecording() : startRecording(false)}
                  className={`w-20 h-20 rounded-full flex items-center justify-center transition-all ${isRecording ? 'bg-red-500/10 text-red-500 border border-red-500/30' : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 hover:bg-indigo-500/20'}`}
                >
                  {isRecording ? (
                    <MicOff className="w-8 h-8" />
                  ) : (
                    <Mic className="w-8 h-8" />
                  )}
                </button>
                {isRecording && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping"></span>
                )}
              </div>
              
              <p className="text-slate-500 text-[10px] uppercase font-black tracking-widest">
                {isRecording ? (isConnected ? 'Escuchando y hablando...' : 'Conectando...') : 'Toca para hablar'}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
