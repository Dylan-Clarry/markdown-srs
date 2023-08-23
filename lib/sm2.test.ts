export {};
import { sm2, cardData } from "./sm2";

describe("sm2 algorithm test", () => {
    it("Grade card 5", () => {
        const cardData: cardData = {
            repetition: 2,
            interval: 6,
            eFactor: 1.3,
        };
        expect(sm2(5, cardData)).toEqual({
            repetition: 3,
            interval: 8,
            eFactor: 1.4000000000000001,
        });
    });

    it("Grade card 0", () => {
        const cardData: cardData = {
            repetition: 0,
            interval: 0,
            eFactor: 2.5,
        };
        expect(sm2(0, cardData)).toEqual({
            repetition: 0,
            interval: 1,
            eFactor: 1.3,
        });
    });
});
