'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

/**
 * Card metadata captured when a transition is initiated
 */
interface CardMetadata {
  slug: string;
  color: string;
  position?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

/**
 * Logo metadata for AI project transitions
 */
interface LogoMetadata {
  slug: string;
  logoSrc: string;
  color: string;
}

/**
 * Transition state and actions
 */
interface TransitionContextValue {
  // State
  direction: 'forward' | 'back' | null;
  cardMetadata: CardMetadata | null;
  logoMetadata: LogoMetadata | null;
  isTransitioning: boolean;

  // Actions
  startTransition: (metadata: CardMetadata) => void;
  startLogoTransition: (metadata: LogoMetadata) => void;
  startBackTransition: () => void;
  completeTransition: () => void;
  resetTransition: () => void;
}

const TransitionContext = createContext<TransitionContextValue | undefined>(undefined);

/**
 * TransitionProvider
 * Provides global state for page transitions
 */
export function TransitionProvider({ children }: { children: ReactNode }) {
  const [direction, setDirection] = useState<'forward' | 'back' | null>(null);
  const [cardMetadata, setCardMetadata] = useState<CardMetadata | null>(null);
  const [logoMetadata, setLogoMetadata] = useState<LogoMetadata | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  /**
   * Start a forward transition (home → project)
   */
  const startTransition = useCallback((metadata: CardMetadata) => {
    setDirection('forward');
    setCardMetadata(metadata);
    setLogoMetadata(null);
    setIsTransitioning(true);
  }, []);

  /**
   * Start a logo transition (home → AI project)
   */
  const startLogoTransition = useCallback((metadata: LogoMetadata) => {
    setDirection('forward');
    setLogoMetadata(metadata);
    setCardMetadata(null);
    setIsTransitioning(true);
  }, []);

  /**
   * Start a back transition (project → home)
   */
  const startBackTransition = useCallback(() => {
    setDirection('back');
    setIsTransitioning(true);
  }, []);

  /**
   * Mark transition as complete
   */
  const completeTransition = useCallback(() => {
    setIsTransitioning(false);
  }, []);

  /**
   * Reset all transition state
   */
  const resetTransition = useCallback(() => {
    setDirection(null);
    setCardMetadata(null);
    setLogoMetadata(null);
    setIsTransitioning(false);
  }, []);

  const value: TransitionContextValue = {
    direction,
    cardMetadata,
    logoMetadata,
    isTransitioning,
    startTransition,
    startLogoTransition,
    startBackTransition,
    completeTransition,
    resetTransition,
  };

  return (
    <TransitionContext.Provider value={value}>
      {children}
    </TransitionContext.Provider>
  );
}

/**
 * Hook to access transition state and actions
 */
export function useTransition() {
  const context = useContext(TransitionContext);
  if (context === undefined) {
    throw new Error('useTransition must be used within a TransitionProvider');
  }
  return context;
}
