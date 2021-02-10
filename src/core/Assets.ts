import * as PIXI from "pixi.js";
import { Atlas } from "../AtlasesMap";

export type path = typeof Atlas[keyof typeof Atlas];

class Assets {
	private readonly _atlasName = "textures" as const;
	private _textures: Record<path, PIXI.Texture>;

	public sprite(id: path) {
		return new PIXI.Sprite(this._textures[id]);
	}

	public loadResources() {
		const loader = this.loader;
		const path = `assets/${ this._atlasName }.json`;

		loader.add(this._atlasName, path, () => this.onAtlasLoaded(loader));

		return new Promise((resolve) => loader.load(resolve));
	}

	private get loader() {
		const loader = new PIXI.Loader();
		loader.defaultQueryString = `v=${ Math.random() }`;
		return loader;
	}

	private onAtlasLoaded(loader: PIXI.Loader) {
		this._textures = { ...this._textures, ...loader.resources[this._atlasName].textures };
	}
}

export default new Assets();
