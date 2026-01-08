/**
 * @fileoverview Test Constants
 * @module tests/constants
 * @description Centralized constants for testing to avoid hardcoded values.
 */

/**
 * Test URLs for schema generation
 */
export const TEST_URLS = {
    BASE: 'https://example.com',
    HOME: 'https://example.com/',
    PROJECTS: 'https://example.com/projects',
    PROJECT_DETAIL: 'https://example.com/projects/ark-portfolio',
    TEAM: 'https://example.com/team',
    MEMBER: 'https://example.com/team/armand',
} as const;

/**
 * Test organization data
 */
export const TEST_ORG = {
    NAME: 'Ark Alliance',
    URL: TEST_URLS.BASE,
    LOGO: `${TEST_URLS.BASE}/logo.png`,
    EMAIL: 'contact@example.com',
    PHONE: '+1234567890',
} as const;

/**
 * Test person data
 */
export const TEST_PERSON = {
    NAME: 'Armand Richelet-Kleinberg',
    JOB_TITLE: 'Software Architect',
    EMAIL: 'armand@example.com',
    AVATAR: `${TEST_URLS.BASE}/avatar.jpg`,
} as const;

/**
 * Test social media links
 */
export const TEST_SOCIAL = {
    TWITTER: 'https://twitter.com/ark',
    GITHUB: 'https://github.com/ark',
    LINKEDIN: 'https://linkedin.com/company/ark',
} as const;
