/**
 * @fileoverview GlowCard Variant Tests
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { GlowCard } from '../../../Ark.Alliance.React.Component.UI/src/components/Cards/GlowCard/GlowCard';

describe('GlowCard Variants', () => {
    it('should render default variant', () => {
        render(<GlowCard title="Default Card" variant="default">Content</GlowCard>);
        const card = screen.getByText('Default Card').closest('.ark-card');
        expect(card).toHaveClass('ark-card--default');
    });

    it('should render glass variant', () => {
        render(<GlowCard title="Glass Card" variant="glass">Content</GlowCard>);
        const card = screen.getByText('Glass Card').closest('.ark-card');
        expect(card).toHaveClass('ark-card--glass');
    });

    it('should render scanner variant', () => {
        render(<GlowCard title="Scanner Card" variant="scanner">Content</GlowCard>);
        const card = screen.getByText('Scanner Card').closest('.ark-card');
        expect(card).toHaveClass('ark-card--scanner');
    });

    it('should render hologram variant', () => {
        render(<GlowCard title="Hologram Card" variant="hologram">Content</GlowCard>);
        const card = screen.getByText('Hologram Card').closest('.ark-card');
        expect(card).toHaveClass('ark-card--hologram');
    });

    it('should prioritize variant over default', () => {
        // If no variant provided, should be default (from model default)
        render(<GlowCard title="Implicit Default">Content</GlowCard>);
        const card = screen.getByText('Implicit Default').closest('.ark-card');
        expect(card).toHaveClass('ark-card--default');
    });
});
