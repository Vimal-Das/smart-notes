import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { EditorPage } from './pages/EditorPage';
import { GraphPage } from './pages/GraphPage';
import { LandingPage } from './pages/LandingPage';
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
            <Route path="/landing" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />

            {/* Authenticated Routes */}
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

            {/* Fallback to Landing if not authenticated and trying to access root */}
            {/* Note: ProtectedRoute handles the redirect to /login usually, 
                but we want / to stay as / and show different content. 
                However, to simplify, we can let Home handle it or redirect explicitly.
                Let's use a simpler approach: / is always Home (protected).
                Unauthenticated users at / will be redirected to /login by ProtectedRoute.
                We can change ProtectedRoute to redirect to /landing instead of /login.
            */}
          </Routes>
        </BrowserRouter>
      </TabProvider>
    </AuthProvider>
  );
}

export default App;

