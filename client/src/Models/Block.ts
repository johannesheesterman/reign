import * as THREE from "three";
import { GameObject } from "../GameObject";

export class Block extends GameObject {
    


    private constructor() {
        super();
    }

    public static async CreateInstance() : Promise<Block> {
        const block = new Block();
        await block.initialize();
        return block;
    }

    private async initialize() {
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        const cube = new THREE.Mesh(geometry, material);
        this.add(cube);
    }

    render(delta: number): void {
    }
}