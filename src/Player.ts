import * as THREE from "three";
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { GameObject } from "./GameObject";


export class Player extends GameObject{

    private gltf: GLTF;
    private animationMixer: THREE.AnimationMixer;

    constructor() {
        super();
        this.initialize();
    }

    private initialize() {

        const gltfLoader = new GLTFLoader();
        gltfLoader.load('models/archer.glb', (gltf) => {
            this.gltf = gltf;
        
            this.add(gltf.scene);
            gltf.scene.position.set(2, 0, 2);

            this.animationMixer = new THREE.AnimationMixer( gltf.scene );
                    
            console.log('animations', gltf.animations);
            var action = this.animationMixer.clipAction( gltf.animations[1] );
            action.loop = THREE.LoopRepeat;
            action.play();
        });

    }

    render(delta: number): void {
        if (this.animationMixer) {
            this.animationMixer.update(delta);
        }
    }

}