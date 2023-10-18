'use client';

import { getAudio, getVoices } from '@/lib/elevenlabs';
import { Volume2 } from 'lucide-react';
import { Button } from './ui/button';

function ElevenLabsAudio({ transcript }: { transcript: string }) {
  // Static transcript
  const nextTranscript = transcript || 'Hello, this is a test.';

  const handleClick = async () => {
    (async () => {
      // Fetch available voices
      try {
        const apiKey = process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY;
        if (!apiKey) throw new Error('Missing API key');

        const voices = await getVoices(apiKey);
        if (voices.length > 0) {
          const selectedVoice = voices[0]; // Selecting the first voice 'Rachel'

          // Generate audio and play it
          const audioUrl = await getAudio(
            selectedVoice.voice_id,
            transcript,
            apiKey
          );
          console.log(audioUrl);
          new Audio(audioUrl).play();
        }
      } catch (error) {
        console.error('Something went wrong:', error);
      }
    })();
  };

  return (
    <Button size="icon" type="button" onClick={handleClick}>
      <Volume2 className="w-6 h-6" />
      <span className="sr-only">Play audio</span>
    </Button>
  );
}

export default ElevenLabsAudio;
