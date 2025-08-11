'use client';
import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Trash2, Volume2 } from 'lucide-react';

// Extend the Window interface for SpeechRecognition types
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

// Fallback SpeechRecognition type for browsers
type SpeechRecognition = any;

const VoiceRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState('');
  const [audioLevel, setAudioLevel] = useState(0);
  const [isSupported, setIsSupported] = useState(true);

  const mediaRecorderRef = useRef(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const recognitionRef = useRef<any>(null);
  const animationFrameRef = useRef(null);

  useEffect(() => {
    // Check for browser support
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setIsSupported(false);
      setError('Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.');
      return;
    }

    // Initialize speech recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = 'en-US';

    recognitionRef.current.onresult = (event) => {
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      setTranscript(prev => {
        const lines = prev.split('\n');
        if (lines[lines.length - 1].includes('...')) {
          lines[lines.length - 1] = finalTranscript || interimTranscript + '...';
        } else {
          lines.push(finalTranscript || interimTranscript + '...');
        }
        return lines.join('\n');
      });
    };

    recognitionRef.current.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setError(`Recognition error: ${event.error}`);
      setIsRecording(false);
      setIsProcessing(false);
    };

    recognitionRef.current.onend = () => {
      setIsRecording(false);
      setIsProcessing(false);
    };

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const setupAudioVisualization = async (stream) => {
    audioContextRef.current = new (window.AudioContext)();
    analyserRef.current = audioContextRef.current.createAnalyser();
    const microphone = audioContextRef.current.createMediaStreamSource(stream);
    
    analyserRef.current.fftSize = 256;
    microphone.connect(analyserRef.current);
    
    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    
    const updateAudioLevel = () => {
      if (analyserRef.current) {
        analyserRef.current.getByteFrequencyData(dataArray);
        const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
        setAudioLevel(average);
        animationFrameRef.current = requestAnimationFrame(updateAudioLevel);
      }
    };
    
    updateAudioLevel();
  };

  const startRecording = async () => {
    if (!isSupported) return;
    
    setError('');
    setIsProcessing(true);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        } 
      });
      
      await setupAudioVisualization(stream);
      
      recognitionRef.current.start();
      setIsRecording(true);
      setIsProcessing(false);
      
    } catch (err) {
      console.error('Error accessing microphone:', err);
      setError('Could not access microphone. Please check permissions.');
      setIsProcessing(false);
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    
    setIsRecording(false);
    setAudioLevel(0);
  };

  const clearTranscript = () => {
    setTranscript('');
    setError('');
  };

  const getStatusText = () => {
    if (!isSupported) return 'Not supported';
    if (isProcessing) return 'Initializing...';
    if (isRecording) return 'Listening... Speak now';
    return 'Ready to record';
  };

  const getStatusColor = () => {
    if (!isSupported || error) return 'text-red-600 bg-red-50';
    if (isProcessing) return 'text-blue-600 bg-blue-50';
    if (isRecording) return 'text-green-600 bg-green-50';
    return 'text-gray-600 bg-gray-50';
  };

  const AudioVisualizer = () => {
    const bars = Array.from({ length: 20 }, (_, i) => {
      const height = isRecording ? Math.max(4, (audioLevel / 255) * 40 * Math.random()) : 4;
      return (
        <div
          key={i}
          className="bg-gradient-to-t from-blue-500 to-purple-600 rounded-full transition-all duration-100"
          style={{
            width: '4px',
            height: `${height}px`,
          }}
        />
      );
    });

    return (
      <div className="flex items-end justify-center gap-1 h-12 bg-gray-50 rounded-lg p-2 mb-6">
        {bars}
      </div>
    );
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-6">
          <Mic className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Live Voice Recording</h3>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-500 rounded-lg text-center">
            {error}
          </div>
        )}

        <div className="flex flex-wrap gap-3 justify-center mb-6">
          <button
            onClick={startRecording}
            disabled={!isSupported || isRecording || isProcessing}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              isRecording
                ? 'bg-red-600 text-white shadow-lg shadow-red-200 animate-pulse'
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200 hover:shadow-xl hover:-translate-y-0.5'
            } disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none`}
          >
            <Mic className="w-4 h-4" />
            {isRecording ? 'Recording...' : 'Start Recording'}
          </button>

          <button
            onClick={stopRecording}
            disabled={!isRecording}
            className="flex items-center gap-2 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium shadow-lg shadow-gray-200 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none"
          >
            <Square className="w-4 h-4" />
            Stop
          </button>

          <button
            onClick={clearTranscript}
            className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium shadow-lg shadow-red-200 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
          >
            <Trash2 className="w-4 h-4" />
            Clear
          </button>
        </div>

        <div className={`text-center py-3 px-4 rounded-lg font-medium mb-6 ${getStatusColor()}`}>
          {getStatusText()}
        </div>

        <AudioVisualizer />

        <div className="relative">
          <textarea
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            placeholder="Your transcribed speech will appear here... You can also edit the text directly."
            className="w-full h-48 p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 leading-relaxed"
          />
          
          <div className="flex justify-between items-center mt-2 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <Volume2 className="w-4 h-4" />
              Live transcription
            </span>
            <span>{transcript.length} characters</span>
          </div>
        </div>

        {transcript && (
          <div className="mt-6 p-4 bg-green-50 rounded-lg">
            <p className="text-green-800 text-sm">
              ✅ Transcription complete! You can copy the text above or continue recording to add more content.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VoiceRecorder;