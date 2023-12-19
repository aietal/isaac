import { create } from 'zustand';

type ProjectStore = {
	project?: any;
	document?: any;
	setProject: (project: any) => void;
	setDocument: (project: any) => void;
};

const useProjectStore = create<ProjectStore>(set => ({
	project: undefined,
	document: undefined,
	setProject: project => set({ project }),
	setDocument: document => set({ document }),
}));

export default useProjectStore;
