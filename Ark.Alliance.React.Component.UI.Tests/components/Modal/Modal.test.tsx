/**
 * @fileoverview Modal Component Tests
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Modal } from '../../../Ark.Alliance.React.Component.UI/src/components/Modal/Modal';

// Mock createPortal since it's not supported in standard JSDOM render without setup
// But testing-library handles it reasonably well usually. If issues arise, we can mock it.
// For now, let's try rendering directly.

describe('Modal Component', () => {
    it('should not render when isOpen is false', () => {
        render(<Modal isOpen={false} onClose={() => { }}>Content</Modal>);
        expect(screen.queryByText('Content')).not.toBeInTheDocument();
    });

    it('should render content when isOpen is true', () => {
        render(<Modal isOpen={true} onClose={() => { }}>Content</Modal>);
        expect(screen.getByText('Content')).toBeInTheDocument();
        expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('should render title and subtitle', () => {
        render(
            <Modal
                isOpen={true}
                onClose={() => { }}
                title="Test Title"
                subtitle="Test Subtitle"
            >
                Content
            </Modal>
        );
        expect(screen.getByText('Test Title')).toBeInTheDocument();
        expect(screen.getByText('Test Subtitle')).toBeInTheDocument();
    });

    it('should apply variant classes', () => {
        const { rerender } = render(
            <Modal isOpen={true} onClose={() => { }} variant="glass" testId="modal-test">
                Content
            </Modal>
        );
        let container = screen.getByTestId('modal-test');
        expect(container).toHaveClass('ark-modal--glass');

        rerender(
            <Modal isOpen={true} onClose={() => { }} variant="bordered" testId="modal-test">
                Content
            </Modal>
        );
        container = screen.getByTestId('modal-test');
        expect(container).toHaveClass('ark-modal--bordered');
    });

    it('should apply size classes', () => {
        render(
            <Modal isOpen={true} onClose={() => { }} size="lg" testId="modal-size-test">
                Content
            </Modal>
        );
        const container = screen.getByTestId('modal-size-test');
        expect(container).toHaveClass('ark-modal--lg');
    });

    it('should call onClose when close button is clicked', () => {
        const onClose = vi.fn();
        render(<Modal isOpen={true} onClose={onClose}>Content</Modal>);
        const closeBtn = screen.getByLabelText('Close modal');
        fireEvent.click(closeBtn);
        expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('should call onClose when backdrop is clicked (if enabled)', () => {
        const onClose = vi.fn();
        render(<Modal isOpen={true} onClose={onClose} closeOnBackdrop={true}>Content</Modal>);
        // The backdrop is the outer div with role="dialog"
        const backdrop = screen.getByRole('dialog');
        fireEvent.click(backdrop);
        expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('should NOT call onClose when backdrop is clicked if disabled', () => {
        const onClose = vi.fn();
        render(<Modal isOpen={true} onClose={onClose} closeOnBackdrop={false}>Content</Modal>);
        const backdrop = screen.getByRole('dialog');
        fireEvent.click(backdrop);
        expect(onClose).not.toHaveBeenCalled();
    });

    it('should call onClose when Escape key is pressed', () => {
        const onClose = vi.fn();
        render(<Modal isOpen={true} onClose={onClose} closeOnEscape={true}>Content</Modal>);
        fireEvent.keyDown(document, { key: 'Escape' });
        expect(onClose).toHaveBeenCalledTimes(1);
    });
});
