export function sm2(grade: number, repetition: number, ef: number, interval: number) {
    if(grade >= 3) {
        if(repetition === 0) {
            interval = 1;
        } else if(repetition === 1) {
            interval = 6;
        } else {
            interval = Math.round(interval * ef);
        }
        repetition++;
    } else {
        repetition = 0;
        interval = 0;
    }
    ef = ef + (0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02));
    if(ef < 1.3) {
        ef = 1.3;
    }

    return {
        repitition: repetition,
        ef: ef,
        interval: interval,
    }
}
