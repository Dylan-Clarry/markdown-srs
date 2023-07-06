export default function DeleteDeckModal() {
    return (
        <>
            <button data-modal-target="delete-deck-modal" data-modal-toggle="delete-deck-modal" className="mt-1 rounded-md px-2 pt-0.5 pb-1 hover:cursor-pointer hover:bg-neutral-800">
                Manage
            </button>
            <div id="delete-deck-modal" tabIndex={-1} aria-hidden="true" className="fixed top-0 left-0 right-0 z-50 hidden w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full">
                <h2>Delete Deck</h2>
                <p>
                    To finish deleting this deck, type the name of the deck in the text box below:
                </p>
                <input placeholder="Deck Name" />
            </div>
        </>
    );
}
