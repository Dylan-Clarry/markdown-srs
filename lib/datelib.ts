export function dateDifferenceInDays(date1: Date, date2: Date): number {
    const timeDiff = Math.abs(date1.getTime() - date2.getTime());
    const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24));
    return daysDiff;
}

export function calculateNewReviewDate(reviewDate: Date, daysToAdd: number): Date {
    const newReviewDate = new Date(reviewDate.getTime());
    newReviewDate.setDate(newReviewDate.getDate() + daysToAdd);
    return newReviewDate;
}

export function addOneDay(reviewDate: Date): Date {
    return calculateNewReviewDate(reviewDate, 1);
}

export function subtractOneDay(reviewDate: Date): Date {
    return calculateNewReviewDate(reviewDate, -1);
}
