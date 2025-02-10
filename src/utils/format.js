// Date formatting
export const formatDate = (date) => {
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Number formatting
export const formatNumber = (number, options = {}) => {
  const {
    decimals = 0,
    prefix = '',
    suffix = '',
  } = options;

  return `${prefix}${Number(number).toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}${suffix}`;
};

// Percentage formatting
export const formatPercentage = (value, decimals = 1) => {
  return formatNumber(value * 100, { decimals, suffix: '%' });
};

// File size formatting
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

// Duration formatting
export const formatDuration = (milliseconds) => {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d`;
  if (hours > 0) return `${hours}h`;
  if (minutes > 0) return `${minutes}m`;
  return `${seconds}s`;
};

// Status formatting
export const formatStatus = (status) => {
  const statusMap = {
    active: 'Active',
    inactive: 'Inactive',
    pending: 'Pending',
    error: 'Error',
  };
  return statusMap[status.toLowerCase()] || status;
};

// Severity formatting
export const formatSeverity = (severity) => {
  const severityMap = {
    critical: 'Critical',
    high: 'High',
    medium: 'Medium',
    low: 'Low',
    info: 'Info',
  };
  return severityMap[severity.toLowerCase()] || severity;
};
