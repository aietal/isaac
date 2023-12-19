import { supabase } from '@utils/supabase';
import toast from 'react-hot-toast';
import { useMutation, useQuery, useQueryClient } from 'react-query';

type BoolFieldToUpdate =
	| 'has_seen_tour'
	| 'has_seen_latest_update'
	| 'has_seen_community_banner';

export const updateUserBoolField = async (payload: {
	profileId: string;
	toUpdateField: BoolFieldToUpdate;
	bool: boolean;
}) => {
	const { toUpdateField, bool, profileId } = payload;
	const { data } = await supabase
		.from('profile')
		.update({ [toUpdateField]: bool })
		.eq('id', profileId);

	return data;
};

const useToggleUsersField = () => {
	const queryClient = useQueryClient();
	return useMutation(updateUserBoolField, {
		mutationKey: 'update-user-bool-field',
		onMutate: data => {
			//
		},
		onSuccess: (data, { toUpdateField, bool }) => {
			// toast.success(`${toUpdateField} Field has been updated to "${bool}"`);
			queryClient.invalidateQueries('fetch-user-profile');
		},
		onError: error => {
			console.log({ error });
			//TODO: need to show a more clearer message
			toast.error('There is something wrong. Please try again.');
		},
	});
};

export default useToggleUsersField;
