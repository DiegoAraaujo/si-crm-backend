export declare class AppError extends Error {
    readonly message: string;
    readonly code: string;
    readonly status: number;
    constructor(message: string, code: string, status: number);
}
