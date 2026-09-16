import { create } from 'zustand'

export const useUIStore = create((set) => ({
  sidebarOpen: true,
  toasts: [],

  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setSidebarOpen: (val) => set({ sidebarOpen: val }),

  addToast: (toast) => {
    const id = Date.now()
    set((s) => ({ toasts: [...s.toasts, { id, ...toast }] }))
    setTimeout(() => {
      set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }))
    }, toast.duration || 3500)
  },

  removeToast: (id) =>
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}))
