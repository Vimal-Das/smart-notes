import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { EditorPage } from './pages/EditorPage';
import { GraphPage } from './pages/GraphPage';
import { LoginPage } from './pages/LoginPage';
import { SearchPage } from './pages/SearchPage';
import { TabProvider } from './context/TabContext';
import { AuthProvider, ProtectedRoute } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <TabProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }>
              <Route path="/" element={<Home />} />
              <Route path="/note/:id" element={<EditorPage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/graph" element={<GraphPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </TabProvider>
    </AuthProvider>
  );
}

export default App;

