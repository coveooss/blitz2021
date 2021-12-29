import React from 'react';
import {render} from '@testing-library/react';
import App from '../app';

it('App contains a link to the replay page', () => {
    const {getAllByRole} = render(
        <App />,
    );

    const links = getAllByRole('link');
    expect(links.length).toBe(2);
    expect(links[0].textContent).toBe("Viewer");
    expect(links[1].textContent).toBe("Replay");
});
