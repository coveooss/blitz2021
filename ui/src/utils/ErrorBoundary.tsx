import * as React from 'react';

class ErrorBoundary extends React.Component {
    state = { hasError: false };

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        // You can also log the error to an error reporting service
        console.log(error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return <h1>There was an error while rendering the game. Try to look at the console and report this to our administrators.</h1>;
        }

        return this.props.children;
    }
}
export default ErrorBoundary;
