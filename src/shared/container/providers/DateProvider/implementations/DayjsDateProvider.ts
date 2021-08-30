import dayjs from "dayjs"

import utc from "dayjs/plugin/utc"
import { IDateProvider } from "../IDateProvider";

dayjs.extend(utc);

class DayjsDateProvider implements IDateProvider {

    compareInHours(start_date: Date, end_date: Date): number {
        const endDateUtc = dayjs(end_date)
            .utc()
            .local()
            .format();
        const startDateUtc = dayjs(start_date)
            .utc()
            .local()
            .format();

        return dayjs(endDateUtc).diff(startDateUtc, "hours")
    }

    dateNow() {
        return dayjs().toDate();
    }

    compareInDays(start_date: Date, end_date: Date): number {
        const endDateUtc = dayjs(end_date)
            .utc()
            .local()
            .format();
        const startDateUtc = dayjs(start_date)
            .utc()
            .local()
            .format();

        return dayjs(endDateUtc).diff(startDateUtc, "days");
    }

    addDays(days: number): Date {
        return dayjs().add(days, "days").toDate();
    }

    addHours(hours: number): Date {
        return dayjs().add(hours, "hour").toDate()
    }

    compareIfBefore(start_date: Date, end_date: Date): boolean {
        return dayjs(start_date).isBefore(end_date);
    }


}

export { DayjsDateProvider }