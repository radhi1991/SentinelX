import { useState, useEffect, useCallback } from 'react';
import { apiService } from './api';

// Hook for handling async data fetching with loading and error states
export const useAsyncData = (fetchFn, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const result = await fetchFn();
      setData(result);
      setError(null);
    } catch (err) {
      setError(err);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [fetchFn]);

  useEffect(() => {
    fetchData();
  }, [...dependencies, fetchData]);

  return { data, loading, error, refetch: fetchData };
};

// Hook for handling pagination
export const usePagination = (initialPage = 1, initialPageSize = 10) => {
  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (newPageSize) => {
    setPageSize(newPageSize);
    setPage(1); // Reset to first page when changing page size
  };

  return {
    page,
    pageSize,
    handlePageChange,
    handlePageSizeChange,
  };
};

// Hook for handling sorting
export const useSorting = (initialSortField = '', initialSortDirection = 'asc') => {
  const [sortField, setSortField] = useState(initialSortField);
  const [sortDirection, setSortDirection] = useState(initialSortDirection);

  const handleSort = (field) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  return {
    sortField,
    sortDirection,
    handleSort,
  };
};
