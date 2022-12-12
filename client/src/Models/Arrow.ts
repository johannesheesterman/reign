import * as THREE from "three";
import { GameObject } from "../GameObject";
import { GameServer } from "../GameServer";

declare var gameServer: GameServer;

export class Arrow extends GameObject {
    
    public scene: THREE.Object3D;

    private constructor() {
        super();
    }

    public static async CreateInstance() : Promise<Arrow> {
        const arrow = new Arrow();
        await arrow.initialize();
        return arrow;
    }

    private async initialize() {
        const model = await gameServer.modelLoader.getModel('models/arrow.glb');
        this.scene = model;
        this.scene.position.y = 0.9;
        this.add(this.scene);
    }
    
    public velocity = new THREE.Vector3(0, 0, 0);
    render(delta: number): void {
        if (!this.scene) return;

        this.scene.rotation.y = Math.atan2(-this.velocity.z, this.velocity.x) + Math.PI/2;

        this.position.add(this.velocity);
    }
    
}