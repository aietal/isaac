import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '../../utils/supabase';

export function createComment(content, author, id, deleted) {
	return {
		author,
		content,
		deleted: deleted === undefined ? false : deleted,
		id: id === undefined ? uuidv4() : id,
		timeStamp: Date.now(),
		type: 'comment',
	};
}

export function createThread(quote, comments, documentId) {
	const randomId = uuidv4();

	async function createThread() {
		const { data, error } = await supabase.from('comments').insert([
			{
				id: randomId,
				quote: quote,
				type: 'thread',
				comments: comments,
				documentId: documentId,
			},
		]);
		if (data) {
			console.log('data', data);
		}
	}

	createThread();

	return {
		comments,
		id: randomId,
		quote,
		type: 'thread',
		documentId: documentId,
	};
}

export function createAIThread(quote, comments, documentId) {
	const randomId = uuidv4();

	async function createAIThread() {
		const { data, error } = await supabase.from('comments').insert([
			{
				id: randomId,
				quote: quote,
				type: 'thread',
				comments: comments,
				documentId: documentId,
			},
		]);
		if (data) {
			console.log('data', data);
		}
	}

	createAIThread();

	return {
		comments,
		id: randomId,
		quote,
		type: 'thread',
		documentId: documentId,
	};
}

function cloneThread(thread) {
	return {
		comments: Array.from(thread.comments),
		id: thread.id,
		quote: thread.quote,
		type: 'thread',
	};
}

function markDeleted(comment) {
	// supabase function that removes the comment from the thread column "comments" where the id matches the comment id

	return {
		author: comment.author,
		content: '[Deleted Comment]',
		deleted: true,
		id: comment.id,
		timeStamp: comment.timeStamp,
		type: 'comment',
	};
}

function triggerOnChange(commentStore) {
	const listeners = commentStore._changeListeners;
	for (const listener of listeners) {
		listener();
	}
}

export class CommentStore {
	constructor(editor) {
		this._comments = [];
		this._editor = editor;
		this._changeListeners = new Set();
	}

	getComments() {
		return this._comments;
	}

	addComment(commentOrThread, thread, offset) {
		const nextComments = Array.from(this._comments);

		if (thread !== undefined && commentOrThread.type === 'comment') {
			for (let i = 0; i < nextComments.length; i++) {
				const comment = nextComments[i];
				if (comment.type === 'thread' && comment.id === thread.id) {
					const newThread = cloneThread(comment);
					nextComments.splice(i, 1, newThread);
					const insertOffset =
						offset !== undefined ? offset : newThread.comments.length;
					newThread.comments.splice(insertOffset, 0, commentOrThread);
					break;
				}
			}
		} else {
			const insertOffset = offset !== undefined ? offset : nextComments.length;
			nextComments.splice(insertOffset, 0, commentOrThread);
		}
		this._comments = nextComments;
		triggerOnChange(this);
	}

	deleteCommentOrThread(commentOrThread, thread) {
		const nextComments = Array.from(this._comments);
		let commentIndex = null;

		if (thread !== undefined) {
			for (let i = 0; i < nextComments.length; i++) {
				const nextComment = nextComments[i];
				if (nextComment.type === 'thread' && nextComment.id === thread.id) {
					const newThread = cloneThread(nextComment);
					nextComments.splice(i, 1, newThread);
					const threadComments = newThread.comments;
					commentIndex = threadComments.indexOf(commentOrThread);
					threadComments.splice(commentIndex, 1);
					break;
				}
			}
		} else {
			commentIndex = nextComments.indexOf(commentOrThread);
			nextComments.splice(commentIndex, 1);
		}
		this._comments = nextComments;
		triggerOnChange(this);

		if (commentOrThread.type === 'comment') {
			return {
				index: commentIndex,
				markedComment: markDeleted(commentOrThread),
			};
		}

		return null;
	}

	registerOnChange(onChange) {
		const changeListeners = this._changeListeners;
		changeListeners.add(onChange);
		return () => {
			changeListeners.delete(onChange);
		};
	}
}

export function useCommentStore(commentStore, documentId) {
	const [comments, setComments] = useState(null);

	useEffect(() => {
		async function fetchComments() {
			await supabase
				.from('comments')
				.select()
				.filter('documentId', 'eq', documentId)
				.then(response => {
					setComments(response.data);
				});
		}

		fetchComments();
	}, [documentId]);

	useEffect(() => {
		return commentStore.registerOnChange(() => {
			async function fetchComments() {
				await new Promise(resolve => setTimeout(resolve, 100));
				await supabase
					.from('comments')
					.select()
					.filter('documentId', 'eq', documentId)
					.then(response => {
						setComments(response.data);
					});
			}

			fetchComments();
		});
	}, [documentId]);

	return comments;
}
