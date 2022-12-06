import * as signalR from "@microsoft/signalr";
import * as THREE from "three";
import { Vector3 } from "three";
import { lerp } from "three/src/math/MathUtils";
import { ModelLoader } from "./ModelLoader";
import { Player } from "./Player";

export class GameServer {

    private gameServerUrl = "http://localhost:5044/game";
    private connection: signalR.HubConnection;

    private lastWorldState = 0;
    private worldStateBuffer: WorldState[] = [];
    private interpolationOffset = 100;
    private objects: { [id:string]: THREE.Object3D } = {};

    public modelLoader: ModelLoader;

    private clock = new THREE.Clock();

    constructor(private world: THREE.Object3D) {
        this.initializeConnection();
        this.modelLoader = new ModelLoader();

        
        this.render();
    }

    private initializeConnection() {
        this.connection = new signalR.HubConnectionBuilder()
            .withUrl(this.gameServerUrl)
            .build();

        this.connection.on("worldState", (worldState: WorldState) => {
            this.onReceiveWorldState(worldState);
        });

        this.connection.start().catch((err) => console.error(err))
    }
    
    private async onReceiveWorldState(worldState: WorldState) {
        const t = worldState.t as unknown as number;
        if (this.lastWorldState > t) return; 
        this.lastWorldState = t;

        this.worldStateBuffer.push(worldState);

        // for (let key in worldState)
        // {
        //     if (key == 'T') continue;
        //     if (key == this.connection.connectionId) continue;
            

       

        //     this.objects[key].position.set(worldState[key].x, worldState[key].y, worldState[key].z);
        //     (this.objects[key] as Player).render(0);
        // }        
    }

    private async render() {
        requestAnimationFrame(() => this.render());

        if (this.worldStateBuffer.length < 2) return;

        const delta = this.clock.getDelta();
        const renderTime = Date.now() - this.interpolationOffset;

        while (this.worldStateBuffer.length > 2 && renderTime > this.worldStateBuffer[1].T)
            this.worldStateBuffer.splice(0, 1);
        
        const t0 = this.worldStateBuffer[0].T as number;
        const t1 = this.worldStateBuffer[1].T as number;

        const interpolationFactor = (renderTime - t0) / (t1 - t0);
         
        const worldState = this.worldStateBuffer[0];
        for (let key in worldState)
        {
            if (key == 'T') continue;
            if (key == this.connection.connectionId) continue;

            if (!this.objects[key]) {
                const model = await Player.CreateInstance();
                this.objects[key] = model;
                this.world.add(this.objects[key]);
            } 

            const pos0x = (this.worldStateBuffer[0][key] as WorldObjectState).x;
            const pos0y = (this.worldStateBuffer[0][key] as WorldObjectState).y;
            const pos0z = (this.worldStateBuffer[0][key] as WorldObjectState).z;

            const pos1x = (this.worldStateBuffer[1][key] as WorldObjectState).x;
            const pos1y = (this.worldStateBuffer[1][key] as WorldObjectState).y;
            const pos1z = (this.worldStateBuffer[1][key] as WorldObjectState).z;

            const target = new THREE.Vector3(
                lerp(pos0x, pos1x, interpolationFactor),
                lerp(pos0y, pos1y, interpolationFactor),
                lerp(pos0z, pos1z, interpolationFactor)
            );

            const object = this.objects[key] as Player;
            object.velocity = target.sub(object.position);
            object.render(delta);
            object.scene.rotation.y = (worldState[key] as WorldObjectState).rotation;
        }
    }
    

    sendPosition(position: Vector3, rotation: number) {
        if (this.connection.state != signalR.HubConnectionState.Connected) return;
        this.connection.send("updatePos", position.x , position.y, position.z, rotation, Date.now());
    }
}

type WorldState = {
    [key: string]: WorldObjectState | number
}

class WorldObjectState {
    x: number;
    y: number;
    z: number;
    rotation: number;
    time: number;
}