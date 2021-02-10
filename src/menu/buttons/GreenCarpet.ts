import { MenuButton } from "../MenuButton";
import { Atlas } from "../../AtlasesMap";

export class GreenCarpet extends MenuButton {
	constructor() {
		super(Atlas.carpet_green);
		this._icon.position.set(28, Math.floor(this._bg.height - 30));
	}
}
