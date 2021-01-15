import * as React from "react";

const Shortcuts: React.FC = () => {
    return (
        <div className="shortcuts-container">
            <details data-popover="top">
                <summary>Shortcuts</summary>
                <div>
                    <table>
                        <thead>
                        <tr>
                            <th>Key</th>
                            <th>Effect</th>
                        </tr>
                        </thead>
                        <tbody style={{fontFamily: "monospace"}}>
                        <tr>
                            <td>1-9</td>
                            <td>set the playback speed of the game</td>
                        </tr>
                        <tr>
                            <td>Space</td>
                            <td>toggle between play/pause</td>
                        </tr>
                        <tr>
                            <td>Z</td>
                            <td>go back to the start of the game</td>
                        </tr>
                        <tr>
                            <td>X</td>
                            <td>go to the end of the game</td>
                        </tr>
                        <tr>
                            <td>, (comma)</td>
                            <td>go back one player's turn</td>
                        </tr>
                        <tr>
                            <td>. (period)</td>
                            <td>go forward one player's turn</td>
                        </tr>
                        <tr>
                            <td>c</td>
                            <td>show how many Blitziums every unit holds</td>
                        </tr>
                        <tr>
                            <td>p</td>
                            <td>show the planned path of all units</td>
                        </tr>
                        <tr>
                            <td>g</td>
                            <td>show the coordinates (x, y) of all tiles</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </details>
        </div>
    )
}
export default Shortcuts;
