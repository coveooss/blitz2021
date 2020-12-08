import { Colony } from '../src/game/colonies/colony';
import { NoopColony } from '../src/game/colonies/noopColony';
import { Game } from '../src/game/game';
import { Cart } from '../src/game/units/cart';

describe('Cart', () => {
    let game: Game;
    let myColony: Colony;
    let myCart: Cart;

    beforeEach(() => {
        game = new Game();
        myColony = new NoopColony(game);
        myCart = new Cart(myColony, { x: 0, y: 0 });
    });

    it('should throw if it try to attack a target', () => {
        expect(() => myCart.attack({ x: 0, y: 1 })).toThrowError();
    });
});