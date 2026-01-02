/**
 * @fileoverview Timeline Component Tests
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Timeline } from '../../../../Ark.Alliance.React.Component.UI/src/components/TimeLines/Timeline/Timeline';
import { TimelineItem } from '../../../../Ark.Alliance.React.Component.UI/src/components/TimeLines/Timeline/Timeline.model';

const mockItems: TimelineItem[] = [
    {
        id: '1',
        title: 'Event 1',
        category: 'Work',
        status: 'completed',
        date: '2023-01-01'
    },
    {
        id: '2',
        title: 'Event 2',
        category: 'Personal',
        status: 'active',
        tags: ['important', 'milestone']
    },
    {
        id: '3',
        title: 'Event 3',
        category: 'Work',
        status: 'pending'
    }
];

describe('Timeline', () => {
    it('should render all items by default', () => {
        render(<Timeline items={mockItems} />);
        expect(screen.getByText('Event 1')).toBeInTheDocument();
        expect(screen.getByText('Event 2')).toBeInTheDocument();
        expect(screen.getByText('Event 3')).toBeInTheDocument();
    });

    it('should filter by category', () => {
        render(<Timeline items={mockItems} selectedCategory="Work" />);
        expect(screen.getByText('Event 1')).toBeInTheDocument();
        expect(screen.getByText('Event 3')).toBeInTheDocument();
        expect(screen.queryByText('Event 2')).not.toBeInTheDocument();
    });

    it('should filter by text search (title)', () => {
        render(<Timeline items={mockItems} filter="Event 2" />);
        expect(screen.queryByText('Event 1')).not.toBeInTheDocument();
        expect(screen.getByText('Event 2')).toBeInTheDocument();
    });

    it('should filter by text search (tags)', () => {
        render(<Timeline items={mockItems} filter="milestone" />);
        expect(screen.queryByText('Event 1')).not.toBeInTheDocument();
        expect(screen.getByText('Event 2')).toBeInTheDocument();
    });

    it('should show edit button in admin mode', () => {
        const onItemEdit = vi.fn();
        render(<Timeline items={mockItems} adminMode={true} onItemEdit={onItemEdit} />);

        const editButtons = screen.getAllByLabelText('Edit item');
        expect(editButtons).toHaveLength(3);

        fireEvent.click(editButtons[0]);
        expect(onItemEdit).toHaveBeenCalledWith(expect.objectContaining({ id: '1' }));
    });

    it('should not show edit button when not in admin mode', () => {
        render(<Timeline items={mockItems} adminMode={false} />);
        expect(screen.queryByLabelText('Edit item')).not.toBeInTheDocument();
    });

    it('should handle item click', () => {
        const onItemClick = vi.fn();
        render(<Timeline items={mockItems} onItemClick={onItemClick} />);

        fireEvent.click(screen.getByText('Event 1'));
        expect(onItemClick).toHaveBeenCalledWith(expect.objectContaining({ id: '1' }));
    });
});
