import * as PIXI from "pixi.js";
import Assets, { path } from "../core/Assets";
import { Atlas } from "../AtlasesMap";

export class MenuButton extends PIXI.Container {
	protected _bg: PIXI.Sprite;
	protected _icon: PIXI.Sprite;
	private _selectedBg: PIXI.Sprite;
	private _isActive = false;

	constructor(iconPath: path) {
		super();

		this.interactive = true;
		this.buttonMode = true;

		this._bg = Assets.sprite(Atlas.circle);
		this.addChild(this._bg);

		/** Иконка имеет прозрачные пиксели, поэтому чтобы она не растягивала кнупку - отсекаю маской */
		const bgMask = Assets.sprite(Atlas.circle);
		this.addChild(bgMask);

		this._selectedBg = Assets.sprite(Atlas.circle_selected);
		this._selectedBg.anchor.set(0.5);
		this._selectedBg.position.set(Math.floor(this.width * 0.5), Math.floor(this.width * 0.5) - 4);
		this._selectedBg.visible = false;
		this.addChild(this._selectedBg);

		this._icon = Assets.sprite(iconPath);
		this._icon.anchor.set(0, 1);
		this._icon.mask = bgMask;
		this.addChild(this._icon);
	}

	public set select(selected: boolean) {
		this._selectedBg.visible = selected;
		this._isActive = selected;
	}

	public get select() {
		return this._isActive;
	}
}
