import { create } from 'zustand'
import { combine } from 'zustand/middleware'

const useRequestStore = create(
    combine(
        { nextDate: null as string | null, loading: false, error: null as string | null },
        (set) => ({
            fetchDate: async () => {
                set({ loading: true, error: null })
                try {
                    const { data } = await 
                }
            }}
        )
    )
)