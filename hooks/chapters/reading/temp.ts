/**
 * Reading Progress Tracking System
 * 
 * This file re-exports the modular reading progress system.
 * The system is split into several specialized hooks for better maintainability:
 * 
 * - useLocalStorage: Handles localStorage operations
 * - useReadingSession: Manages active reading sessions
 * - useReadingSync: Handles API synchronization
 * - useReadingProgress: Main hook that combines all modules
 */

export { useReadingProgress } from './useReadingProgress';

// Also export types and sub-hooks for advanced usage
export type { ReadingProgress } from './useLocalStorage';
export { 
  useReadingLocalStorage,
  useReadingSession,
  useReadingSync
} from './index';
