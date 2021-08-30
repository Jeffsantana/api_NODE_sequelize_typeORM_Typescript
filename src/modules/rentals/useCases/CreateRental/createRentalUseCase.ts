import dayjs from "dayjs";
import { AppError } from "@shared/errors/AppError";
import { Rental } from "../../infra/typeorm/entities/Rental";
import { IRentalsRepository } from "../../repositories/IRentalsRepository";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";
import { inject, injectable } from "tsyringe";
import { ICarsRepository } from "@modules/cars/repositories/ICarsRepository";



interface IRequest {
    user_id: string,
    car_id: string,
    expected_return_date: Date
}
@injectable()
class CreateRentalUseCase {

    constructor(
        @inject("RentalsRepository")
        private rentalsRepository: IRentalsRepository,
        @inject("DateProvider")
        private dateProvider: IDateProvider,
        @inject("CarsRepository")
        private CarsRepository: ICarsRepository
    ) { }
    async execute({
        user_id,
        car_id,
        expected_return_date
    }: IRequest): Promise<Rental> {

        // console.log("🚀 ~ CreateRentalUseCase ~ car_id", car_id);

        const compare = this.dateProvider.compareInHours(this.dateProvider.dateNow(), expected_return_date)
        if (compare < 24) {
            throw new AppError("Invalid return time");
        }

        const carUnAvailable = await this.rentalsRepository.findOpenRentalByCar(car_id);

        if (carUnAvailable) {
            throw new AppError("Car is not available");
        }

        const rentalOpenToUser = await this.rentalsRepository.findOpenRentalByUser(user_id);

        if (rentalOpenToUser) {
            throw new AppError("There's a rental in progress for this user");
        }

        await this.CarsRepository.updateAvailable(car_id, false);

        const rental = await this.rentalsRepository.create({
            user_id,
            car_id,
            expected_return_date
        })

        return rental;

    }
}

export { CreateRentalUseCase }