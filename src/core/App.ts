import * as PIXI from "pixi.js";

export class App extends PIXI.Application {
	private static _renderer: PIXI.Renderer;

	constructor(options: any) {
		super(options);

		document.addEventListener("contextmenu", e => e.preventDefault());
		document.body.append(this.view);

		this.stage.interactive = true;
		App._renderer = this.renderer;
		this.start();
	}

	public static get renderer(): PIXI.Renderer {
		return this._renderer;
	}
}
