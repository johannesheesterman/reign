import * as signalR from "@microsoft/signalr";
import * as THREE from "three";
import { Vector3 } from "three";
import { lerp } from "three/src/math/MathUtils";
import { PlayerController } from "./Controllers/PlayerController";
import { ModelLoader } from "./ModelLoader";
import { Arrow } from "./Models/Arrow";
import { Player } from "./Models/Player";

declare var playerController: PlayerController;

export class GameServer {

    private gameServerUrl = "http:///localhost:5044/game";
    private connection: signalR.HubConnection;

    private worldStateBuffer: WorldState[] = [];
    private interpolationOffset = 100;
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

        this.connection.start()
            .then(() => {
                document.getElementById('player-id').innerText = `Player: ${this.connection.connectionId}`;
            })
            .catch((err) => console.error(err))
    }
    
    private async onReceiveWorldState(worldState: WorldState) {
        worldState.T = Date.now();
        this.worldStateBuffer.push(worldState);   

        for (let key of Object.keys(this.objects)) {
            if (!(key in worldState)) {
                this.world.remove(this.objects[key]);
                delete this.objects[key];
            }
        }
    }

    public render(delta:number) {

        if (this.worldStateBuffer.length < 2) return;

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

            const state0 = this.worldStateBuffer[0][key] as WorldObjectState;
            const state1 = this.worldStateBuffer[1][key] as WorldObjectState;
            if (!state0 || !state1) continue;


            if (key == this.connection.connectionId) {
                let p1 = new THREE.Vector3(state1.x, state1.y, state1.z);
                let p2 = playerController['model'].position;
                if (p1.distanceTo(p2) > 0.5) {
                    playerController.setPosition(p1.x, p1.y, p1.z);
                }
                continue;
            };

            if (!this.objects[key]) {
                this.objects[key] = new THREE.Object3D();
                if ((worldState[key] as WorldObjectState).type == 'player') {
                    Player.CreateInstance().then((model) => {
                        this.objects[key] = model;
                        this.world.add(this.objects[key]);
                    });
                }
                else if ((worldState[key] as WorldObjectState).type == 'arrow') {
                    Arrow.CreateInstance().then((model) => {
                        this.objects[key] = model;
                        this.world.add(this.objects[key]);
                    });
                }                
            }           

            const target = new THREE.Vector3(
                state0.x == state1.x ? state1.x : lerp(state0.x, state1.x, interpolationFactor),
                state0.y == state1.y ? state1.y : lerp(state0.y, state1.y, interpolationFactor),
                state0.z == state1.z ? state1.z : lerp(state0.z, state1.z, interpolationFactor)
            );

            const object = this.objects[key] as Player;
            
            object.velocity = target.sub(object.position);

            if (!object.render) continue;
            object.render(delta);
            //object.scene.rotation.y = lerp(state0.rotation, state1.rotation, interpolationFactor);
        }
    }
    
    sendPosition(position: Vector3, rotation: number) {
        if (this.connection.state != signalR.HubConnectionState.Connected) return;
        this.connection.send("updatePos", position.x , position.y, position.z, rotation, Date.now());
    }

    shoot(position: Vector3, angle: number) {
        if (this.connection.state != signalR.HubConnectionState.Connected) return;
        this.connection.send("shoot", position.x , position.y, position.z, angle, Date.now());
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
    type: string;
}