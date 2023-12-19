import { QueryClient } from 'react-query';

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: Infinity,
			refetchOnWindowFocus: false,
		},
	},
});

export default queryClient;
