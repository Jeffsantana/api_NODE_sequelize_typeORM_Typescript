import { Request, Response } from "express";
import { container } from "tsyringe";
import { SendForgotPasswordMailUseCase } from "./SendForgotPasswordMailUseCase"

class SendForgotPasswordMailController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { email } = request.body;
        const sendForgotPasswordMailUseCase = container.resolve(
            SendForgotPasswordMailUseCase
        )

        const result = await sendForgotPasswordMailUseCase.execute(email);

        return response.json({ message: `We send email to ${email}` })

    }
}

export { SendForgotPasswordMailController }