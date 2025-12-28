/**
 * @fileoverview Ark.Alliance Component Library Application
 * @module App
 * 
 * Root application component that loads the Showcase Dashboard.
 */

import { ShowcaseApp, componentCategories } from './showcase';

function App() {
  return <ShowcaseApp categories={componentCategories} />;
}

export default App;
