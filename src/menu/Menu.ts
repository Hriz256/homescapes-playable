import * as PIXI from "pixi.js";
import { MenuButton } from "./MenuButton";
import Assets from "../core/Assets";
import { Atlas } from "../AtlasesMap";
import gsap, { Sine } from "gsap";
import { BlueCarpet } from "./buttons/BlueCarpet";
import { OrangeCarpet } from "./buttons/OrangeCarpet";
import { GreenCarpet } from "./buttons/GreenCarpet";
import { Stairs } from "../scene/StairsContainer";

export class Menu extends PIXI.Container {
	public ACCEPT_STAIR = "accept_stair";
	public CHANGE_STAIR = "change_stair";

	private _buttons: Map<Stairs, MenuButton> = new Map();
	private _blueCarpet: BlueCarpet;
	private _orangeCarpet: OrangeCarpet;
	private _greenCarpet: GreenCarpet;
	private _acceptButton: PIXI.Sprite;

	constructor() {
		super();

		this._blueCarpet = new BlueCarpet();
		this._buttons.set(Stairs.BLUE, this._blueCarpet);
		this.addChild(this._blueCarpet);

		this._orangeCarpet = new OrangeCarpet();
		this._orangeCarpet.x = this._blueCarpet.width;
		this._buttons.set(Stairs.ORANGE, this._orangeCarpet);
		this.addChild(this._orangeCarpet);

		this._greenCarpet = new GreenCarpet();
		this._greenCarpet.x = this._orangeCarpet.x + this._orangeCarpet.width;
		this._buttons.set(Stairs.GREEN, this._greenCarpet);
		this.addChild(this._greenCarpet);

		this.createAcceptButton();

		for (const [key, button] of this._buttons) {
			button.y = -button.height;
			button.alpha = 0;
			button.on("pointerdown", () => this.changeActiveButton(key), this);
		}
	}

	private createAcceptButton() {
		this._acceptButton = Assets.sprite(Atlas.button_ok);
		this._acceptButton.anchor.x = 0.5;
		this._acceptButton.interactive = true;
		this._acceptButton.buttonMode = true;
		this._acceptButton.visible = false;
		this.addChild(this._acceptButton);

		this._acceptButton.on("pointerdown", () => this.emit(this.ACCEPT_STAIR), this);
	}

	private changeActiveButton(key: Stairs) {
		const button = this._buttons.get(key);

		if (!button.select) {
			[...this._buttons].forEach(button => button[1].select = false);
			button.select = true;

			/** меняем лестницу */
			this.emit(this.CHANGE_STAIR, key);

			const x = Math.floor(button.x + button.width * 0.5);
			if (!this._acceptButton.visible) {
				this._acceptButton.visible = true;
				this._acceptButton.position.set(x, button.height - 30);
			} else {
				gsap.killTweensOf(this._acceptButton);
				gsap.to(this._acceptButton, 0.2, { x, ease: Sine.easeOut });
			}
		}
	}

	public showButtons() {
		const buttons = [...this._buttons].map(button => button[1]);
		gsap.to(buttons, 0.3, { y: 0, alpha: 1, stagger: 0.1 });
	}
}
