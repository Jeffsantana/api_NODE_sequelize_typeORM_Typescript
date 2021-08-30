import { inject, injectable } from "tsyringe";
import { ICarsRepository } from "@modules/cars/repositories/ICarsRepository";
import { Car } from "@modules/cars/infra/typeorm/entities/Car";
import { AppError } from "@shared/errors/AppError";
import { ICreateCarDTO } from "@modules/cars/dtos/ICreateCarDTO";
@injectable()
class CreateCarUseCase {

    constructor(
        @inject("CarsRepository")
        private carsRepository: ICarsRepository
    ) { }

    async execute(
        { brand, category_id, daily_rate, description, fine_amount, license_plate, name }: ICreateCarDTO): Promise<Car> {

        const carAlreadyExists = await this.carsRepository.findByLicensePlate(license_plate);

        if (carAlreadyExists) {
            throw new AppError("Car already Exists!")

        }
        const car = await this.carsRepository.create({
            brand, category_id, daily_rate, description, fine_amount, license_plate, name
        })

        return car
    }
}
export { CreateCarUseCase }