class Box {
    value: boolean = null;

    constructor() {

    }

    setVal(val: boolean): void {
        this.value = val;
    }

    getVal() {
        return this.value;
    }

    isEmpty(): boolean {
        return this.value == null
    }
}

let board: { spaces: Box[], checkThreeInRow: (bool:boolean)=>boolean, cells: HTMLInputElement[], createSpaces: Function } = {
    spaces: [],
    cells: Array<HTMLInputElement>(9),
    checkThreeInRow: (bool: boolean) => {
        var binaryBoard: any = '0b';
        board.spaces.forEach((box) => {
            binaryBoard = box.getVal() == bool ? binaryBoard += '1' : binaryBoard += '0';
        });

        var winBoard = [
            0b111000000,
            0b000111000,
            0b000000111,
            0b100100100,
            0b010010010,
            0b001001001,
            0b100010001,
            0b001010100,
        ];

        for (var combination of winBoard) {
            var matching: any = binaryBoard & combination;
            if (matching == combination) {
                matching = matching.toString(2).padStart(9, '0');
                return true
            }
        }
        return false
    },
    createSpaces: () => {
        board.spaces = new Array<Box>()
        for (let index = 0; index < 9; index++) {
            board.spaces.push(new Box());
        }
    }
}


export { board, Box };