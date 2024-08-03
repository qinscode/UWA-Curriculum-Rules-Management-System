import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '../lib/api-client';
import { Settings } from '../types/settings';


export function useSettings() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await apiClient.get<Settings>('/settings');
      setSettings(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch settings');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const updateSettings = useCallback(async (newSettings: Settings) => {
    try {
      const updatedSettings = await apiClient.put<Settings>('/settings', newSettings);
      setSettings(updatedSettings);
      return updatedSettings;
    } catch (err) {
      setError('Failed to update settings');
      throw err;
    }
  }, []);

  return { settings, isLoading, error, fetchSettings, updateSettings };
}