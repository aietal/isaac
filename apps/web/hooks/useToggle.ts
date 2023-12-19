import { useCallback, useState } from 'react';

export default function useToggle(init = false) {
	const [value, setValue] = useState(init);

	const on = useCallback(() => setValue(true), []);
	const off = useCallback(() => setValue(false), []);
	const toggle = useCallback(() => setValue(v => !v), []);

	return [value, on, off, toggle, setValue] as const;
}
