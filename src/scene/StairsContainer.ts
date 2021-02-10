import * as PIXI from "pixi.js";
import Assets from "../core/Assets";
import { Atlas } from "../AtlasesMap";
import gsap, { TimelineMax } from "gsap";

export enum Stairs {
	BLUE,
	ORANGE,
	GREEN,
	OLD,
}

export class StairsContainer extends PIXI.Container {
	private _stairs: Map<Stairs, PIXI.Sprite> = new Map();
	/** анимация смены лестниц */
	private _stairTimeline: TimelineMax;
	/** активная лестница */
	private _activeStair: Stairs = Stairs.OLD;
	private _y: number = 0;

	constructor() {
		super();

		const oldStair = Assets.sprite(Atlas.old_stair);
		oldStair.anchor.x = 1;
		oldStair.position.set(0, 125);
		this._stairs.set(Stairs.OLD, oldStair);
		this.addChild(oldStair);

		const blueStair = Assets.sprite(Atlas.blue_stair);
		blueStair.anchor.x = 1;
		blueStair.position.set(0, 18);
		blueStair.alpha = 0;
		this._stairs.set(Stairs.BLUE, blueStair);
		this.addChild(blueStair);

		const orangeStair = Assets.sprite(Atlas.orange_stair);
		orangeStair.anchor.x = 1;
		orangeStair.position.set(0, 28);
		orangeStair.alpha = 0;
		this._stairs.set(Stairs.ORANGE, orangeStair);
		this.addChild(orangeStair);

		const greenStair = Assets.sprite(Atlas.green_stair);
		greenStair.anchor.x = 1;
		greenStair.position.set(0, 25);
		greenStair.alpha = 0;
		this._stairs.set(Stairs.GREEN, greenStair);
		this.addChild(greenStair);
	}

	public changeStair(key: Stairs) {
		const currentStair = [...this._stairs].find(stair => stair[0] === this._activeStair)[1];
		const nextStair = this._stairs.get(key);
		const offsetY = 65;

		this._stairTimeline?.kill();
		this._stairTimeline = new TimelineMax();

		this._stairTimeline.to(currentStair, 0.3, { alpha: 0 }, 0);
		this._stairTimeline.to(currentStair, 0.3, { y: currentStair.y - offsetY }, 0);
		this._stairTimeline.set(currentStair, { y: this._y }, 0.3);

		/** запоминаем реальную позицию лестницы */
		this._y = nextStair.y;

		this._stairTimeline.to(nextStair, 0.3, { alpha: 1 }, 0.3);
		this._stairTimeline.fromTo(nextStair, 0.3, { y: -offsetY }, { y: -15 }, 0.3);

		this._activeStair = key;
	}

	/** Опустить выбранную лестницу на исходную позицию */
	public lowerStair(duration: number) {
		gsap.to(this._stairs.get(this._activeStair), duration, { y: this._y });
	}

	public destroy(options?: { children?: boolean; texture?: boolean; baseTexture?: boolean }) {
		this._stairTimeline?.kill();
		super.destroy(options);
	}
}
