export const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const milliseconds = Math.floor((ms % 1000) / 10);

    const hr = Math.floor(totalSeconds / 3600);
    const min = Math.floor((totalSeconds % 3600) / 60);
    const sec = totalSeconds % 60;

    return `${hr.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}:${sec
    .toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
};

export const formatDuration = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hr = Math.floor(totalSeconds / 3600);
    const min = Math.floor((totalSeconds % 3600) / 60);
    const sec = totalSeconds % 60;

    return `${hr.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
};

export const formatDateTime = (ts: number | null) => {
    if (ts === null) return '--';
    return new Date(ts).toLocaleString();
};


export const formatDistance = (meters: number) => {
    return meters >= 1000 ? `${(meters / 1000).toFixed(2)} km` : `${meters.toFixed(0)} m`;
};