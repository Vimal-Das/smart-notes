import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { EditorPage } from './pages/EditorPage';
import { GraphPage } from './pages/GraphPage';
import { LoginPage } from './pages/LoginPage';
import { TabProvider } from './context/TabContext';
import { AuthProvider, ProtectedRoute } from './context/AuthContext';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
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
                <Route path="/search" element={<div className="p-10">Search View (Coming Soon)</div>} />
                <Route path="/graph" element={<GraphPage />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </TabProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App;

