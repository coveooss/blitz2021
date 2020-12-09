import React from 'react';
import {render} from '@testing-library/react';
import App from './app';

it('App contains some text', () => {
    const {findAllByText} = render(
        <App />,
    );

    expect(findAllByText(/Hello/i)).toBeTruthy();
});
