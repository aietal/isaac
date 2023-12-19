import { supabase } from '@utils/supabase';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const useAuthRedirect = () => {
	const router = useRouter();

	useEffect(() => {
		const user = supabase.auth.user();

		if (!user) {
			router.push('/signup?refresh=true');
			return;
		}

		supabase
			.from('profile')
			.select('is_subscribed, expiration_date, plan')
			.eq('id', user.id)
			.single()
			.then(result => {
				// If user isn't logged in (no profile data), redirect to signup page
				if (!result.data) {
					router.push('/signup?refresh=true');
				}
			});
	}, [router.pathname]);
};

export default useAuthRedirect;
