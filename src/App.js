import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import SecurityCompliance from './pages/SecurityCompliance';
import Documentation from './pages/Documentation';
import Governance from './pages/Governance';
import PQCReadiness from './pages/PQCReadiness';
import Integrations from './pages/Integrations';

import { skeuomorphicTheme } from './theme/skeuomorphicTheme';

function App() {
  return (
    <ThemeProvider theme={skeuomorphicTheme}>
      <CssBaseline />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/security-compliance" element={<SecurityCompliance />} />
            <Route path="/documentation" element={<Documentation />} />
            <Route path="/governance" element={<Governance />} />
            <Route path="/pqc-readiness" element={<PQCReadiness />} />
            <Route path="/integrations" element={<Integrations />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
