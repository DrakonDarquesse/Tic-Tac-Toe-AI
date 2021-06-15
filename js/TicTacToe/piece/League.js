class League {
    constructor() {
        throw 'Cannot instantiate League object'
    }

    static league = Object.freeze({
        CROSS: 'CROSS',
        NOUGHTS: 'NOUGHTS'
    });

    static isCross(league) {
        if (league === League.league.CROSS) {
            return true;
        }
        if (league === League.league.NOUGHTS) {
            return false
        }
        throw new Error('Cannot be of type other than RED and BLACK');
    }

    static ToString(league) {
        if (league === League.league.CROSS) {
            return 'X';
        }
        if (league === League.league.NOUGHTS) {
            return 'O'
        }
        throw new Error('Cannot be of type other than RED and BLACK');
    }
}

export default League;