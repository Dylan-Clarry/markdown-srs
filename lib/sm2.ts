export function sm2(grade: number, repetition: number, eFactor: number, interval: number) {
    if(grade >= 3) {
        if(repetition === 0) {
            interval = 1;
        } else if(repetition === 1) {
            interval = 6;
        } else {
            interval = Math.round(interval * eFactor);
        }
        repetition++;
    } else {
        repetition = 0;
        interval = 0;
    }
    eFactor = eFactor + (0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02));
    if(eFactor < 1.3) {
        eFactor = 1.3;
    }

    return {
        repitition: repetition,
        ef: eFactor,
        interval: interval,
    }
}
