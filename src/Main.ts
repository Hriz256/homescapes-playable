import { App } from "./core/App";
import { Scene } from "./scene/Scene";
import Assets from "./core/Assets";

class Main {
	private readonly _realWidth = 1390;
	private readonly _realHeight = 640;
	private readonly _app: App;
	private _scene: Scene;

	constructor() {
		this._app = new App({
			width: this._realWidth,
			height: this._realHeight,
			resolution: window.devicePixelRatio,
		});

		this.refreshSize();
		this.init();

		window.addEventListener("resize", this.refreshSize.bind(this));
	}

	private async init() {
		await Assets.loadResources();
		this._scene = new Scene();
		this._app.stage.addChild(this._scene);
	}

	private refreshSize(): void {
		const vpw = window.innerWidth;
		const vph = window.innerHeight;
		let nvw;
		let nvh;

		if (vph / vpw < this._realHeight / this._realWidth) {
			nvh = vph;
			nvw = (nvh * this._realWidth) / this._realHeight;
		} else {
			nvw = vpw;
			nvh = (nvw * this._realHeight) / this._realWidth;
		}

		App.renderer.view.style.width = `${nvw}px`;
		App.renderer.view.style.height = `${nvh}px`;
		App.renderer.resize(nvw, nvh);
		this._app.stage.scale.set(nvw / this._realWidth, nvh / this._realHeight);
	}
}

new Main();
