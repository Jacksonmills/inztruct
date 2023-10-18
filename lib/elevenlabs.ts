interface ISample {
  sample_id: string;
  file_name: string;
  mime_type: string;
  size_bytes: number;
  hash: string;
}

interface IFineTuning {
  is_allowed_to_fine_tine: boolean;
  fine_tuning_requested: boolean;
  finetuning_state: string;
  verification_attempt_count: number;
}

interface ISettings {
  stability: number;
  similarity_boost: number;
}

export interface IVoice {
  voice_id: string;
  name: string;
  samples: ISample[];
  category: string;
  fine_tuning: IFineTuning;
  labels: { [key: string]: string }[];
  preview_url: string;
  available_for_tiers: string[];
  settings: ISettings;
}

interface Language {
  iso_code: string;
  display_name: string;
}

interface IModel {
  model_id: string;
  display_name: string;
  supported_languages: Language[];
}

interface IInvoice {
  amount_due_cents: number;
  next_payment_attempt_unix: number;
}

export interface ISubscription {
  tier: string;
  character_count: number;
  character_limit: number;
  can_extend_character_limit: boolean;
  allowed_to_extend_character_limit: boolean;
  need_character_count_reset_unit: number;
  voice_limit: number;
  can_extend_voice_limit: boolean;
  can_use_instant_voice_cloning: boolean;
  available_models: IModel[];
  status: string;
  next_invoice: IInvoice;
}

/**
 * Fetches the voices the user has access to.
 */
export async function getVoices(apiKey: string): Promise<IVoice[]> {
  const response = await fetch('https://api.elevenlabs.io/v1/voices', {
    headers: {
      'xi-api-key': apiKey,
    },
  });
  const data = await response.json();
  return data.voices;
}

/**
 * Transcribes text using a given voice and returns a local URL.
 */
export async function getAudio(
  voiceId: string,
  text: string,
  apiKey: string
): Promise<string> {
  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
    {
      method: 'POST',
      headers: {
        'xi-api-key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        voice_settings: {
          stability: 0.75,
          similarity_boost: 0.75,
        },
      }),
    }
  );
  const blob = await response.blob();
  return window.URL.createObjectURL(new Blob([blob], { type: 'audio/mpeg' }));
}

/**
 * Fetches user subscription information from their API key.
 */
export async function getSubscriptionInfo(
  apiKey: string
): Promise<ISubscription> {
  const response = await fetch(
    'https://api.elevenlabs.io/v1/user/subscription',
    {
      headers: {
        'xi-api-key': apiKey,
      },
    }
  );
  const data = await response.json();
  return data;
}
