import { createContext, useContext, ReactNode } from 'react';
import { useFreeMap } from '@/composables/useFreeMap';

type FreeMapType = ReturnType<typeof useFreeMap>;

const FreeMapContext = createContext<FreeMapType | null>(null);

export function FreeMapProvider({ children }: { children: ReactNode }) {
    const freeMap = useFreeMap();

    return (
        <FreeMapContext.Provider value={freeMap}>
            {children}
        </FreeMapContext.Provider>
    );
}

export function useSharedFreeMap() {
    const context = useContext(FreeMapContext);

    if (!context) {
        throw new Error('useSharedFreeMap must be used inside FreeMapProvider');
    }

    return context;
}