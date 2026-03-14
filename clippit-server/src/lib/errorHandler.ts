import AppError from '../lib/AppError';
import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    console.error(err.stack);

    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
        });
    }

    // unhandled errors
    return res.status(500).json({
        success: false,
        message: 'Internal Server Error',
    });
};