import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { EditorPage } from './pages/EditorPage';
import { GraphPage } from './pages/GraphPage';
import { TabProvider } from './context/TabContext';

function App() {
  return (
    <TabProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/note/:id" element={<EditorPage />} />
            <Route path="/search" element={<div className="p-10">Search View (Coming Soon)</div>} />
            <Route path="/graph" element={<GraphPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TabProvider>
  );
}

export default App;
