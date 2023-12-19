import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import toast from 'react-hot-toast';
import { ToastQuery } from 'types/queryParam';

const toastQueryData: Record<
	ToastQuery,
	{ status: 'error' | 'success'; message: string }
> = {
	[ToastQuery.ZOTERO_FAIL]: {
		status: 'error',
		message: 'Zotero Integration Failed',
	},
	[ToastQuery.ZOTERO_SUCCESS]: {
		status: 'success',
		message: 'Zotero Integration Success',
	},
};

const useHandleToastQuery = () => {
	const { query } = useRouter();
	const toastQuery = query.t as ToastQuery;

	// Trigger toast
	useEffect(() => {
		const toastData = toastQueryData[toastQuery];
		if (toastData) {
			toast[toastData.status](toastData.message);
		}
	}, [toastQuery]);
};

export default useHandleToastQuery;
