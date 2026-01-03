/**
 * @fileoverview Main App Component
 * @module App
 */

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppLayout } from '@/presentation/layouts/AppLayout';
import { HomePage } from '@/presentation/pages/HomePage';
import { CataloguePage } from '@/presentation/pages/CataloguePage';

import { ThemeProvider } from '@/presentation/context/ThemeContext';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<HomePage />} />
            <Route path="catalogue/:familyName" element={<CataloguePage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
