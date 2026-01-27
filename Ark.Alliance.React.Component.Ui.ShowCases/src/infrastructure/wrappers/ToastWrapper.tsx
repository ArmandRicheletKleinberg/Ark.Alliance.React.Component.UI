import React from 'react';
import { ToastModel, Button } from 'ark-alliance-react-ui';

interface ToastWrapperProps extends ToastModel {
    demoToastType: 'success' | 'error' | 'warning' | 'info';
    demoToastMessage: string;
}

// Local Stub
const ToastPlaceholder = (props: any) => (
    <div className="p-4 border rounded bg-ark-bg-secondary text-ark-text-primary">
        <div className="font-bold">Toast Component Placeholder</div>
        <div className="text-xs opacity-70">Library export missing</div>
        <div className="mt-2">{props.children}</div>
    </div>
);

export const ToastWrapper: React.FC<ToastWrapperProps> = ({
    demoToastType = 'success',
    demoToastMessage = 'Operation successful',
    // ...props
}) => {
    return (
        <div className="relative w-full h-full min-h-[300px] border border-ark-border/30 rounded-lg overflow-hidden bg-ark-bg-secondary/20 p-8 flex flex-col items-center justify-center gap-4">
            <div className="text-ark-text-muted mb-4">Toast Notification Demo Area</div>
            <Button
                variant="primary"
                onClick={() => alert(`[Toast Triggered]\nType: ${demoToastType}\nMessage: ${demoToastMessage}`)}
            >
                Trigger {demoToastType} Toast
            </Button>

            <ToastPlaceholder>
                Demo Type: {demoToastType}
            </ToastPlaceholder>
        </div>
    );
};
