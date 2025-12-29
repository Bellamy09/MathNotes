
export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: number;
}

export enum AppMode {
  EDIT = 'EDIT',
  PREVIEW = 'PREVIEW',
  SPLIT = 'SPLIT'
}

export interface VoiceState {
  isRecording: boolean;
  isProcessing: boolean;
  error: string | null;
}
