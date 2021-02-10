import { MenuButton } from "../MenuButton";
import { Atlas } from "../../AtlasesMap";

export class BlueCarpet extends MenuButton {
	constructor() {
		super(Atlas.carpet_blue);
		this._icon.position.set(28, Math.floor(this._bg.height - 30));
	}
}
