export {};
import { addDaysToCardReviewDate, addDaysToReviewDate, dateDifferenceInDays, addOneDay, subtractOneDay } from "./datelib";
import { RouterOutputs } from "../src/utils/api";
type Card = RouterOutputs["card"]["getSchema"];

describe("Date calculations test", () => {
    const testDate = new Date(2023, 5, 22);
    const testDate2 = new Date(2023, 7, 15);
    const testDate3 = new Date(2023, 11, 31);
    const testDate4 = new Date(2023, 11, 28);

    it("Add 5 days", () => {
        const newDate = addDaysToReviewDate(testDate, 5);
        expect(newDate).toEqual(new Date(2023, 5, 27));
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

    it("Adding multiple days leading into new month", () => {
        const newDate = addDaysToReviewDate(testDate, 9);
        expect(newDate).toEqual(new Date(2023, 6, 1));
    });

    it("Adding multiple days goes into new year", () => {
        const newDate = addDaysToReviewDate(testDate4, 9);
        expect(newDate).toEqual(new Date(2024, 0, 6));
    });

    it("Adding large number of days goes into new year", () => {
        const newDate = addDaysToReviewDate(new Date(2023, 5, 22), 194);
        expect(newDate).toEqual(new Date(2024, 0, 2));
    });
});

describe("Card review date operations", () => {
    const card: Card = {
        id: "1",
        createdAt: new Date(2023, 5, 22),
        content: "This is an example card ---back--- And this is the back of the example card",
        reviewDate: new Date(2023, 5, 22),
        userId: "2",
        deckId: "3",
    }

    it("Add days to card review date", () => {
        const newCard = addDaysToCardReviewDate(card, 3);
        expect(newCard).toEqual({
            ...card,
            reviewDate: new Date(2023, 5, 25),
        } as Card);
    });

    it("Add days to card review date that goes into next month", () => {
        const newCard = addDaysToCardReviewDate(card, 10);
        expect(newCard).toEqual({
            ...card,
            reviewDate: new Date(2023, 6, 2),
        } as Card);
    });

    it("Add days to card review date that goes into next year", () => {
        const newCard = addDaysToCardReviewDate(card, 194);
        expect(newCard).toEqual({
            ...card,
            reviewDate: new Date(2024, 0, 2),
        } as Card);
    });
});
