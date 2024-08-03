import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '../lib/api-client';
import { Rule, CreateRuleDTO, UpdateRuleDTO } from '../types';

export function useRules() {
  const [rules, setRules] = useState<Rule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRules = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await apiClient.getRules();
      setRules(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch rules');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRules();
  }, [fetchRules]);

  const addRule = useCallback(async (rule: CreateRuleDTO) => {
    try {
      const newRule = await apiClient.addRule(rule);
      setRules(prevRules => [...prevRules, newRule]);
      return newRule;
    } catch (err) {
      setError('Failed to add rule');
      throw err;
    }
  }, []);

  const updateRule = useCallback(async (id: number, rule: UpdateRuleDTO) => {
    try {
      const updatedRule = await apiClient.updateRule(id, rule);
      setRules(prevRules => prevRules.map(r => r.id === id ? updatedRule : r));
      return updatedRule;
    } catch (err) {
      setError('Failed to update rule');
      throw err;
    }
  }, []);

  const deleteRule = useCallback(async (id: number) => {
    try {
      await apiClient.deleteRule(id);
      setRules(prevRules => prevRules.filter(rule => rule.id !== id));
    } catch (err) {
      setError('Failed to delete rule');
      throw err;
    }
  }, []);

  return { rules, isLoading, error, fetchRules, addRule, updateRule, deleteRule };
}