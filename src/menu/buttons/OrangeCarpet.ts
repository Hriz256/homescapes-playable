import { MenuButton } from "../MenuButton";
import { Atlas } from "../../AtlasesMap";

export class OrangeCarpet extends MenuButton {
	constructor() {
		super(Atlas.carpet_orange);
		this._icon.position.set(32, Math.floor(this._bg.height - 34));
	}
}
