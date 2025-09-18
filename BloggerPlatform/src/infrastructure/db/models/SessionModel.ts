export type session = {
    userId: string;
    deviceId: string;
    ip: string;
    title: string;
    lastActiveDate: Date,
    expirationDate: Date,
}