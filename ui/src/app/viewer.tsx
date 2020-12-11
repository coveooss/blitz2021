import * as React from 'react'

const Viewer: React.FC = () => {
    return (
        <>
            <PoorMansViewerToDelete />
        </>
    );
};

const PoorMansViewerToDelete: React.FC = () => {
    const canvas = React.useRef<HTMLCanvasElement>(null);
    const [tick, setTick] = React.useState(null);

    React.useEffect(() => {
        let socket = new WebSocket('ws://localhost:3000');

        socket.onopen = () => {
            socket.send(JSON.stringify({ type: 'VIEWER' }));

            socket.onmessage = (ev) => {
                setTick(JSON.parse(ev.data));
            }
        }

        return () => {
            socket.close();
        }
    }, []);


    const context = canvas.current?.getContext('2d');

    if (context) {
        tick.map.tiles.forEach((row, x) => {
            row.forEach((tile, y) => {
                if (tile === "EMPTY") {
                    context.fillStyle = "yellow";
                }

                if (tile === "BASE") {
                    context.fillStyle = "red";
                }

                if (tile === "MINE") {
                    context.fillStyle = "gold";
                }

                context.fillRect(x * 10, y * 10, 10, 10);
            });
        });

        let colors = [
            'blue',
            'red',
            'green',
            'back'
        ];

        tick.colonies.forEach((c, i) => {

            c.units.forEach(u => {
                context.fillStyle = colors[i];
                context.fillRect(u.position.x * 10, u.position.y * 10, 10, 10);

                u.path.forEach(p => {
                    context.fillStyle = 'rgba(0, 0, 0, 0.1)';
                    context.fillRect(p.x * 10, p.y * 10, 10, 10);
                })
            });
        })
    }

    return (
        <>
            <canvas width={500} height={500} ref={canvas}></canvas>
            {tick !== null && tick.colonies.map(c => <h3>{c.name} - {c.blitzium}</h3>)}
            {JSON.stringify(tick)}
        </>
    )
}

export default Viewer;
