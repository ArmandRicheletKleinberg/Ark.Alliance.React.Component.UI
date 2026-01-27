import React, { useState } from 'react';
import { Modal, ModalModel, Button } from 'ark-alliance-react-ui';

export const ModalWrapper: React.FC<ModalModel> = (props) => {
    const [isOpen, setIsOpen] = useState(props.isOpen ?? false);

    const handleClose = () => {
        setIsOpen(false);
    };

    return (
        <div className="p-8 flex items-center justify-center min-h-[300px] border border-ark-border/30 rounded-lg bg-ark-bg-secondary/10">
            <Button onClick={() => setIsOpen(true)}>
                Open Modal
            </Button>

            <Modal
                {...props}
                isOpen={isOpen}
                onClose={handleClose}
            >
                <div className="space-y-4 text-ark-text-primary">
                    <p>This is a demonstration of the Modal component.</p>
                    <p>You can configure the size, variant, and behavior from the control panel.</p>
                    <div className="flex justify-end gap-2 mt-6">
                        <Button variant="ghost" onClick={handleClose}>Cancel</Button>
                        <Button variant="primary" onClick={handleClose}>Confirm</Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};
