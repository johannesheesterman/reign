import { JoystickController } from "./JoystickController";


export class InputManager {

    private state: { [keyCode: string]: boolean };

    public leftJoystick: JoystickController;

    private key_map = {
        'up': 'w',
        'left': 'a',
        'down': 's',
        'right': 'd',
    }

    constructor() {
        this.leftJoystick = new JoystickController("stick-left", 64, 8);

        this.state = {};
        window.onkeyup = (e) => {
             this.onKeyUp(e);
        };
        window.onkeydown = (e) => {
             this.onKeyDown(e);
        };
    }

    private onKeyUp(e: KeyboardEvent) {
        this.state[e.key] = true;

        if (e.key == 'a' || e.key == 'd') {
            this.leftJoystick.value.x = 0;
        }
    }

    private onKeyDown(e: KeyboardEvent) {
        this.state[e.key] = false;

        if (e.key == 'a') {
            this.leftJoystick.value.x = -1;
        }
        else if (e.key == 'd') {
            this.leftJoystick.value.x = 1;
        }
    }

    public isInputPressed(input: string): boolean {
        return this.state[this.key_map[input]] == true;
    }
}