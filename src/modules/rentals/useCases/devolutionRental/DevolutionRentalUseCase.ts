import { ICarsRepository } from "@modules/cars/repositories/ICarsRepository";
import { IRentalsRepository } from "@modules/rentals/repositories/IRentalsRepository";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";
import { AppError } from "@shared/errors/AppError";
import { inject, injectable } from "tsyringe";


interface IRequest {
    id: string,
    user_id: string
}

@injectable()
class DevolutionRentalUseCase {

    constructor(
        @inject("RentalsRepository")
        private rentalsRepository: IRentalsRepository,
        @inject("CarsRepository")
        private carsRepository: ICarsRepository,
        @inject("DateProvider")
        private dateProvider: IDateProvider,
    ) { }

    async execute({ id, user_id }: IRequest) {
        const minimum_daily = 1;
        const rental = await this.rentalsRepository.findById(id);

        const car = await this.carsRepository.findById(rental.car_id);

        if (!rental) {
            throw new AppError("Rental does not exists")
        }

        if (rental.end_date) {
            throw new AppError("This rental was returned")
        }

        const dateNow = this.dateProvider.dateNow();

        // Total daily rates used in rent
        let daily = this.dateProvider.compareInDays(rental.start_date, dateNow)

        if (daily <= 0) {
            daily = minimum_daily;
        }

        // Total daily rates used after expected return date
        const delay = this.dateProvider.compareInDays(rental.expected_return_date, dateNow)

        let total = 0;

        if (delay >= 0) {
            total = delay * car.fine_amount
        }

        total += daily * car.daily_rate;

        rental.end_date = dateNow;
        rental.total = total;

        await this.carsRepository.updateAvailable(car.id, true)
        return await this.rentalsRepository.create(rental);


    }
}

export { DevolutionRentalUseCase }