import * as signalR from "@microsoft/signalr";
import { Vector3 } from "three";
import { ModelLoader } from "./ModelLoader";
import { Player } from "./Player";

export class GameServer {

    private gameServerUrl = "http://localhost:5044/game";
    private connection: signalR.HubConnection;

    private worldState: WorldState = {};
    private objects: { [id:string]: THREE.Object3D } = {};

    public modelLoader: ModelLoader;

    constructor(private world: THREE.Object3D) {
        this.initializeConnection();
        this.modelLoader = new ModelLoader();
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
        if (this.worldState.T > worldState.T) return; 
        this.worldState = worldState;

        for (let key in worldState)
        {
            if (key == 'T') continue;
            if (key == this.connection.connectionId) continue;
            

            if (!this.objects[key]) {
                const model = await Player.CreateInstance();
                this.objects[key] = model;
                this.world.add(this.objects[key]);
            } 

            this.objects[key].position.set(worldState[key].x, worldState[key].y, worldState[key].z);
            (this.objects[key] as Player).render(0);
        }        
    }

    sendPosition(position: Vector3, rotation: number) {
        if (this.connection.state != signalR.HubConnectionState.Connected) return;
        this.connection.send("updatePos", position.x , position.y, position.z, rotation, Date.now());
    }
}

type WorldState = {
    [key: string]: WorldObjectState
}

class WorldObjectState {
    x: number;
    y: number;
    z: number;
    rotation: number;
    time: number;
}