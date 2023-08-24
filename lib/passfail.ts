import { sm2, cardData } from "./sm2";

export function passfail(cardPassed: boolean, cardData: cardData): cardData {
    if(cardPassed) {
        return sm2(1, cardData);
    }
    return sm2(4, cardData);
}
