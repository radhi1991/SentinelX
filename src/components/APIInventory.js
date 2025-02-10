import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  CircularProgress,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  useTheme,
} from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { GlassCard, MetricCard, ChartContainer, DataGrid, StatusBadge } from './styled/StyledComponents';
import CloseIcon from '@mui/icons-material/Close';
import VisibilityIcon from '@mui/icons-material/Visibility';

const API_BASE_URL = 'http://localhost:8080/api';

const APIInventory = () => {
  const [apis, setApis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApi, setSelectedApi] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [securityMetrics, setSecurityMetrics] = useState(null);
  const theme = useTheme();

  useEffect(() => {
    fetchAPIData();
    fetchSecurityMetrics();
  }, []);

  const fetchAPIData = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/inventory`);
      const data = await response.json();
      setApis(data.apis || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching API data:', error);
      setLoading(false);
    }
  };

  const fetchSecurityMetrics = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/metrics/security`);
      const data = await response.json();
      setSecurityMetrics(data);
    } catch (error) {
      console.error('Error fetching security metrics:', error);
    }
  };

  const handleViewDetails = (api) => {
    setSelectedApi(api);
    setDialogOpen(true);
  };

  const getSecurityScoreColor = (score) => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'warning';
    return 'error';
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Box sx={{
      p: 3,
      background: 'linear-gradient(135deg, #f5f5f7 0%, #e4e4e7 100%)',
      minHeight: '100vh'
    }}>
      <Typography variant="h4" gutterBottom sx={{
        color: '#1c1c1e',
        textShadow: '1px 1px 1px rgba(255,255,255,0.5)',
        mb: 4
      }}>
        API Inventory
      </Typography>

      {securityMetrics && (
        <DataGrid>
          <MetricCard elevation={0} sx={{ gridColumn: 'span 2' }}>
            <Typography variant="h6" gutterBottom>
              Vulnerability Trends
            </Typography>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={securityMetrics.vulnerabilityTrends}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
                  <XAxis 
                    dataKey="timestamp" 
                    stroke="#666" 
                    style={{ fontSize: '0.8rem' }}
                  />
                  <YAxis stroke="#666" style={{ fontSize: '0.8rem' }} />
                  <Tooltip 
                    contentStyle={{
                      background: 'rgba(255, 255, 255, 0.9)',
                      border: 'none',
                      borderRadius: '8px',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="critical" 
                    stroke="#FF3B30" 
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="high" 
                    stroke="#FF9500" 
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="medium" 
                    stroke="#FFCC00" 
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="low" 
                    stroke="#34C759" 
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </MetricCard>

          <MetricCard elevation={0}>
            <Typography variant="h6" gutterBottom>
              Overview
            </Typography>
            <Box sx={{ display: 'grid', gap: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body1" color="text.secondary">
                  Total APIs
                </Typography>
                <Typography variant="h6">{securityMetrics.totalAPIs}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body1" color="text.secondary">
                  Security Score
                </Typography>
                <StatusBadge 
                  status={getSecurityScoreColor(securityMetrics.securityScore)}
                >
                  {(securityMetrics.securityScore || 0).toFixed(1)}%
                </StatusBadge>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body1" color="text.secondary">
                  PQC Ready
                </Typography>
                <StatusBadge 
                  status={((securityMetrics.pqcReadinessOverview && securityMetrics.pqcReadinessOverview.readyPercentage) || 0) > 80 ? 'success' : 'warning'}
                >
                  {((securityMetrics.pqcReadinessOverview && securityMetrics.pqcReadinessOverview.readyPercentage) || 0).toFixed(1)}%
                </StatusBadge>
              </Box>
            </Box>
          </MetricCard>
        </DataGrid>
      )}

      <GlassCard sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
          API List
        </Typography>
        <Box sx={{ overflowX: 'auto' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Version</TableCell>
                <TableCell>Security Score</TableCell>
                <TableCell>PQC Status</TableCell>
                <TableCell>Compliance Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {apis.map((api) => (
                <TableRow key={api.id}>
                  <TableCell>{api.name}</TableCell>
                  <TableCell>{api.version}</TableCell>
                  <TableCell>
                    <StatusBadge status={getSecurityScoreColor(api.securityScore)}>
                      {api.securityScore}%
                    </StatusBadge>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={api.pqcReady ? 'success' : 'warning'}>
                      {api.pqcReady ? 'Ready' : 'Not Ready'}
                    </StatusBadge>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={api.compliant ? 'success' : 'error'}>
                      {api.compliant ? 'Compliant' : 'Non-Compliant'}
                    </StatusBadge>
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleViewDetails(api)}>
                      <VisibilityIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </GlassCard>

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        {selectedApi && (
          <>
            <DialogTitle sx={{ m: 0, p: 2 }}>
              {selectedApi.name}
              <IconButton
                aria-label="close"
                onClick={() => setDialogOpen(false)}
                sx={{
                  position: 'absolute',
                  right: 8,
                  top: 8,
                  color: (theme) => theme.palette.grey[500],
                }}
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent dividers>
              <Box sx={{ display: 'grid', gap: 2 }}>
                <Typography variant="subtitle1">
                  Version: {selectedApi.version}
                </Typography>
                <Typography variant="subtitle1">
                  Security Score: 
                  <StatusBadge status={getSecurityScoreColor(selectedApi.securityScore)}>
                    {selectedApi.securityScore}%
                  </StatusBadge>
                </Typography>
                <Typography variant="subtitle1">
                  PQC Status: 
                  <StatusBadge status={selectedApi.pqcReady ? 'success' : 'warning'}>
                    {selectedApi.pqcReady ? 'Ready' : 'Not Ready'}
                  </StatusBadge>
                </Typography>
                <Typography variant="subtitle1">
                  Compliance Status: 
                  <StatusBadge status={selectedApi.compliant ? 'success' : 'error'}>
                    {selectedApi.compliant ? 'Compliant' : 'Non-Compliant'}
                  </StatusBadge>
                </Typography>
                <Typography variant="subtitle1">
                  Last Scanned: {new Date(selectedApi.lastScanned).toLocaleString()}
                </Typography>
                <Typography variant="subtitle1">
                  Endpoints: {selectedApi.endpoints}
                </Typography>
                <Typography variant="subtitle1">
                  Vulnerabilities: {selectedApi.vulnerabilities}
                </Typography>
              </Box>
            </DialogContent>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default APIInventory;
