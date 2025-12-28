/**
 * @fileoverview ComponentErrorBoundary - Catches and displays component errors gracefully
 * @module showcase/components/ComponentErrorBoundary
 */

import { Component, type ReactNode, type ErrorInfo } from 'react';

interface Props {
    children: ReactNode;
    componentName: string;
    onReset?: () => void;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

/**
 * Error boundary that catches component rendering errors
 * and displays a fallback UI instead of crashing the page.
 */
export class ComponentErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error(`[${this.props.componentName}] Render error:`, error, errorInfo);
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null });
        this.props.onReset?.();
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="component-error-boundary">
                    <div className="component-error-boundary__icon">⚠️</div>
                    <div className="component-error-boundary__title">
                        {this.props.componentName} Error
                    </div>
                    <div className="component-error-boundary__message">
                        {this.state.error?.message || 'An error occurred while rendering this component'}
                    </div>
                    <button
                        type="button"
                        className="component-error-boundary__reset"
                        onClick={this.handleReset}
                    >
                        Try Again
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ComponentErrorBoundary;
