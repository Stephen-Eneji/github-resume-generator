import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const initialState = {
  githubData: null,
  sections: [],
  theme: 'default',
  customSections: [],
  selectedProjects: [],
};

const useResumeStore = create(
  persist(
    (set, get) => ({
      ...initialState,
      
      setGitHubData: (data) => {
        if (!data) {
          set(initialState);
          return;
        }
        set({ githubData: data });
      },

      addSection: (section) => {
        if (!section?.id || !section?.type) {
          console.error('Invalid section data');
          return;
        }
        set((state) => ({ 
          sections: [...state.sections, section] 
        }));
      },

      updateSection: (id, data) => {
        if (!id || !data) {
          console.error('Invalid update parameters');
          return;
        }
        set((state) => ({
          sections: state.sections.map(section => 
            section.id === id ? { ...section, ...data } : section
          )
        }));
      },

      setTheme: (theme) => {
        if (!theme) {
          console.error('Theme is required');
          return;
        }
        set({ theme });
      },

      setSelectedProjects: (projects) => {
        if (!Array.isArray(projects)) {
          console.error('Projects must be an array');
          return;
        }
        set({ selectedProjects: projects });
      },

      addCustomSection: (section) => {
        if (!section?.id || !section?.title) {
          console.error('Invalid custom section data');
          return;
        }
        set((state) => ({
          customSections: [...state.customSections, section]
        }));
      },

      // Reset store to initial state
      reset: () => set(initialState),
    }),
    {
      name: 'github-resume-storage',
      storage: createJSONStorage(() => localStorage),
      onError: (error) => {
        console.error('Error with resume storage:', error);
      }
    }
  )
);

export default useResumeStore; 