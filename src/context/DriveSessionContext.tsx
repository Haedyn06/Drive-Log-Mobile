import { createContext, useContext, ReactNode } from 'react';
import { useLiveDrive } from '@/composables/useLiveDrive';

type DriveSessionType = ReturnType<typeof useLiveDrive>;

const DriveSessionContext = createContext<DriveSessionType | null>(null);

export function DriveSessionProvider({ children }: { children: ReactNode }) {
    const driveSession = useLiveDrive();

    return (
        <DriveSessionContext.Provider value={driveSession}>
            {children}
        </DriveSessionContext.Provider>
    );
}

export function useSharedDriveSession() {
    const context = useContext(DriveSessionContext);

    if (!context) {
        throw new Error('useSharedDriveSession must be used inside DriveSessionProvider');
    }

    return context;
}