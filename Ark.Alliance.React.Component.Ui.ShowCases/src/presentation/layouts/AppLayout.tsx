import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '@/presentation/components/Layout/Sidebar';
import { Header } from '@/presentation/components/Layout/Header';
import { ConfigLoader } from '@/infrastructure/ConfigLoader';
import logoBg from '@/assets/LogoArkAlliance.png';
import clsx from 'clsx';

export const AppLayout: React.FC = () => {
    const catalogue = ConfigLoader.getCatalogue();
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    return (
        <div className="min-h-screen bg-ark-bg-primary text-ark-text-primary font-ark-sans relative isolation-auto text-sm transition-colors duration-500">
            {/* Background Filigree - Cybernetic Watermark */}
            <div
                className="fixed inset-0 z-[-1] pointer-events-none opacity-[0.03] dark:opacity-[0.06] bg-no-repeat bg-center bg-contain transition-opacity duration-500 blur-[2px]"
                style={{ backgroundImage: `url(${logoBg})`, backgroundPosition: 'center 40%' }}
            />

            <Header />

            <Sidebar
                families={catalogue.categories}
                collapsed={sidebarCollapsed}
                onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
            />

            <main
                className={clsx(
                    "pt-20 pb-8 min-h-screen transition-all duration-300 ease-out",
                    sidebarCollapsed ? 'pl-20 pr-4' : 'pl-64 pr-6'
                )}
            >
                <div className="max-w-[1920px] mx-auto animate-ark-fade-in relative z-10">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};
