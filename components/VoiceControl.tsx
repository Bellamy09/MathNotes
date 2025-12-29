
import React, { useState, useRef } from 'react';
import { Mic, Square, Loader2, AlertCircle } from 'lucide-react';
import { AudioRecorder, blobToBase64 } from '../utils/audio';
import { convertSpeechToMath } from '../services/geminiService';
import { VoiceState } from '../types';

interface VoiceControlProps {
  onResult: (latex: string) => void;
}

const VoiceControl: React.FC<VoiceControlProps> = ({ onResult }) => {
  const [state, setState] = useState<VoiceState>({
    isRecording: false,
    isProcessing: false,
    error: null
  });
  
  const recorderRef = useRef<AudioRecorder>(new AudioRecorder());

  const startRecording = async () => {
    try {
      setState(prev => ({ ...prev, isRecording: true, error: null }));
      await recorderRef.current.start();
    } catch (err) {
      setState(prev => ({ ...prev, isRecording: false, error: 'Could not access microphone.' }));
    }
  };

  const stopRecording = async () => {
    try {
      setState(prev => ({ ...prev, isRecording: false, isProcessing: true }));
      const audioBlob = await recorderRef.current.stop();
      const base64 = await blobToBase64(audioBlob);
      const result = await convertSpeechToMath(base64);
      
      if (result) {
        onResult(result);
      }
      setState(prev => ({ ...prev, isProcessing: false }));
    } catch (err: any) {
      setState(prev => ({ 
        ...prev, 
        isProcessing: false, 
        error: err.message || 'Processing failed.' 
      }));
    }
  };

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center z-50 pointer-events-none">
      {state.error && (
        <div className="mb-4 px-4 py-2 bg-red-100 text-red-700 rounded-full text-sm flex items-center shadow-lg border border-red-200 pointer-events-auto">
          <AlertCircle size={16} className="mr-2" />
          {state.error}
        </div>
      )}

      {state.isRecording && (
        <div className="mb-4 px-4 py-2 bg-indigo-600 text-white rounded-full text-sm font-medium animate-pulse shadow-lg pointer-events-auto">
          Listening to your lecture...
        </div>
      )}

      <button
        onClick={state.isRecording ? stopRecording : startRecording}
        disabled={state.isProcessing}
        className={`w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all transform hover:scale-105 active:scale-95 pointer-events-auto ${
          state.isRecording 
            ? 'bg-red-500 text-white ring-4 ring-red-200' 
            : state.isProcessing
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-indigo-600 text-white ring-4 ring-indigo-100'
        }`}
      >
        {state.isProcessing ? (
          <Loader2 className="animate-spin" size={32} />
        ) : state.isRecording ? (
          <Square size={28} />
        ) : (
          <Mic size={32} />
        )}
      </button>
      
      {!state.isRecording && !state.isProcessing && (
        <div className="mt-2 text-xs font-semibold text-gray-400 uppercase tracking-widest drop-shadow-sm">
          Speak Math
        </div>
      )}
    </div>
  );
};

export default VoiceControl;
