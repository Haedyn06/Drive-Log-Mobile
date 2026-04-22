// Time


export const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const milliseconds = Math.floor((ms % 1000) / 10);

    const hr = Math.floor(totalSeconds / 3600);
    const min = Math.floor((totalSeconds % 3600) / 60);
    const sec = totalSeconds % 60;

    return `${hr.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}:${sec
    .toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
};

export const formatReadableElapsed = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);

    const hr = totalSeconds / 3600;
    const min = totalSeconds / 60;

    if (hr >= 1) {
        return `${hr.toFixed(1).replace('.0', '')} hrs`;
    }

    if (min >= 1) {
        return `${min.toFixed(0)} mins`;
    }

    return `${totalSeconds}s`;
};

export const formatDuration = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hr = Math.floor(totalSeconds / 3600);
    const min = Math.floor((totalSeconds % 3600) / 60);
    const sec = totalSeconds % 60;

    return `${hr.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
};


export const formatDriveTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);

    return `${hours}h ${minutes}m`;
};


// Date Formats

export const formatDateTime = (ts: number | null) => {
    if (ts === null) return '--';
    return new Date(ts).toLocaleString();
};

export const formatDateStr = (ts: number | null) => {
    if (ts === null) return '--';

    return new Date(ts).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
};


export const formatDateNum = (ts: number | string | null) => {
    if (ts === null) return '--';

    const d = new Date(ts);
    return `${(d.getMonth()+1).toString().padStart(2,'0')}/${d.getDate()
        .toString().padStart(2,'0')}/${d.getFullYear()}`;
};

export const formatTimeOnly = (ts: number | string | null | undefined) => {
    if (!ts) return '--';

    return new Date(ts).toLocaleTimeString(undefined, {
        hour: 'numeric',
        minute: '2-digit',
    });
};











// Distance Format
export const formatDistance = (meters: number) => {
    return meters >= 1000 ? `${(meters / 1000).toFixed(2)} km` : `${meters.toFixed(0)} m`;
};

export const formatElevation = (meters: number) => {
    return `${meters.toFixed(0)} m`;
};