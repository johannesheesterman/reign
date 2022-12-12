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

        document.addEventListener('mousedown', (e) => this.onMouseDown(e));
        document.addEventListener('mouseup', (e) => this.onMouseUp(e));
        document.addEventListener('mousemove', (e) => this.onMouseMove(e));
    }

    private initializeGameServerUpdates() {
        setInterval(() => {
            gameServer.sendPosition(this.model.position, this.model.scene.rotation.y);      
        }, 15);
    }
    
    private onMouseDown(e: MouseEvent) {
        if (e.button == 0) { // Left
            this.mouseDown = true
        }
        else if (e.button == 2) { // Right
            this.shoot(this.angle);    
        }            
    }

    private onMouseUp(e: MouseEvent) {
        this.mouseDown = false
    }

    private onMouseMove(e: MouseEvent) {
        this.angle = Math.atan2(e.clientY - window.innerHeight/2, e.clientX - window.innerWidth/2) + 1.25 * Math.PI;
    }

    private shoot(angle: number) {
        // angle = angle + 2 * (1.25 * Math.PI);
        gameServer.shoot(this.model.position, angle);
    }

    render(delta: number): void {
        if (!this.model) return;
        
        this.model.velocity.set(0, 0, 0);
        
        if (this.mouseDown) {
            this.model.velocity.setX(Math.sin(-this.angle));
            this.model.velocity.setZ(Math.cos(this.angle));

            this.model.velocity = this.model.velocity
                .normalize()
                .multiplyScalar(this.speed * delta);            
        }

        if (inputManager.leftJoystick.value.x != 0 && inputManager.leftJoystick.value.y != 0) {
            const angle = Math.atan2(inputManager.leftJoystick.value.y , inputManager.leftJoystick.value.x) + 1.25 * Math.PI;
            this.model.velocity.setX(Math.sin(-angle));
            this.model.velocity.setZ(Math.cos(angle));

            this.model.velocity = this.model.velocity
                .normalize()
                .multiplyScalar(this.speed * delta);
        }
        
        this.model.render(delta);
    }
}