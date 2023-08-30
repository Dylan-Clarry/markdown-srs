export {};
import { addDaysToReviewDate, dateDifferenceInDays, addOneDay, subtractOneDay } from "./datelib";

describe("Date calculations test", () => {
    const testDate = new Date(2023, 5, 22);
    const testDate2 = new Date(2023, 7, 15);
    const testDate3 = new Date(2023, 11, 31);
    const testDate4 = new Date(2023, 11, 28);

    it("Add 5 days", () => {
        const newDate = addDaysToReviewDate(testDate, 5);
        expect(newDate).toEqual(new Date(2023, 5, 27));
    });

    it("Add days leading into new month", () => {
        const newDate = addDaysToReviewDate(testDate, 9);
        expect(newDate).toEqual(new Date(2023, 6, 1));
    });

    it("Calulate difference in dates", () => {
        const newDate = dateDifferenceInDays(testDate, testDate2);
        expect(newDate).toEqual(54);
    });

    it("Add one day to date", () => {
        const newDate = addOneDay(testDate);
        expect(newDate).toEqual(new Date(2023, 5, 23));
    });

    it("Subtract one day to date", () => {
        const newDate = subtractOneDay(testDate);
        expect(newDate).toEqual(new Date(2023, 5, 21));
    });

    it("Adding single day goes into new year", () => {
        const newDate = addDaysToReviewDate(testDate3, 1);
        expect(newDate).toEqual(new Date(2024, 0, 1));
    });

    it("Adding multible days goes into new year", () => {
        const newDate = addDaysToReviewDate(testDate4, 9);
        expect(newDate).toEqual(new Date(2024, 0, 6));
    });
});
