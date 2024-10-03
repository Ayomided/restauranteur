import type { DietraySchema } from './api/chat/+server';

export interface ChatMessage {
	role: 'user' | 'assistant';
	content: string | DietraySchema | null;
}
