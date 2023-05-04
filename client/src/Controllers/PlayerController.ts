import * as THREE from "three";
import { GameObject } from "../GameObject";
import { GameServer } from "../GameServer";
import { InputManager } from "./InputManager";
import { Player } from "../Models/Player";

declare var inputManager: InputManager;
declare var gameServer: GameServer;

export class PlayerController extends GameObject {
    
    private speed = 3;
    private model: Player;
    private mouseDown = false;

    private angle = 0;
    
    constructor(private camera: THREE.Camera) {
        super();

        Player.CreateInstance().then((model) => {
            this.model = model;
            this.model.add(camera);
            this.add(this.model)
            this.initializeGameServerUpdates();
        });        
    }

    private initializeGameServerUpdates() {
        setInterval(() => {
            gameServer.sendPosition(this.model.position, this.model.scene.rotation.y);      
        }, 15);
    }
    
    public setPosition(x: number, y: number, z: number) {
        this.model.position.set(x, y, z);
    }

    render(delta: number): void {
        if (!this.model) return;
        
        this.model.velocity.set(0, 0, 0);
        
        if (inputManager.leftJoystick.value.x != 0) {
            this.model.velocity.setX(inputManager.leftJoystick.value.x);

            this.model.velocity = this.model.velocity
                .normalize()
                .multiplyScalar(this.speed * delta);
        }

        // if (inputManager.leftJoystick.value.x != 0 && inputManager.leftJoystick.value.y != 0) {
        //     const angle = Math.atan2(inputManager.leftJoystick.value.y , inputManager.leftJoystick.value.x) * Math.PI;
        //     this.model.velocity.setX(Math.sin(-angle));
        //     this.model.velocity.setZ(Math.cos(angle));

        //     this.model.velocity = this.model.velocity
        //         .normalize()
        //         .multiplyScalar(this.speed * delta);
        // }
        
        this.model.render(delta);
    }
}