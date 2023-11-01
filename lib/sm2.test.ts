export {};
import { sm2CardData, cardData } from "./sm2";

type Algorithm = (grade: number, data: cardData) => cardData;

function testAlgorithm(algorithmName: string, algorithm: Algorithm) {
    describe(algorithmName + " algorithm test", () => {
        // let statement is used to test grading the same card multiple times
        let cardData: cardData = {
            repetition: 0,
            interval: 0,
            eFactor: 2.5,
        };

        it("Grade card 5", () => {
            cardData = algorithm(5, cardData);
            expect(cardData).toEqual({ repetition: 1, interval: 1, eFactor: 2.6 });
        });

        it("Grade card 4", () => {
            cardData = algorithm(4, cardData);
            expect(cardData).toEqual({ repetition: 2, interval: 6, eFactor: 2.6 });
        });

        it("Grade card 3", () => {
            cardData = algorithm(3, cardData);
            expect(cardData).toEqual({ repetition: 3, interval: 16, eFactor: 2.46 });
        });

        it("Grade card 2", () => {
            cardData = algorithm(2, cardData);
            expect(cardData).toEqual({ repetition: 0, interval: 1, eFactor: 2.1399999999999997 });
        });

        it("Grade card 1", () => {
            cardData = algorithm(1, cardData);
            expect(cardData).toEqual({ repetition: 0, interval: 1, eFactor: 1.5999999999999996 });
        });

        it("Grade card 0", () => {
            cardData = algorithm(0, cardData);
            expect(cardData).toEqual({ repetition: 0, interval: 1, eFactor: 1.3 });
        });
    });
}

testAlgorithm("sm2", sm2CardData);
