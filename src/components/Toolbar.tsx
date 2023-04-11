import { Dispatch, SetStateAction } from "react";

interface Props {
    setKeybinding: Dispatch<SetStateAction<string>>;
}

export default function Toolbar({ setKeybinding }: Props) {
    return (
        <div className="flex justify-between">
            <div className="">Deck Name</div>
            <div className="">
                <select className="bg-neutral-800 rounded-md p-1" onChange={e => setKeybinding(e.target.value)} name="keybinding" id="keybinding">
                    <option value="standard" selected>Standard</option>
                    <option value="vim">Vim</option>
                    <option value="emacs">Emacs</option>
                </select>
            </div>
        </div>
    );
}
