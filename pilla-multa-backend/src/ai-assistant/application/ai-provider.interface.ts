export interface AiToolCall {
  id: string;
  type: string;
  function: {
    name: string;
    arguments: string;
  };
}

export interface AiMessage {
  role: 'system' | 'user' | 'assistant' | 'tool';
  content?: string | null;
  tool_calls?: AiToolCall[];
  tool_call_id?: string;
  name?: string;
}

export interface AiResponse {
  content?: string;
  toolCalls?: AiToolCall[];
}

export interface IAiProvider {
  /**
   * Generates a response from the AI based on the messages.
   * @param messages The array of conversation messages.
   * @param tools The optional array of JSON schema functions the AI can call.
   */
  generateResponse(messages: AiMessage[], tools?: any[]): Promise<AiResponse>;

  /**
   * Transcribes an audio file and returns the translated or transcribed text.
   * @param fileBuffer The binary buffer of the audio file.
   * @param fileName The name or type indicating the file format (e.g. 'audio.m4a').
   */
  transcribeAudio?(fileBuffer: Buffer, fileName: string): Promise<string>;

  /**
   * Generates a vector embedding for the given text using a text-embedding model.
   * @param text The input text to embed.
   */
  generateEmbedding?(text: string): Promise<number[]>;
}
