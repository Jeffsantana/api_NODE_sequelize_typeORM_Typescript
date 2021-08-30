import auth from "@config/auth"
import { IUsersTokensRepository } from "@modules/accounts/repositories/IUsersTokensRepository"
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";
import { AppError } from "@shared/errors/AppError";
import { verify, sign } from "jsonwebtoken"
import { inject, injectable } from "tsyringe"

interface IPayload {
    sub: string;
    email: string;
}
interface IResponse {
    token: string;
    refresh_token: string;
}

@injectable()
class RefreshTokenUseCase {
    constructor(
        @inject("UsersTokensRepository")
        private usersTokensRepository: IUsersTokensRepository,
        @inject("DateProvider")
        private dateProvider: IDateProvider
    ) { }
    async execute(token: string): Promise<IResponse> {
        const {
            secret_token,
            expires_in_token,
            secret_refresh_token,
            expires_in_refresh_token,
            expires_in_refresh_token_days
        } = auth;

        const { sub, email } = verify(token, secret_refresh_token) as IPayload;

        const user_id = sub;

        const userToken = await this.usersTokensRepository.findByUserIdAndRefreshToken(user_id, token);

        if (!userToken) {
            throw new AppError("Refresh Token does not exists");
        }

        await this.usersTokensRepository.deleteById(userToken.id)

        const newToken = sign({}, secret_token, {
            subject: user_id,
            expiresIn: expires_in_token
        });

        const refresh_token = sign({ email }, secret_refresh_token, {
            subject: user_id,
            expiresIn: expires_in_refresh_token
        });

        const expires_date = this.dateProvider.addDays(expires_in_refresh_token_days);

        await this.usersTokensRepository.create({
            expires_date,
            refresh_token,
            user_id
        });

        const tokenReturn: IResponse = {
            token: newToken,
            refresh_token
        }
        return tokenReturn;

    }

}

export { RefreshTokenUseCase }