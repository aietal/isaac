export type DocumentThread = {
	id: string;
	quote: string;
	type: string;
	projectId: string;
	comments: ThreadComment[];
	created_at: string;
};

export type ThreadComment = {
	id: string;
	content: string;
	deleted: boolean;
	timeStamp: string;
	type: string;
	author: string;
};

export type ThreadPosition = {
	threadId: string;
	markNodeKey: string;
	idx: number;
	y: number;
	x: number;
};
