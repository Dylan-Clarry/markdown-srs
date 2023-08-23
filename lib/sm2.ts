export type cardData = {
    repetition: number,
    eFactor: number,
    interval: number,
};

export function sm2(grade: number, { repetition, eFactor, interval }: cardData): cardData {
    let newRepetition: number;
    let newInterval: number;
    let newEFactor: number;

    if(grade >= 3) {
        if(repetition === 0) {
            newInterval = 1;
        } else if(repetition === 1) {
            newInterval = 6;
        } else {
            newInterval = Math.round(interval * eFactor);
        }
        newRepetition = repetition++;
    } else {
        newRepetition = 0;
        newInterval = 1;
    }
    newEFactor = eFactor + (0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02));
    if(newEFactor < 1.3) {
        newEFactor = 1.3;
    }

    return {
        repetition: newRepetition,
        eFactor: newEFactor,
        interval: newInterval,
    };
}
