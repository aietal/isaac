export interface ChatMessage {
	id: string; // Maps to 'id' column
	user_id?: string; // Maps to 'user_id' column
	project_id?: string; // Maps to 'project_id' column
	session_id?: string;
	content: string; // Maps to 'content' column
	embedding?: any; // Maps to 'embedding' column
	metadata: {
		role: 'assistant' | 'user'; // Maps to 'metadata' field as 'role'
		type: 'regular' | 'manipulation' | 'sources' | 'library'; // Maps to 'metadata' field as 'type'
		manipulation_title?: string; // Maps to 'metadata' field as 'manipulation_title'
		sources?: LiteratureSource[]; // Maps to 'metadata' field as 'sources'
		footnotes?: FootNote[];
	};
}

export type ChatMessageV2 = {
	id: string; // Maps to 'id' column
	session_id?: string;
	content: string; // Maps to 'content' column
	role: ChatRoles;
	note_id?: string;
	metadata?: {
		sources?: LiteratureSource[]; // Maps to 'metadata' field as 'sources'
		footnotes?: FootNote[];
	};
};

export type ChatContext = 'project' | 'realtime' | 'references' | 'file';

export type LiteratureSource = {
	paperId: string;
	doi: string;
	title: string;
	authors: { name: string; authorId: string }[];
	url: string;
	year: number;
};

export type FootNote = {
	id: string;
	title: string;
	page?: number;
};

export type ChatRoles = 'system' | 'assistant' | 'user';

export type ChatSessionType = 'CONVERSATION' | 'NEW';

export type ChatSession = {
	id: string;
	title: string;
	projectId: string;
	type: ChatSessionType;
	created_at: Date;
	updated_at: Date;
};
