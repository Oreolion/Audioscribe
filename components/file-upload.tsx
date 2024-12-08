'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import TranscriptionResult from './transcription-result';

const ACCEPTED_FILE_TYPES = {
  'audio/flac': ['.flac'],
  'audio/m4a': ['.m4a'],
  'audio/mpeg': ['.mp3', '.mpeg', '.mpga'],
  'audio/mp4': ['.mp4'],
  'audio/ogg': ['.ogg', '.oga'],
  'audio/wav': ['.wav'],
  'audio/webm': ['.webm']
};

const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB in bytes

interface TranscriptionResult {
  text: string;
  language: string;
  languageCode: string;
  duration: number;
  wordCount: number;
  wordsPerMinute: number;
}

const getAudioDuration = async (file: File): Promise<number> => {
  return new Promise((resolve, reject) => {
    const audio = new Audio();
    const reader = new FileReader();

    reader.onload = (e) => {
      if (e.target?.result) {
        audio.src = e.target.result as string;
        audio.onloadedmetadata = () => {
          resolve(audio.duration);
        };
        audio.onerror = () => {
          reject(new Error('Failed to load audio file'));
        };
      }
    };
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    reader.readAsDataURL(file);
  });
};

export default function FileUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [transcriptionResult, setTranscriptionResult] = useState<TranscriptionResult | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      toast.error('File size exceeds 25MB limit');
      return;
    }

    try {
      setIsUploading(true);
      const duration = await getAudioDuration(file);

      const formData = new FormData();
      formData.append('file', file);
      formData.append('duration', duration.toString());

      const response = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to transcribe audio');
      }

      const result = await response.json();
      setTranscriptionResult(result);
      toast.success('Audio transcribed successfully!');
    } catch (error) {
      console.error('Transcription error:', error);
      toast.error('Failed to transcribe audio');
    } finally {
      setIsUploading(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_FILE_TYPES,
    maxFiles: 1,
  });

  return (
    <div className="space-y-8">
      <div
        {...getRootProps()}
        className={`p-8 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}`}
      >
        <input {...getInputProps()} />
        {isUploading ? (
          <div className="flex items-center justify-center space-x-2">
            <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
            <span>Transcribing audio...</span>
          </div>
        ) : (
          <div>
            <p className="text-gray-600">
              {isDragActive
                ? 'Drop the audio file here'
                : 'Drag and drop an audio file here, or click to select'}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Supported formats: FLAC, M4A, MP3, MP4, OGG, WAV, WEBM (max 25MB)
            </p>
          </div>
        )}
      </div>

      {transcriptionResult && <TranscriptionResult result={transcriptionResult} />}
    </div>
  );
}
