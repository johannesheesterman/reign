import * as signalR from "@microsoft/signalr";
import * as THREE from "three";
import { Vector3 } from "three";
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { clone } from "three/examples/jsm/utils/SkeletonUtils";
import { GameObject } from "./GameObject";
import { InputManager } from "./InputManager";

declare var inputManager: InputManager;

export class Player extends GameObject{

    private gltf: GLTF;
    private scene: THREE.Object3D;
    private animationMixer: THREE.AnimationMixer;
    private animationActions: { [name: string]: THREE.AnimationAction }; 
    private speed = 3;

    private otherPlayers: { [id:string]: THREE.Object3D } = {};

    constructor() {
        super();
        this.initialize();


        const connection = new signalR.HubConnectionBuilder()
            .withUrl("http://localhost:5044/game")
            .build();

            
        connection.on("messageReceived", (connId: string, x: number, y: number, z: number, r: number) => {
            if (connId == connection.connectionId) return;
            if (!this.otherPlayers[connId]) {
                this.otherPlayers[connId] = clone(this.gltf.scene);
                this.parent.add( this.otherPlayers[connId]);
            } 
            console.log(x, y, z);
            this.otherPlayers[connId].position.set(x, y, z);
            
        });

        connection.start()
            .catch((err) => console.error(err))
            .then(() => {
                setInterval(() => {
                    if (this.gltf) {
                        connection.send("updatePos", this.position.x , this.position.y, this.position.z, this.scene.rotation.y);    
                    }                    
                }, 100);
            });
        
      
    }

    private initialize() {

        const gltfLoader = new GLTFLoader();
        gltfLoader.load('models/archer.glb', (gltf) => {
            this.gltf = gltf;
            this.scene = clone(gltf.scene);
            this.add(this.scene);

            this.animationMixer = new THREE.AnimationMixer( this.scene );

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