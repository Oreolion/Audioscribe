'use client';

import { Download } from 'lucide-react';
import { toast } from 'sonner';

interface TranscriptionResult {
  text: string;
  language: string;
  languageCode: string;
  duration: number;
  wordCount: number;
  wordsPerMinute: number;
}

interface Props {
  result: TranscriptionResult;
}

export default function TranscriptionResult({ result }: Props) {
  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.round(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleDownload = () => {
    try {
      // Create formatted content
      const content = [
        'AUDIO TRANSCRIPTION',
        '==================',
        '',
        `Language: ${result.language}`,
        `Duration: ${formatDuration(result.duration)}`,
        `Word Count: ${result.wordCount.toLocaleString()}`,
        `Words per Minute: ${result.wordsPerMinute}`,
        '',
        'TRANSCRIPTION TEXT',
        '=================',
        '',
        result.text
      ].join('\n');

      // Create blob and download link
      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      
      // Generate filename with timestamp
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
      const filename = `transcription_${result.language.toLowerCase()}_${timestamp}.txt`;
      
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success('Transcription downloaded successfully');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Error downloading transcription');
    }
  };

  return (
    <div className="mt-8 p-6 bg-white rounded-lg shadow-md">
      <div className="space-y-4">
        <div className="flex justify-between items-center mb-4">
          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <span className="font-medium">Language:</span>
              <span>{result.language}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">Duration:</span>
              <span>{formatDuration(result.duration)}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">Word Count:</span>
              <span>{result.wordCount.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">Words per Minute:</span>
              <span>{result.wordsPerMinute}</span>
            </div>
          </div>
          
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 transition-colors"
          >
            <Download className="h-4 w-4" />
            Download
          </button>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-lg font-medium text-gray-900">Transcription</h3>
          <p className="text-gray-700 whitespace-pre-wrap">{result.text}</p>
        </div>
      </div>
    </div>
  );
}
