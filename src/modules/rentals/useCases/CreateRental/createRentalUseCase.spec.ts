import dayjs from "dayjs"
import { AppError } from "@shared/errors/AppError";
import { RentalsRepositoryInMemory } from "../../repositories/inMemory/RentalsRepositoryInMemory";
import { CreateRentalUseCase } from "./createRentalUseCase";
import { DayjsDateProvider } from "@shared/container/providers/DateProvider/implementations/DayjsDateProvider";
import { CarsRepositoryInMemory } from "@modules/cars/repositories/in-memory/CarsRepositoryInMemory";
import { Car } from "@modules/cars/infra/typeorm/entities/Car";


let createRentalUseCase: CreateRentalUseCase;
let rentalsRepositoryInMemory: RentalsRepositoryInMemory
let dateProvider: DayjsDateProvider;
let carsRepositoryInMemory: CarsRepositoryInMemory;

describe("create Rental", () => {
    const dayAdd24Hours = dayjs().add(1, "day").toDate();
    let car: Car;
    beforeAll(async () => {
        rentalsRepositoryInMemory = new RentalsRepositoryInMemory();
        dateProvider = new DayjsDateProvider();
        carsRepositoryInMemory = new CarsRepositoryInMemory();
        createRentalUseCase = new CreateRentalUseCase(rentalsRepositoryInMemory, dateProvider, carsRepositoryInMemory);
        car = await carsRepositoryInMemory.create({
            name: "Car Test",
            description: "Car test description",
            daily_rate: 100,
            license_plate: "AAA-XXXX",
            fine_amount: 20,
            category_id: "1234",
            brand: "brand"
        })

    })

    it("Should be able to create a new rental ", async () => {

        const rental = await createRentalUseCase.execute({
            user_id: "12345",
            car_id: car.id,
            expected_return_date: dayAdd24Hours
        });

        expect(rental).toHaveProperty("id")
        expect(rental).toHaveProperty("start_date")
    })

    it("Should not be able to create a new rental if there is another open to the same car", async () => {

        await expect(
            createRentalUseCase.execute({
                user_id: "123456",
                car_id: car.id,
                expected_return_date: dayAdd24Hours
            })
        ).rejects.toEqual(new AppError("Car is not available"));
    })

    it("Should not be able to create a new rental if there is another open to the same user", async () => {

        const car2 = await carsRepositoryInMemory.create({
            name: "Car Test",
            description: "Car test description",
            daily_rate: 100,
            license_plate: "AAA-XXYY",
            fine_amount: 20,
            category_id: "1234",
            brand: "brand"
        })

        await expect(
            createRentalUseCase.execute({
                user_id: "12345",
                car_id: car2.id,
                expected_return_date: dayAdd24Hours
            })
        ).rejects.toEqual(new AppError("There's a rental in progress for this user"));
    })

    it("Should not be able to create a new rental with invalid return time", async () => {
        await expect(
            createRentalUseCase.execute({
                user_id: "54321",
                car_id: "12124",
                expected_return_date: dayjs().toDate()
            })
        ).rejects.toEqual(new AppError("Invalid return time"));
    })

})