import { Crew } from '../src/game/crews/crew';
import { NoopCrew } from '../src/game/crews/noopCrew';
import { Game } from '../src/game/game';
import { Cart } from '../src/game/units/cart';

describe('Cart', () => {
    let game: Game;
    let myCrew: Crew;
    let myCart: Cart;

    beforeEach(() => {
        game = new Game();
        myCrew = new NoopCrew(game);
        myCart = new Cart(myCrew, { x: 0, y: 0 });
    });

    it('should throw if it try to attack a target', () => {
        expect(() => myCart.attack({ x: 0, y: 1 })).toThrowError();
    });
});