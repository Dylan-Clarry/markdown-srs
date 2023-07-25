import React, { useState } from "react";
import { api } from "../utils/api";

export default function DeleteDeckModal({
    onClose,
    visible,
    deckName,
    deckId,
}: {
    onClose: any;
    visible: boolean;
    deckName: string;
    deckId: string;
}) {
    if (!visible) return null;
    const handleOnClose = (e: any) => {
        if (e.target.id === "delete-deck-modal") {
            onClose();
        }
    };

    const [inputDeckName, setInputDeckName] = useState<string>("");

    const utils = api.useContext();
    const deleteDeck = api.deck.deleteDeck.useMutation({
        onSettled: async () => {
            await utils.deck.invalidate();
        },
    });

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
                    className="mt-4 rounded-md p-2"
                    onChange={(event) => {
                        setInputDeckName(event.target.value);
                    }}
                    placeholder={deckName}
                />
                {inputDeckName === deckName ? (
                    <button
                        onClick={(event) => {
                            deleteDeck.mutate({
                                id: deckId,
                                name: deckName,
                            });
                            onClose;
                        }}
                        className="mt-2 rounded-md border-2 border-rose-500 p-2 text-rose-500 hover:bg-neutral-700"
                    >
                        Delete this deck
                    </button>
                ) : (
                    <button
                        disabled
                        className="mt-2 rounded-md border-2 border-neutral-500 p-2 text-neutral-500"
                    >
                        Delete this deck
                    </button>
                )}
            </div>
        </div>
    );
}
