import * as THREE from 'three';

export abstract class GameObject extends THREE.Object3D {

    public position: THREE.Vector3;

    constructor() { 
        super();
    }

    abstract render(delta: number): void;
}