import { sm2CardData, cardData } from "./sm2";

export function passfail(cardPassed: boolean, cardData: cardData): cardData {
    if(cardPassed) {
        return sm2CardData(1, cardData);
    }
    return sm2CardData(4, cardData);
}
