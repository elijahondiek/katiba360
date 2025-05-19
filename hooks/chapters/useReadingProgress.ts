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

// Export the main hook and types from the reading directory
export { useReadingProgress } from './reading/useReadingProgress';
export type { ReadingProgress } from './reading/useLocalStorage';

// Export sub-hooks for advanced usage
export { 
  useReadingLocalStorage,
  useReadingSession,
  useReadingSync
} from './reading';
