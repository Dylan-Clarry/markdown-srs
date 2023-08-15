import React, { useState } from "react";
import { api } from "../utils/api";

interface IDeleteDeckModalProps {
    onClose: () => void;
    visible: boolean;
    deckName: string;
    deckId: string;
}

export default function DeleteDeckModal({ onClose, visible, deckName, deckId }: IDeleteDeckModalProps) {
    if (!visible){
        return null;
    }
    const [inputDeckName, setInputDeckName] = useState<string>("");
    const utils = api.useContext();
    const deleteDeck = api.deck.delete.useMutation({
        onSettled: async () => {
            await utils.deck.invalidate();
        },
    });

    const handleOnClose = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        const targetElement = e.target as HTMLDivElement;
        if (targetElement.id === "delete-deck-modal") {
            onClose();
        }
    };

    const handleDeleteDeck = () => {
        if (inputDeckName === deckName) {
            deleteDeck.mutate({
                id: deckId,
                name: deckName,
            });
            onClose();
        }
    };

    return (
        <div
            id="delete-deck-modal"
            onClick={handleOnClose}
            className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
        >
            <div className="flex flex-col rounded-md bg-neutral-800 p-4">
                <div className="flex justify-between">
                    <h2 className="p-0.5">Delete Deck</h2>
                    <button className="rounded-md p-0.5 hover:bg-neutral-700" onClick={onClose}>
                        X
                    </button>
                </div>
                <p className="pt-2">
                    Type the name of the deck in the text box below to delete the deck:
                </p>
                <input
                    className="mt-4 rounded-md p-2 text-neutral-900"
                    onChange={(event) => {
                        setInputDeckName(event.target.value);
                    }}
                    placeholder={deckName}
                />

                <button
                    onClick={handleDeleteDeck}
                    disabled={inputDeckName !== deckName}
                    className={`mt-2 rounded-md border-2 ${
                        inputDeckName !== deckName
                            ? "border-neutral-500 p-2 text-neutral-500"
                            : "border-rose-500 p-2 text-rose-500 hover:bg-neutral-700"
                    }`}
                >
                    Delete this deck
                </button>
            </div>
        </div>
    );
}
