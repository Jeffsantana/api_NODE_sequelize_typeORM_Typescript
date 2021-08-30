import { Request, Response } from "express";
import { container } from "tsyringe";
import { ResetUserPasswordUseCase } from "./ResetUserPasswordUseCase";



class ResetUserPasswordController {
    async handle(request: Request, response: Response): Promise<Response> {
        const resetUserPassword = container.resolve(ResetUserPasswordUseCase);
        const { token } = request.query;
        const { password } = request.body
        await resetUserPassword.execute({ token: String(token), password });

        return response.send()
    }

}

export { ResetUserPasswordController }