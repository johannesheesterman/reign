import * as signalR from "@microsoft/signalr";
import { Vector3 } from "three";
import { ModelLoader } from "./ModelLoader";

export class GameServer {

    private gameServerUrl = "http://localhost:5044/game";
    private connection: signalR.HubConnection;
    private otherPlayers: { [id:string]: THREE.Object3D } = {};

    public modelLoader: ModelLoader;

    constructor(private world: THREE.Object3D) {
        this.initializeConnection();
        this.modelLoader = new ModelLoader();
    }

    private initializeConnection() {
        this.connection = new signalR.HubConnectionBuilder()
            .withUrl(this.gameServerUrl)
            .build();

        this.connection.on("messageReceived", (connId: string, x: number, y: number, z: number, r: number) => {
            this.onReceivePosition(connId, x, y, z, r);
        });

        this.connection.start().catch((err) => console.error(err))
    }
    
    sendPosition(position: Vector3, rotation: number) {
        if (this.connection.state != signalR.HubConnectionState.Connected) return;
        this.connection.send("updatePos", position.x , position.y, position.z, rotation);
    }

    private async onReceivePosition(connId: string, x: number, y: number, z: number, r: number) {
        if (connId == this.connection.connectionId) return;

        if (!this.otherPlayers[connId]) {
            const model = await this.modelLoader.getModel('models/archer.glb');
            this.otherPlayers[connId] = model;
            this.world.add( this.otherPlayers[connId]);
        } 
        this.otherPlayers[connId].position.set(x, y, z);
    }
}