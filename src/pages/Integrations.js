import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Switch,
  TextField,
  Button,
  Divider,
  Alert,
} from '@mui/material';
import {
  Security as OktaIcon,
  Cloud as AzureIcon,
  Google as GoogleIcon,
  Code as CicdIcon,
  Message as SlackIcon,
  Assignment as JiraIcon,
  Api as GatewayIcon,
} from '@mui/icons-material';
import { MetricCard } from '../components/styled/StyledComponents';

const integrationConfigs = [
  {
    id: 'sso',
    title: 'Single Sign-On (SSO)',
    description: 'Configure SSO providers for seamless authentication',
    providers: [
      {
        name: 'Okta',
        icon: OktaIcon,
        fields: ['Domain', 'Client ID', 'Client Secret'],
      },
      {
        name: 'Azure AD',
        icon: AzureIcon,
        fields: ['Tenant ID', 'Client ID', 'Client Secret'],
      },
      {
        name: 'Google Workspace',
        icon: GoogleIcon,
        fields: ['Client ID', 'Client Secret', 'Authorized Domain'],
      },
    ],
  },
  {
    id: 'cicd',
    title: 'CI/CD Pipeline',
    description: 'Integrate with your deployment pipeline',
    providers: [
      {
        name: 'Jenkins',
        fields: ['Server URL', 'API Token', 'Job Name'],
      },
      {
        name: 'GitHub Actions',
        fields: ['Repository', 'Workflow Name', 'Secret Token'],
      },
      {
        name: 'GitLab CI',
        fields: ['GitLab URL', 'Project ID', 'Access Token'],
      },
    ],
  },
  {
    id: 'notifications',
    title: 'Notifications',
    description: 'Configure notification channels',
    providers: [
      {
        name: 'Slack',
        icon: SlackIcon,
        fields: ['Workspace', 'Channel', 'Bot Token'],
      },
      {
        name: 'Microsoft Teams',
        fields: ['Team ID', 'Channel ID', 'Webhook URL'],
      },
    ],
  },
  {
    id: 'ticketing',
    title: 'Ticketing Systems',
    description: 'Integrate with issue tracking systems',
    providers: [
      {
        name: 'Jira',
        icon: JiraIcon,
        fields: ['Site URL', 'Project Key', 'API Token'],
      },
      {
        name: 'ServiceNow',
        fields: ['Instance URL', 'Username', 'Password'],
      },
    ],
  },
  {
    id: 'gateways',
    title: 'API Gateways',
    description: 'Connect with API management platforms',
    providers: [
      {
        name: 'Kong',
        icon: GatewayIcon,
        fields: ['Admin URL', 'API Key'],
      },
      {
        name: 'Apigee',
        icon: GatewayIcon,
        fields: ['Organization', 'Environment', 'Access Token'],
      },
    ],
  },
];

function IntegrationCard({ config }) {
  const [expanded, setExpanded] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [formData, setFormData] = useState({});
  const [status, setStatus] = useState(null);

  const handleToggle = () => {
    setEnabled(!enabled);
    if (!enabled) {
      setExpanded(true);
    }
  };

  const handleProviderSelect = (provider) => {
    setSelectedProvider(provider);
    setFormData({});
  };

  const handleSave = () => {
    // Here we would make an API call to save the integration
    setStatus({ type: 'success', message: 'Integration configured successfully!' });
    setTimeout(() => setStatus(null), 3000);
  };

  return (
    <MetricCard sx={{ height: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">{config.title}</Typography>
        <Switch
          checked={enabled}
          onChange={handleToggle}
          inputProps={{ 'aria-label': 'toggle integration' }}
        />
      </Box>
      
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {config.description}
      </Typography>

      {enabled && expanded && (
        <>
          <Divider sx={{ my: 2 }} />
          
          <Grid container spacing={2}>
            {config.providers.map((provider) => (
              <Grid item xs={12} sm={6} md={4} key={provider.name}>
                <Button
                  variant={selectedProvider?.name === provider.name ? "contained" : "outlined"}
                  fullWidth
                  onClick={() => handleProviderSelect(provider)}
                  startIcon={provider.icon && <provider.icon />}
                  sx={{ mb: 2 }}
                >
                  {provider.name}
                </Button>
              </Grid>
            ))}
          </Grid>

          {selectedProvider && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1" sx={{ mb: 2 }}>
                Configure {selectedProvider.name}
              </Typography>
              
              <Grid container spacing={2}>
                {selectedProvider.fields.map((field) => (
                  <Grid item xs={12} key={field}>
                    <TextField
                      fullWidth
                      label={field}
                      variant="outlined"
                      type={field.toLowerCase().includes('secret') || field.toLowerCase().includes('password') ? 'password' : 'text'}
                      value={formData[field] || ''}
                      onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                    />
                  </Grid>
                ))}
              </Grid>

              <Button
                variant="contained"
                color="primary"
                sx={{ mt: 2 }}
                onClick={handleSave}
              >
                Save Configuration
              </Button>
            </Box>
          )}
        </>
      )}

      {status && (
        <Alert severity={status.type} sx={{ mt: 2 }}>
          {status.message}
        </Alert>
      )}
    </MetricCard>
  );
}

function Integrations() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{
        color: '#ffffff',
        textShadow: '0 0 20px rgba(0, 212, 255, 0.5)',
        mb: 4
      }}>
        Enterprise Integrations
      </Typography>

      <Grid container spacing={3}>
        {integrationConfigs.map((config) => (
          <Grid item xs={12} key={config.id}>
            <IntegrationCard config={config} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default Integrations;
