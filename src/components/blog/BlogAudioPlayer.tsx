import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Square, Volume2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BlogAudioPlayerProps {
    text: string;
}

export const BlogAudioPlayer: React.FC<BlogAudioPlayerProps> = ({ text }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [isSupported, setIsSupported] = useState(false);
    const [progress, setProgress] = useState(0);
    const chunksRef = useRef<string[]>([]);
    const currentChunkRef = useRef(0);
    const isMountedRef = useRef(true);

    useEffect(() => {
        if ('speechSynthesis' in window) {
            setIsSupported(true);
        }

        // Set mounted flag
        isMountedRef.current = true;

        // CRITICAL: Cancel ALL speech when component unmounts
        return () => {
            isMountedRef.current = false;
            window.speechSynthesis.cancel();
            setIsPlaying(false);
            setIsPaused(false);
            setProgress(0);
        };
    }, []);

    const cancelSpeech = () => {
        window.speechSynthesis.cancel();
        setIsPlaying(false);
        setIsPaused(false);
        setProgress(0);
        currentChunkRef.current = 0;
    };

    const cleanAndChunkText = (text: string): string[] => {
        // Clean text for better speech
        let cleanText = text
            .replace(/!\[.*?\]\(.*?\)/g, '') // Remove images
            .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Keep link text
            .replace(/(\*\*|__)(.*?)\1/g, '$2') // Remove bold
            .replace(/(\*|_)(.*?)\1/g, '$2') // Remove italic
            .replace(/^#+\s+/gm, '') // Remove headers
            .replace(/<[^>]*>/g, ''); // Remove HTML tags

        // Use DOM parser to handle any remaining entities
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = cleanText;
        cleanText = (tempDiv.textContent || tempDiv.innerText || '').trim();

        // Split into larger chunks (800 chars) to minimize transitions
        const sentences = cleanText.split(/(?<=[.!?])\s+/);
        const chunks: string[] = [];
        let currentChunk = '';

        sentences.forEach(sentence => {
            if ((currentChunk + sentence).length > 800 && currentChunk.length > 0) {
                chunks.push(currentChunk.trim());
                currentChunk = sentence;
            } else {
                currentChunk += (currentChunk ? ' ' : '') + sentence;
            }
        });

        if (currentChunk) {
            chunks.push(currentChunk.trim());
        }

        return chunks.filter(chunk => chunk.length > 0);
    };

    const speakChunk = (chunkIndex: number, voice: SpeechSynthesisVoice | null) => {
        // Check if component is still mounted
        if (!isMountedRef.current) {
            window.speechSynthesis.cancel();
            return;
        }

        if (chunkIndex >= chunksRef.current.length) {
            setIsPlaying(false);
            setIsPaused(false);
            setProgress(100);
            currentChunkRef.current = 0;
            return;
        }

        const utterance = new SpeechSynthesisUtterance(chunksRef.current[chunkIndex]);

        if (voice) utterance.voice = voice;
        utterance.rate = 0.9;
        utterance.pitch = 1;

        utterance.onstart = () => {
            if (!isMountedRef.current) {
                window.speechSynthesis.cancel();
                return;
            }
            const newProgress = ((chunkIndex) / chunksRef.current.length) * 100;
            setProgress(newProgress);
        };

        utterance.onend = () => {
            if (!isMountedRef.current) {
                window.speechSynthesis.cancel();
                return;
            }

            currentChunkRef.current = chunkIndex + 1;
            const newProgress = ((chunkIndex + 1) / chunksRef.current.length) * 100;
            setProgress(newProgress);

            // Wait before speaking next chunk
            setTimeout(() => {
                if (isMountedRef.current) {
                    speakChunk(chunkIndex + 1, voice);
                }
            }, 400);
        };

        utterance.onerror = (event) => {
            console.log('Speech error:', event.error, '- Moving to next chunk');

            if (!isMountedRef.current) {
                window.speechSynthesis.cancel();
                return;
            }

            // Don't retry - just move to next chunk
            currentChunkRef.current = chunkIndex + 1;
            setTimeout(() => {
                if (isMountedRef.current) {
                    speakChunk(chunkIndex + 1, voice);
                }
            }, 300);
        };

        window.speechSynthesis.speak(utterance);
    };

    const handlePlay = () => {
        if (isPaused) {
            window.speechSynthesis.resume();
            setIsPlaying(true);
            setIsPaused(false);
            return;
        }

        if (isPlaying) {
            window.speechSynthesis.pause();
            setIsPlaying(false);
            setIsPaused(true);
            return;
        }

        // Prepare chunks
        chunksRef.current = cleanAndChunkText(text);
        currentChunkRef.current = 0;
        setProgress(0);

        // Get preferred voice
        const voices = window.speechSynthesis.getVoices();
        const preferredVoice = voices.find(v => v.name.includes('Google') && v.lang.includes('en')) ||
            voices.find(v => v.lang.includes('en-IN')) ||
            voices.find(v => v.lang.includes('en')) ||
            null;

        setIsPlaying(true);
        speakChunk(0, preferredVoice);
    };

    const handleStop = () => {
        cancelSpeech();
    };

    if (!isSupported) return null;

    return (
        <div className="bg-green-50 border border-green-100 rounded-xl p-4 mb-8 flex flex-col sm:flex-row items-center gap-4 shadow-sm">
            <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="bg-green-100 p-2 rounded-full text-green-700">
                    <Volume2 className="w-5 h-5" />
                </div>
                <div>
                    <h4 className="font-bold text-green-900 text-sm">Listen to Article</h4>
                    <p className="text-xs text-green-700">Audio version for farmers</p>
                </div>
            </div>

            <div className="flex items-center gap-2 flex-1 w-full justify-center sm:justify-start">
                <Button
                    onClick={handlePlay}
                    variant={isPlaying ? "default" : "outline"}
                    size="sm"
                    className={`rounded-full w-10 h-10 p-0 ${isPlaying ? 'bg-green-600 hover:bg-green-700' : 'border-green-600 text-green-700 hover:bg-green-50'}`}
                >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                </Button>

                {(isPlaying || isPaused) && (
                    <Button
                        onClick={handleStop}
                        variant="ghost"
                        size="sm"
                        className="rounded-full w-10 h-10 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                    >
                        <Square className="w-4 h-4 fill-current" />
                    </Button>
                )}

                <div className="flex-1 mx-2 h-1.5 bg-green-200 rounded-full overflow-hidden max-w-[200px]">
                    <div
                        className="h-full bg-green-600 transition-all duration-300 ease-linear"
                        style={{ width: `${progress}%` }}
                    />
                </div>

                <span className="text-xs text-green-700 font-medium w-8 text-right">
                    {Math.round(progress)}%
                </span>
            </div>
        </div>
    );
};
