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
  Grid,
} from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { GlassCard, MetricCard, ChartContainer, DataGrid, StatusBadge } from './styled/StyledComponents';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const CryptoInventory = () => {
  const [cbomData, setCbomData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalComponents: 0,
    vulnerableCount: 0,
    readyCount: 0,
    migrationCount: 0,
  });

  useEffect(() => {
    fetchCBOMData();
  }, []);

  const fetchCBOMData = async () => {
    try {
      const response = await fetch('/api/cbom');
      const data = await response.json();
      setCbomData(data);
      calculateStats(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching CBOM data:', error);
      setLoading(false);
    }
  };

  const calculateStats = (data) => {
    const stats = data.reduce((acc, item) => {
      acc.totalComponents += item.components.length;
      acc.vulnerableCount += item.pqcReadiness.vulnerableCount;
      acc.readyCount += item.pqcReadiness.readyCount;
      acc.migrationCount += item.pqcReadiness.migrationCount;
      return acc;
    }, {
      totalComponents: 0,
      vulnerableCount: 0,
      readyCount: 0,
      migrationCount: 0,
    });
    setStats(stats);
  };

  const getPQCStatusColor = (status) => {
    switch (status) {
      case 'Vulnerable':
        return 'error';
      case 'Migration-Ready':
        return 'warning';
      case 'PQC-Ready':
        return 'success';
      default:
        return 'default';
    }
  };

  const pieChartData = [
    { name: 'Vulnerable', value: stats.vulnerableCount },
    { name: 'Ready', value: stats.readyCount },
    { name: 'Migration', value: stats.migrationCount },
  ];

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
        Cryptographic Inventory (CBOM)
      </Typography>

      <DataGrid>
        <MetricCard elevation={0}>
          <Typography variant="h6" gutterBottom>
            PQC Readiness Overview
          </Typography>
          <Box sx={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieChartData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[index % COLORS.length]} 
                      strokeWidth={1}
                      stroke="#fff"
                    />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    background: 'rgba(255, 255, 255, 0.9)',
                    border: 'none',
                    borderRadius: '8px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </Box>
        </MetricCard>

        <MetricCard elevation={0}>
          <Typography variant="h6" gutterBottom>
            Component Statistics
          </Typography>
          <Box sx={{ display: 'grid', gap: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body1" color="text.secondary">
                Total Components
              </Typography>
              <Typography variant="h6">{stats.totalComponents}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body1" color="text.secondary">
                PQC-Ready
              </Typography>
              <StatusBadge status="success">{stats.readyCount}</StatusBadge>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body1" color="text.secondary">
                In Migration
              </Typography>
              <StatusBadge status="warning">{stats.migrationCount}</StatusBadge>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body1" color="text.secondary">
                Vulnerable
              </Typography>
              <StatusBadge status="error">{stats.vulnerableCount}</StatusBadge>
            </Box>
          </Box>
        </MetricCard>
      </DataGrid>

      <GlassCard sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
          Cryptographic Components
        </Typography>
        <Box sx={{ overflowX: 'auto' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Version</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>PQC Status</TableCell>
                <TableCell>Migration Path</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {cbomData.flatMap(cbom => 
                cbom.components.map((component, index) => (
                  <TableRow 
                    key={`${cbom.id}-${index}`}
                    sx={{
                      '&:hover': {
                        backgroundColor: 'rgba(0,0,0,0.02)',
                        transition: 'background-color 0.2s ease-in-out'
                      }
                    }}
                  >
                    <TableCell>{component.name}</TableCell>
                    <TableCell>{component.version}</TableCell>
                    <TableCell>{component.type}</TableCell>
                    <TableCell>
                      <StatusBadge 
                        status={getPQCStatusColor(component.pqcStatus)}
                      >
                        {component.pqcStatus}
                      </StatusBadge>
                    </TableCell>
                    <TableCell>{component.migrationPath}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Box>
      </GlassCard>
    </Box>
  );
};

export default CryptoInventory;
