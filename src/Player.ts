import * as THREE from "three";
import { Vector3 } from "three";
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { GameObject } from "./GameObject";
import { InputManager } from "./InputManager";

declare var inputManager: InputManager;

export class Player extends GameObject{

    private gltf: GLTF;
    private animationMixer: THREE.AnimationMixer;
    
    private speed = 3;

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

    private velocity = new Vector3(0, 0, 0);
    render(delta: number): void {
        if (this.animationMixer) {
            this.animationMixer.update(delta);
        }

        this.velocity.set(0, 0, 0);

        if (inputManager.isInputPressed('left')) {
            this.velocity.setX(-1);
        }
        if (inputManager.isInputPressed('right')) {
            this.velocity.setX(1);
        }
        if (inputManager.isInputPressed('up')) {
            this.velocity.setZ(-1);
        }
        if (inputManager.isInputPressed('down')) {
            this.velocity.setZ(1);
        }

        this.velocity = this.velocity.normalize().multiplyScalar(this.speed * delta);
        this.position.add(this.velocity);
    }

}