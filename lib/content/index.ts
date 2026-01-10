/**
 * Content management system for multi-version site
 * Returns appropriate content based on site type (startup vs enterprise)
 */

import { siteConfig } from '@/lib/siteConfig';
import { startupContent } from './startup';
import { enterpriseContent } from './enterprise';

export const getContent = () => {
  return siteConfig.type === 'enterprise' 
    ? enterpriseContent 
    : startupContent;
};

// Export individual content objects for direct access if needed
export { startupContent, enterpriseContent };
