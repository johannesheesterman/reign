import * as THREE from "three";
import { Vector3 } from "three";
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { GameObject } from "./GameObject";
import { InputManager } from "./InputManager";

declare var inputManager: InputManager;

export class Player extends GameObject{

    private gltf: GLTF;
    private animationMixer: THREE.AnimationMixer;
    private animationActions: { [name: string]: THREE.AnimationAction }; 
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

            this.animationActions = {};
            for (let animation of gltf.animations) {
                this.animationActions[animation.name] = this.animationMixer.clipAction(animation);
                this.animationActions[animation.name].loop = THREE.LoopRepeat;
            }
        });

    }

    private velocity = new Vector3(0, 0, 0);
    render(delta: number): void {
        if (!this.gltf) return;

        this.animationMixer.update(delta);

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
        

        if(this.velocity.length() > 0) {
            this.position.add(this.velocity);
            this.gltf.scene.rotation.y = Math.atan2(-this.velocity.z, this.velocity.x) + Math.PI/2;
            this.playRunAnimation();
        } else {
            this.playIdleAnimation();
        }
    }

    private playRunAnimation() {
        if (!this.animationActions['Run'].isRunning()) {
            this.animationActions['Idle'].stop();
            this.animationActions['Run'].play();            
        }
    }

    private playIdleAnimation() {
        if (!this.animationActions['Idle'].isRunning()) {
            this.animationActions['Run'].stop();
            this.animationActions['Idle'].play();            
        }
    }

}