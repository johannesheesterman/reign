import { GameObject } from "./GameObject";
import { GameServer } from "./GameServer";
import { InputManager } from "./InputManager";
import { Player } from "./Player";

declare var inputManager: InputManager;
declare var gameServer: GameServer;

export class PlayerController extends GameObject {
    
    private speed = 3;
    private model: Player;

    constructor() {
        super();

        Player.CreateInstance().then((model) => {
            this.model = model;
            this.add(this.model)
            this.initializeGameServerUpdates();
        });        
    }

    private initializeGameServerUpdates() {
        setInterval(() => {
            gameServer.sendPosition(this.model.position, this.model.scene.rotation.y);      
        }, 15);
    }

    render(delta: number): void {
        if (!this.model) return;
        
        this.model.velocity.set(0, 0, 0);

        if (inputManager.isInputPressed('left')) {
            this.model.velocity.setX(-1);
        }
        if (inputManager.isInputPressed('right')) {
            this.model.velocity.setX(1);
        }
        if (inputManager.isInputPressed('up')) {
            this.model.velocity.setZ(-1);
        }
        if (inputManager.isInputPressed('down')) {
            this.model.velocity.setZ(1);
        }

        this.model.velocity = this.model.velocity
            .normalize()
            .multiplyScalar(this.speed * delta);
        
        this.model.render(delta);
    }
}