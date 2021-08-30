import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';

import { UsersRepository } from '@modules/accounts/infra/typeorm/repositores/UsersRepository';
import { AppError } from '@shared/errors/AppError';
import auth from '@config/auth';
interface IPayload {
    sub: string;
}

export async function ensureAuthenticated(request: Request, response: Response, next: NextFunction) {
    const authHeader = request.headers.authorization;

    if (!authHeader) {
        throw new AppError("Token missing", 401)
    }

    const [, token] = authHeader.split(" ");

    try {
        const { sub: user_id } = verify(token, auth.secret_token) as IPayload;
        const usersRepository = new UsersRepository();

        request.user = {
            id: user_id
        }

        next();

    } catch {
        throw new AppError("Invalid token!", 401)
    }


}


