import React from "react";
export default function DeleteDeckModal({onClose, visible}: { onClose: any; visible: boolean }) {
    if (!visible) return null;
    const handleOnClose = (e: any) => {
        if(e.target.id === "delete-deck-modal") {
            onClose();
        }
    };

    return (
        <div id="delete-deck-modal" onClick={handleOnClose} className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="rounded-md bg-neutral-800 p-2">
                <button onClick={onClose}>X</button>
                <h2>Delete Deck</h2>
                <p>
                    To finish deleting this deck, type the name of the deck in the text box below:
                </p>
                <input placeholder="Deck Name" />
            </div>
        </div>
    );
}
