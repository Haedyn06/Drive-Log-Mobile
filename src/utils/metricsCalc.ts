// Calculate Avg Speed
export const avgSpeedCalc = (elapsed:number, distanceMeters:number) => elapsed > 0 ? (distanceMeters / (elapsed / 1000)) * 3.6 : 0;
