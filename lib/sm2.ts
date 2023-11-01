import { Prisma } from "@prisma/client";
import { RouterOutputs } from "../src/utils/api";
import { addDaysToReviewDate } from "./datelib";
type Card = NonNullable<RouterOutputs["card"]["getSchema"]>;

export type cardData = {
    repetition: number;
    eFactor: number;
    interval: number;
};

export function sm2CardData(grade: number, { repetition, eFactor, interval }: cardData): cardData {
    let newRepetition: number;
    let newInterval: number;
    let newEFactor: number;

    if (grade >= 3) {
        if (repetition === 0) {
            newInterval = 1;
        } else if (repetition === 1) {
            newInterval = 6;
        } else {
            newInterval = Math.round(interval * eFactor);
        }
        newRepetition = ++repetition;
    } else {
        newRepetition = 0;
        newInterval = 1;
    }
    newEFactor = eFactor + (0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02));
    if (newEFactor < 1.3) {
        newEFactor = 1.3;
    }

    return {
        repetition: newRepetition,
        eFactor: newEFactor,
        interval: newInterval,
    };
}

export function sm2(grade: number, card: Card): Card {
    let newRepetition: number;
    let newInterval: number;
    let newEFactor: number;
    let repetition = card.repetition;
    let interval = card.interval;
    let eFactor = parseFloat(card.eFactor.toString());

    if (grade >= 3) {
        if (repetition === 0) {
            newInterval = 1;
        } else if (repetition === 1) {
            newInterval = 6;
        } else {
            newInterval = Math.round(interval * eFactor);
        }
        newRepetition = ++repetition;
    } else {
        newRepetition = 0;
        newInterval = 1;
    }
    newEFactor = eFactor + (0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02));
    if (newEFactor < 1.3) {
        newEFactor = 1.3;
    }

    const newDate = addDaysToReviewDate(card.reviewDate, newInterval);

    return {
        ...card,
        reviewDate: newDate,
        repetition: newRepetition,
        eFactor: new Prisma.Decimal(newEFactor),
        interval: newInterval,
    };
}
