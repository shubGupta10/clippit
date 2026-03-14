import { Request, Response, NextFunction } from "express";

export interface AuthRequest extends Request {
    userId?: string
}

export const asyncWrapper = (
    fn: (req: AuthRequest, res: Response, next: NextFunction) => Promise<any>
) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        req.userId = (req as any).auth?.userId;
        Promise.resolve(fn(req, res, next)).catch(next);
    }
}