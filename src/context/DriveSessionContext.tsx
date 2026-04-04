import { createContext, useContext, ReactNode } from 'react';
import { useDriveSession } from '../composables/useDriveSession';

type DriveSessionType = ReturnType<typeof useDriveSession>;

const DriveSessionContext = createContext<DriveSessionType | null>(null);

export function DriveSessionProvider({ children }: { children: ReactNode }) {
    const driveSession = useDriveSession();

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