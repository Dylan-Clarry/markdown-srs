export {};
import { calculateNewReviewDate, dateDifferenceInDays, addOneDay, subtractOneDay } from "./datelib";

describe("Date calculations test", () => {
    const testDate = new Date(2023, 5, 22);
    const testDate2 = new Date(2023, 7, 15);

    it("Add 5 days", () => {
        const newDate = calculateNewReviewDate(testDate, 5);
        expect(newDate).toEqual(new Date(2023, 5, 27));
    });

    it("Add days leading into new month", () => {
        const newDate = calculateNewReviewDate(testDate, 9);
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
});
