import * as THREE from "three";
import { Vector3 } from "three";
import { GameObject } from "./GameObject";
import { GameServer } from "./GameServer";
import { InputManager } from "./InputManager";

declare var inputManager: InputManager;
declare var gameServer: GameServer;

export class Player extends GameObject{

    private scene: THREE.Object3D;
    private animationMixer: THREE.AnimationMixer;
    private animationActions: { [name: string]: THREE.AnimationAction }; 
    private speed = 3;
    
    constructor() {
        super();
        this.initialize();

        setInterval(() => {
            if (this.scene) {
                gameServer.sendPosition(this.position, this.scene.rotation.y);
            }                    
        }, 100);
    }

    private async initialize() {
        const model = await gameServer.modelLoader.getModel('models/archer.glb');
        this.scene = model;
        this.add(this.scene);
        
        this.animationMixer = new THREE.AnimationMixer( this.scene );
        this.animationActions = {};
        for (let animation of this.scene.animations) {
            this.animationActions[animation.name] = this.animationMixer.clipAction(animation);
            this.animationActions[animation.name].loop = THREE.LoopRepeat;
        }
    }

    private velocity = new Vector3(0, 0, 0);
    render(delta: number): void {
        if (!this.scene) return;

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
            this.scene.rotation.y = Math.atan2(-this.velocity.z, this.velocity.x) + Math.PI/2;
            this.playRunAnimation();
        } else {
            this.playIdleAnimation();
        }
    }

    private playRunAnimation() {
        if (!this.animationActions['Run'].isRunning()) {
            this.animationActions['Run'].play();            
            this.animationActions['Idle'].stop();
        }
    }

    private playIdleAnimation() {
        if (!this.animationActions['Idle'].isRunning()) {
            this.animationActions['Idle'].play();           
            this.animationActions['Run'].stop();             
        }
    }

}