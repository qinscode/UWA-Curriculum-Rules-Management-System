import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '../lib/api-client';
import { Settings, UpdateSettingsDTO } from '../types';

export function useSettings() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await apiClient.getSettings();
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

  const updateSettings = useCallback(async (newSettings: UpdateSettingsDTO) => {
    try {
      const updatedSettings = await apiClient.updateSettings(newSettings);
      setSettings(updatedSettings);
      return updatedSettings;
    } catch (err) {
      setError('Failed to update settings');
      throw err;
    }
  }, []);

  return { settings, isLoading, error, fetchSettings, updateSettings };
}