import WebSocket from 'ws'
import { Viewer } from "./../game/viewer";
import { Game } from './../game/game';
import { PlayerTick } from './../game/types';

export class SocketedViewer extends Viewer {
    constructor(private socket: WebSocket, game: Game) {
        super(game);

        this.socket.on('close', () => {
            this.game.deregisterViewer(this);
        });

        this.game.onGameCompleted(() => {
            this.socket.close();
        });

        this.game.registerViewer(this);
    }

    onTick(tick: PlayerTick) {
        this.socket.send(JSON.stringify(tick));
    }
}