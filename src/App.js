import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Layout from './Layout';
import Dashboard from './pages/Dashboard';
import FastFlags from './pages/FastFlags';
import PS99Data from './pages/PS99Data';
import ScriptHub from './pages/ScriptHub';
import MultiInstanceLauncher from './pages/MultiInstanceLauncher';
import Macros from './pages/Macros';
import MyConfigs from './pages/MyConfigs';
import DownloadApp from './pages/DownloadApp';
import GitHubExport from './pages/GitHubExport';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Navigate to="/Dashboard" replace />} />
            <Route path="/Dashboard" element={<Dashboard />} />
            <Route path="/FastFlags" element={<FastFlags />} />
            <Route path="/PS99Data" element={<PS99Data />} />
            <Route path="/ScriptHub" element={<ScriptHub />} />
            <Route path="/MultiInstanceLauncher" element={<MultiInstanceLauncher />} />
            <Route path="/Macros" element={<Macros />} />
            <Route path="/MyConfigs" element={<MyConfigs />} />
            <Route path="/DownloadApp" element={<DownloadApp />} />
            <Route path="/GitHubExport" element={<GitHubExport />} />
          </Routes>
        </Layout>
      </Router>
    </QueryClientProvider>
  );
}