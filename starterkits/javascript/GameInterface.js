/**
 * @typedef IPosition
 * @type {object}
 * @property {number} x
 * @property {number} y
 */

/**
 * @typedef IDepot
 * @type {object}
 * @property {IPosition} position
 * @property {number} blitzium
 */

/**
 * @typedef IUnit
 * @type {object}
 * @property {string} id
 * @property {UnitType} type
 * @property {number} blitzium
 * @property {IPosition} position
 * @property {IPosition[]} path
 */

/**
 * @typedef ICrew
 * @type {object}
 * @property {string} id
 * @property {string} name
 * @property {IPosition} homeBase
 * @property {number} blitzium
 * @property {number} totalBlitzium
 * @property {IUnit[]} units
 * @property {string[]} errors
 * @property {{MINER: number, CART: number, OUTLAW: number}} prices
 */

/**
 * @typedef IMap
 * @type {object}
 * @property {ITypeType[][]} tiles
 * @property {IDepot[]} depots
 */

/**
 * @typedef IRules
 * @type {object}
 * @property {number} MAX_MINER_CARGO
 * @property {number} MAX_CART_CARGO
 * @property {number} MAX_MINER_MOVE_CARGO
 */

/**
 * @typedef IGameTick
 * @type {object}
 * @property {number} tick
 * @property {number} totalTick
 * @property {string} crewId
 * @property {ICrew[]} crews
 * @property {IMap} map
 * @property {IRules} rules
 */

/**
 * @typedef IBuyAction
 * @type {object}
 * @property {ActionType} type = ActionType.Buy
 * @property {UnitType} unitType
 */

/**
 * @typedef IUnitAction
 * @type {object}
 * @property {ActionType} type = ActionType.Unit
 * @property {IPosition} target
 * @property {string} unitId
 * @property {ActionType} action
 */

/**
 * @typedef {(IBuyAction | IUnitAction)} IAction
 */

/**
 * @typedef IGameCommand
 * @type {object}
 * @property {IAction[]} actions
 */

class PointOutOfMapException extends Error {
  /**
   * 
   * @param {IPosition} point 
   * @param {number} size 
   */
  constructor(point, size) {
    super(`Point {${point.x}, ${point.y}} is out of map, x and y must be greater than 0 and less than ${size}.`);
  }
}

/**
 * @implements {IGameTick}
 */
class GameMessage {
  /**
   * @type {number}
   * @readonly
   */
  tick;
  /**
   * @type {number}
   * @readonly
   */
  totalTick;
  /**
   * @type {string}
   * @readonly
   */
  crewId;
  /**
   * @type {ICrew[]}
   * @readonly
   */
  crews;
  /**
   * @type {IMap}
   * @readonly
   */
  map;
  /**
   * @type {IRules}
   * @readonly
   */
  rules;

  /**
   * 
   * @param {IGameTick} rawTick 
   */
  constructor(rawTick) {
    Object.assign(this, rawTick);
  }

  /**
   * @returns {number}
   */
  getMapSize() {
    return this.map.tiles.length;
  }

  /**
   * @param {IPosition} position 
   */
  validateTileExists(position) {
    if (position.x < 0 || position.y < 0 || position.x >= this.getMapSize() || position.y >= this.getMapSize()) {
      throw new PointOutOfMapException(position, this.getMapSize());
    }
  }

  /**
   * @param {IPosition} position 
   * @returns {TileType}
   */
  getTileTypeAt(position) {
    this.validateTileExists(position);
    return this.rawTick.map[position.x][position.y];
  }

  /**
   * @returns {Object.<string, ICrew>}
   */
  getPlayerMapById() {
    return this.crews.map(c => [c.id, c]);
  }
}

/**
* @readonly
* @enum {string}
*/
const UnitType = Object.freeze({
  Miner: 'MINER',
  Cart: 'CART',
  Outlaw: 'OUTLAW'
});

/**
 * @readonly
 * @enum {string}
 */
const UnitActionType = Object.freeze({
  Move: 'MOVE',
  Mine: 'MINE',
  None: 'NONE',
  PickUp: 'PICKUP',
  Drop: 'DROP'
});

/**
 * @readonly
 * @enum {string}
 */
const ActionType = Object.freeze({
  Buy: 'BUY',
  Unit: 'UNIT'
});

/**
 * @readonly
 * @enum {string}
 */
const TileType = Object.freeze({
  Empty: 'EMPTY',
  Wall: 'WALL',
  Base: 'BASE',
  Mine: 'MINE'
});

module.exports = {
  PointOutOfMapException,
  GameMessage,
  UnitType,
  UnitActionType,
  ActionType,
  TileType
}