import * as PIXI from "pixi.js";
import { Atlas } from "../AtlasesMap";
import Assets from "../core/Assets";
import { Menu } from "../menu/Menu";
import { Sine, TimelineMax } from "gsap";
import { StairsContainer } from "./StairsContainer";

export class Scene extends PIXI.Container {
	private _blackLayer: PIXI.Graphics;
	private _appealPopup: PIXI.Sprite;
	/** анимация кнопки "continue" */
	private _buttonContinueTimeline: TimelineMax;
	/** анимация появления финального попапа и затемнения */
	private _popupTimeline: TimelineMax;
	/** анимация молоточка */
	private _hammerTimeline: TimelineMax;
	private _menu: Menu;
	private _stairContainer: StairsContainer;

	constructor() {
		super();

		const bg = Assets.sprite(Atlas.bg);
		this.addChild(bg);

		this.createDecor();

		const austin = Assets.sprite(Atlas.Austin);
		austin.position.set(696, 113);
		this.addChild(austin);

		this.createHammer();
		this.createMenu();
		this.createPopup();

		const logo = Assets.sprite(Atlas.logo);
		logo.position.set(32, 5);
		this.addChild(logo);

		this.createButtonContinue();
	}

	/** Создание и анимация молоточка */
	private createHammer() {
		const hammer = Assets.sprite(Atlas.icon_hammer);
		hammer.position.set(1087, 258);
		hammer.interactive = true;
		hammer.buttonMode = true;
		hammer.alpha = 0;
		hammer.visible = false;
		hammer.on("pointerdown", () => {
			this._hammerTimeline?.kill();
			this._hammerTimeline = new TimelineMax();
			this._menu.showButtons();
			this._hammerTimeline.to(hammer, 0.3, { alpha: 0 }, 0);
			this._hammerTimeline.set(hammer, { visible: false }, 0.3);
		}, this);
		this.addChild(hammer);

		this._hammerTimeline = new TimelineMax();
		this._hammerTimeline.delay(1.5);
		this._hammerTimeline.set(hammer, { visible: true });
		this._hammerTimeline.to(hammer, 0.4, { alpha: 1 });
	}

	/** Затемнение + всплыющее окно */
	private createPopup() {
		this._blackLayer = new PIXI.Graphics();
		this._blackLayer.beginFill(0x000, 0.55);
		this._blackLayer.drawRect(0, 0, this.width, this.height);
		this._blackLayer.endFill();
		this._blackLayer.alpha = 0;
		this.addChild(this._blackLayer);

		this._appealPopup = Assets.sprite(Atlas.appeal_popup);
		this._appealPopup.anchor.set(0.5);
		this._appealPopup.position.set(Math.floor(this.width * 0.5), 255);
		this._appealPopup.alpha = 0;
		this._appealPopup.scale.set(0);
		this.addChild(this._appealPopup);
	}

	/** Показывает финальное окно */
	private showAppealPopup() {
		this._popupTimeline = new TimelineMax()
			.call(() => this._stairContainer.lowerStair(0.25), [], 0)
			.to(this._menu, 0.25, { y: -this._menu.height }, 0)
			.to(this._blackLayer, 0.4, { alpha: 1 }, 0.25)
			.to(this._appealPopup.scale, 0.4, { x: 1, y: 1 }, 0.55)
			.to(this._appealPopup, 0.4, { alpha: 1 }, 0.55);
	}

	private createMenu() {
		this._menu = new Menu();
		this._menu.position.set(850, 10);
		this._menu.on(this._menu.ACCEPT_STAIR, this.showAppealPopup, this);
		this._menu.on(this._menu.CHANGE_STAIR, this._stairContainer.changeStair.bind(this._stairContainer), this);
		this.addChild(this._menu);
	}

	private createButtonContinue() {
		const buttonContinue = Assets.sprite(Atlas.button_continue);
		buttonContinue.anchor.set(0.5);
		buttonContinue.position.set(Math.floor(this.width * 0.5), 560);
		buttonContinue.interactive = true;
		buttonContinue.buttonMode = true;
		buttonContinue.on("pointerdown", () => alert("click"), this);
		this.addChild(buttonContinue);

		this._buttonContinueTimeline = new TimelineMax({
			repeat: -1, onUpdate: () => {
				const time = this._buttonContinueTimeline.totalTime();
				const speed = 3;
				buttonContinue.rotation = Math.sin(time * speed) * 0.03;
			},
		});
		this._buttonContinueTimeline
			.to(buttonContinue.scale, 0.5, { x: 1.15, y: 1.15, ease: Sine.easeIn })
			.to(buttonContinue.scale, 0.5, { x: 1, y: 1, ease: Sine.easeOut });
	}

	private createDecor() {
		const table = Assets.sprite(Atlas.table);
		table.position.set(200, 198);
		this.addChild(table);

		const sofa = Assets.sprite(Atlas.sofa);
		sofa.position.set(127, 324);
		this.addChild(sofa);

		const bookStand = Assets.sprite(Atlas.book_stand);
		bookStand.position.set(834, -25);
		this.addChild(bookStand);

		const globe = Assets.sprite(Atlas.globe);
		globe.position.set(87, 109);
		this.addChild(globe);

		const plant1 = Assets.sprite(Atlas.plant_2);
		plant1.position.set(1135, 164);
		this.addChild(plant1);

		const plant2 = Assets.sprite(Atlas.plant_2);
		plant2.position.set(456, -40);
		this.addChild(plant2);

		this._stairContainer = new StairsContainer();
		this.addChild(this._stairContainer);
		this._stairContainer.x = this.width - this._stairContainer.width;

		const plant3 = Assets.sprite(Atlas.plant_1);
		plant3.position.set(1122, 438);
		this.addChild(plant3);
	}

	public destroy(options?: { children?: boolean; texture?: boolean; baseTexture?: boolean }) {
		this._popupTimeline?.kill();
		this._buttonContinueTimeline?.kill();
		this._hammerTimeline?.kill();
		super.destroy(options);
	}
}
