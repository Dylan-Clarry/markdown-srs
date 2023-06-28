import { Dispatch, SetStateAction } from "react";

interface Props {
    setKeybinding: Dispatch<SetStateAction<string>>;
}

export default function Toolbar({ setKeybinding }: Props) {
    return (
        <div className="c-top-bar pt-2">
            <div className="flex justify-between">
                <div>
                    <span className="pr-1">Deck: </span>
                    <select
                        className="rounded-md bg-neutral-800 p-1"
                        onChange={(e) => setKeybinding(e.target.value)}
                        name="deckselect"
                        id="deckselect"
                    >
                        <option value="standard">Chinese Name</option>
                    </select>
                </div>
                <div>
                    <select
                        className="rounded-md bg-neutral-800 p-1"
                        onChange={(e) => setKeybinding(e.target.value)}
                        defaultValue="standard"
                        name="keybinding"
                        id="keybinding"
                    >
                        <option value="standard">Standard</option>
                        <option value="vim">Vim</option>
                        <option value="emacs">Emacs</option>
                    </select>
                </div>
            </div>
        </div>
    );
}
