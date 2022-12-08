import * as THREE from "three";
import { GameObject } from "./GameObject";
import { GameServer } from "./GameServer";
import { InputManager } from "./InputManager";
import { Player } from "./Player";

declare var inputManager: InputManager;
declare var gameServer: GameServer;

export class PlayerController extends GameObject {
    
    private speed = 3;
    private model: Player;

    private mousePos = new THREE.Vector2();
    private mouseDown = false;
    private playerPos = new THREE.Vector3();

    
    constructor(private camera: THREE.Camera) {
        super();

        Player.CreateInstance().then((model) => {
            this.model = model;
            this.add(this.model)
            this.initializeGameServerUpdates();
        });        

        document.addEventListener('mousedown', () => this.mouseDown = true);
        document.addEventListener('mouseup', () => this.mouseDown = false);
        document.addEventListener('mousemove', (e) => this.mousePos.set(e.clientX, e.clientY));
    }

    private initializeGameServerUpdates() {
        setInterval(() => {
            gameServer.sendPosition(this.model.position, this.model.scene.rotation.y);      
        }, 15);
    }

    render(delta: number): void {
        if (!this.model) return;
        
        this.model.velocity.set(0, 0, 0);
        
        if (this.mouseDown) {
            this.updatePlayerPos();

            const angle = Math.atan2(this.mousePos.y - this.playerPos.y, this.mousePos.x - this.playerPos.x) + 1.25 * Math.PI;

            this.model.velocity.setX(Math.sin(-angle));
            this.model.velocity.setZ(Math.cos(angle));

            this.model.velocity = this.model.velocity
                .normalize()
                .multiplyScalar(this.speed * delta);            
        }
        
        this.model.render(delta);
    }

    private updatePlayerPos() {
        this.playerPos = this.playerPos.setFromMatrixPosition(this.model.matrixWorld);
        this.playerPos.project(this.camera);                
        let widthHalf = window.innerWidth / 2;
        let heightHalf = window.innerHeight / 2;

        this.playerPos.x = (this.playerPos.x * widthHalf) + widthHalf;
        this.playerPos.y = - (this.playerPos.y * heightHalf) + heightHalf;
        this.playerPos.z = 0;
    }
}