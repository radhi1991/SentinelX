import React, { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  LinearProgress,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';
import { MetricCard, DataGrid, StatusBadge } from '../components/styled/StyledComponents';

const API_BASE_URL = 'http://localhost:8080/api';
const REFRESH_INTERVAL = 30000; // 30 seconds
const MAX_RETRIES = 3;
const RETRY_DELAY = 2000; // 2 seconds

const COLORS = ['#00d4ff', '#7551FF', '#34C759', '#FF9500'];

function DashboardWidget({ title, children }) {
  return (
    <MetricCard
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Typography variant="h6" gutterBottom component="div">
        {title}
      </Typography>
      {children}
    </MetricCard>
  );
}

function Dashboard() {
  const [metrics, setMetrics] = useState(null);
  const [apiCategories, setApiCategories] = useState([]);
  const [securityAlerts, setSecurityAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [timelineData, setTimelineData] = useState([]);
  const [securityMetrics, setSecurityMetrics] = useState([]);
  const [performanceMetrics, setPerformanceMetrics] = useState(null);
  const [healthStatus, setHealthStatus] = useState(null);
  const [detailedAlerts, setDetailedAlerts] = useState(null);

  const fetchWithRetry = async (url, retries = MAX_RETRIES) => {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (err) {
      if (retries > 0) {
        console.log(`Retrying ${url}, ${retries} attempts left`);
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
        return fetchWithRetry(url, retries - 1);
      }
      throw err;
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [
        metricsData,
        categoriesData,
        alertsData,
        timelineData,
        securityMetricsData,
        performanceData,
        healthData,
        detailedAlertsData
      ] = await Promise.all([
        fetchWithRetry(`${API_BASE_URL}/metrics`),
        fetchWithRetry(`${API_BASE_URL}/inventory/categories`),
        fetchWithRetry(`${API_BASE_URL}/security/alerts`),
        fetchWithRetry(`${API_BASE_URL}/activity/timeline`),
        fetchWithRetry(`${API_BASE_URL}/metrics/security`),
        fetchWithRetry(`${API_BASE_URL}/metrics/performance`),
        fetchWithRetry(`${API_BASE_URL}/health/status`),
        fetchWithRetry(`${API_BASE_URL}/security/alerts/details`)
      ]);

      setMetrics(metricsData);
      setApiCategories(categoriesData.categories);
      setSecurityAlerts(alertsData.alerts);
      setTimelineData(timelineData.data || []);
      setSecurityMetrics(securityMetricsData.metrics || []);
      setPerformanceMetrics(performanceData);
      setHealthStatus(healthData);
      setDetailedAlerts(detailedAlertsData);
      setLastUpdated(new Date());
      setRetryCount(0);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(`Failed to load dashboard data: ${err.message}`);
      if (retryCount < MAX_RETRIES) {
        setRetryCount(prev => prev + 1);
        setTimeout(fetchData, RETRY_DELAY);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const intervalId = setInterval(fetchData, REFRESH_INTERVAL);
    
    // Cleanup interval on unmount
    return () => clearInterval(intervalId);
  }, []);
  return (
    <Box sx={{
      p: 3,
      background: 'linear-gradient(127deg, rgba(26, 32, 53, 1) 0%, rgba(28, 35, 58, 0.92) 100%)',
      minHeight: '100vh'
    }}>
      <Box sx={{ mb: 4 }}>
        <Box>
          <Typography variant="h4" gutterBottom sx={{
            color: '#ffffff',
            textShadow: '0 0 20px rgba(0, 212, 255, 0.5)',
          }}>
            API Security Dashboard
          </Typography>
          {lastUpdated && (
            <Typography variant="caption" sx={{ color: 'text.secondary', mt: 1, display: 'block' }}>
              Last updated: {lastUpdated.toLocaleTimeString()}
            </Typography>
          )}
        </Box>
        {loading && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography sx={{ color: 'text.secondary' }}>
              {retryCount > 0 ? `Retrying... (${retryCount}/${MAX_RETRIES})` : 'Loading dashboard data...'}
            </Typography>
            <LinearProgress sx={{ width: 100 }} />
          </Box>
        )}
        {error && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography sx={{ color: 'error.main' }}>
              {error}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              Click <button onClick={fetchData} style={{ background: 'none', border: 'none', color: '#00d4ff', cursor: 'pointer', padding: 0 }}>here</button> to retry
            </Typography>
          </Box>
        )}
      </Box>

      <DataGrid>
        <DashboardWidget title="API Categories">
          <Box sx={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={apiCategories}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  label={false}
                >
                  {apiCategories.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[index % COLORS.length]}
                      strokeWidth={2}
                      stroke="rgba(255,255,255,0.1)"
                      style={{
                        filter: 'drop-shadow(0px 0px 10px rgba(0,0,0,0.3))',
                        cursor: 'pointer'
                      }}
                    />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    background: 'rgba(31, 41, 64, 0.94)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                    color: '#ffffff'
                  }}
                  wrapperStyle={{
                    outline: 'none'
                  }}
                />
                <Legend 
                  wrapperStyle={{
                    color: '#ffffff',
                    fontSize: '0.8rem'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </Box>
        </DashboardWidget>

        <DashboardWidget title="Security Alerts">
          <Box sx={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={securityAlerts}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis 
                  dataKey="severity" 
                  stroke="#ffffff"
                  style={{ fontSize: '0.8rem' }}
                />
                <YAxis 
                  stroke="#ffffff"
                  style={{ fontSize: '0.8rem' }}
                />
                <Tooltip 
                  contentStyle={{
                    background: 'rgba(31, 41, 64, 0.94)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                    color: '#ffffff'
                  }}
                  wrapperStyle={{
                    outline: 'none'
                  }}
                />
                <Bar 
                  dataKey="count" 
                  fill="#00d4ff"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </DashboardWidget>

        <DashboardWidget title="Compliance Score">
          <Box sx={{ display: 'grid', gap: 2 }}>
            <Box>
              <Typography color="textSecondary" gutterBottom>
                Overall Compliance
              </Typography>
              <Box sx={{ position: 'relative', height: '10px', mb: 1 }}>
                <LinearProgress
                  variant="determinate"
                  value={metrics?.compliance_score || 0}
                  sx={{
                    height: '100%',
                    borderRadius: '5px',
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    '& .MuiLinearProgress-bar': {
                      background: 'linear-gradient(90deg, #00d4ff 0%, #7551FF 100%)',
                      borderRadius: '5px',
                    }
                  }}
                />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2" color="textSecondary">
                  Current Status
                </Typography>
                <StatusBadge status="success">{metrics?.compliance_score || 0}% Compliant</StatusBadge>
              </Box>
            </Box>
          </Box>
        </DashboardWidget>

        <DashboardWidget title="PQC Migration Progress">
          <Box sx={{ display: 'grid', gap: 2 }}>
            <Box>
              <Typography color="textSecondary" gutterBottom>
                Migration Status
              </Typography>
              <Box sx={{ position: 'relative', height: '10px', mb: 1 }}>
                <LinearProgress
                  variant="determinate"
                  value={metrics ? Math.round(metrics.secure_apis / metrics.total_apis * 100) : 0}
                  sx={{
                    height: '100%',
                    borderRadius: '5px',
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    '& .MuiLinearProgress-bar': {
                      background: 'linear-gradient(90deg, #7551FF 0%, #00d4ff 100%)',
                      borderRadius: '5px',
                    }
                  }}
                />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2" color="textSecondary">
                  Current Status
                </Typography>
                <StatusBadge status="warning">{metrics ? Math.round(metrics.secure_apis / metrics.total_apis * 100) : 0}% Complete</StatusBadge>
              </Box>
            </Box>
          </Box>
        </DashboardWidget>

        <DashboardWidget title="API Activity Timeline">
          <Box sx={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={timelineData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorRequests" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#00d4ff" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorErrors" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ff4757" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#ff4757" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="date" 
                  stroke="#ffffff"
                  style={{ fontSize: '0.8rem' }}
                />
                <YAxis 
                  stroke="#ffffff"
                  style={{ fontSize: '0.8rem' }}
                />
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <Tooltip
                  contentStyle={{
                    background: 'rgba(31, 41, 64, 0.94)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                    color: '#ffffff'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="requests"
                  stroke="#00d4ff"
                  fillOpacity={1}
                  fill="url(#colorRequests)"
                />
                <Area
                  type="monotone"
                  dataKey="errors"
                  stroke="#ff4757"
                  fillOpacity={1}
                  fill="url(#colorErrors)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </Box>
        </DashboardWidget>

        <DashboardWidget title="Security Metrics">
          <Box sx={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={securityMetrics}>
                <PolarGrid stroke="rgba(255,255,255,0.1)" />
                <PolarAngleAxis 
                  dataKey="subject"
                  tick={{ fill: '#ffffff', fontSize: '0.8rem' }}
                />
                <PolarRadiusAxis 
                  angle={30} 
                  domain={[0, 100]}
                  tick={{ fill: '#ffffff', fontSize: '0.8rem' }}
                />
                <Radar
                  name="Security Score"
                  dataKey="score"
                  stroke="#7551FF"
                  fill="#7551FF"
                  fillOpacity={0.5}
                />
                <Tooltip
                  contentStyle={{
                    background: 'rgba(31, 41, 64, 0.94)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                    color: '#ffffff'
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </Box>
        </DashboardWidget>

        <DashboardWidget title="API Health Status">
          <Box sx={{ height: 300, display: 'flex', flexDirection: 'column', gap: 2 }}>
            {healthStatus && (
              <>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6">
                    Overall Status: 
                    <StatusBadge 
                      status={healthStatus.status === 'healthy' ? 'success' : 'warning'}
                    >
                      {healthStatus.status}
                    </StatusBadge>
                  </Typography>
                </Box>
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2 }}>
                  {Object.entries(healthStatus.services).map(([name, status], index) => (
                    <Box 
                      key={index} 
                      sx={{ 
                        p: 2, 
                        borderRadius: 2, 
                        bgcolor: 'rgba(0,0,0,0.2)',
                        border: '1px solid rgba(255,255,255,0.1)'
                      }}
                    >
                      <Typography variant="subtitle1" gutterBottom>{name}</Typography>
                      <StatusBadge status={status === 'healthy' ? 'success' : 'warning'}>
                        {status}
                      </StatusBadge>
                    </Box>
                  ))}
                </Box>
              </>
            )}
          </Box>
        </DashboardWidget>

        <DashboardWidget title="Performance Metrics">
          <Box sx={{ height: 300 }}>
            {performanceMetrics && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={performanceMetrics.metrics}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis 
                    dataKey="name" 
                    stroke="#ffffff"
                    style={{ fontSize: '0.8rem' }}
                  />
                  <YAxis 
                    stroke="#ffffff"
                    style={{ fontSize: '0.8rem' }}
                  />
                  <Tooltip
                    contentStyle={{
                      background: 'rgba(31, 41, 64, 0.94)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '12px',
                      boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                      color: '#ffffff'
                    }}
                    formatter={(value, name, props) => [
                      `${value}${props.payload.unit}`,
                      props.payload.name
                    ]}
                  />
                  <Bar 
                    dataKey="value" 
                    fill="#7551FF"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </Box>
        </DashboardWidget>

        <DashboardWidget title="Alert Distribution">
          <Box sx={{ height: 300 }}>
            {detailedAlerts && (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={Object.entries(detailedAlerts.by_severity).map(([key, value]) => ({
                      name: key,
                      value: value
                    }))}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {Object.entries(detailedAlerts.by_severity).map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={COLORS[index % COLORS.length]}
                        strokeWidth={2}
                        stroke="rgba(255,255,255,0.1)"
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: 'rgba(31, 41, 64, 0.94)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '12px',
                      boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                      color: '#ffffff'
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </Box>
        </DashboardWidget>
      </DataGrid>
    </Box>
  );
}

export default Dashboard;
