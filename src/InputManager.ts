

export class InputManager {

    private state: { [keyCode: string]: boolean };

    private key_map = {
        'up': 'w',
        'left': 'a',
        'down': 's',
        'right': 'd',
    }

    constructor() {
        this.state = {};
        window.onkeyup = (e) => this.onKeyDown(e);
        window.onkeydown = (e) => this.onKeyUp(e);
    }

    private onKeyUp(e: KeyboardEvent) {
        this.state[e.key] = true;
    }

    private onKeyDown(e: KeyboardEvent) {
        this.state[e.key] = false;
    }

    public isInputPressed(input: string): boolean {
        return this.state[this.key_map[input]] == true;
    }
}