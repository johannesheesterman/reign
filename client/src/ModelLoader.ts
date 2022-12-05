import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { clone } from "three/examples/jsm/utils/SkeletonUtils";

export class ModelLoader {
    private gltfLoader: GLTFLoader;
    private gltfs: { [url: string]: GLTF } = {};
    
    constructor() {
        this.gltfLoader = new GLTFLoader();
    }

    async getModel(url: string) : Promise<THREE.Object3D> {
        if (!this.gltfs[url]) {
            this.gltfs[url] = await this.gltfLoader.loadAsync(url);
        }

        const object = clone(this.gltfs[url].scene);
        object.animations = [...this.gltfs[url].animations];
        return object;
    }

}