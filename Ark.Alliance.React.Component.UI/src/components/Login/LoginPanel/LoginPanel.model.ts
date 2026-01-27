/**
 * @fileoverview LoginPanel Component Model
 * @module components/Login/LoginPanel
 * 
 * Generic authentication panel model supporting multiple auth providers.
 * Follows backend auth infrastructure from Ark.Alliance.TypeScript.Core.
 * 
 * @author Armand Richelet-Kleinberg with the assistance of Anthropic Claude Opus 4.5
 */

import { z } from 'zod';
import { extendSchema } from '../../../core/base';

// ═══════════════════════════════════════════════════════════════════════════
// AUTH PROVIDER ENUM (Backend Compatible)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Authentication provider types matching backend AuthProviderType enum
 * from Ark.Alliance.TypeScript.Core/src/core/auth/enums/AuthProviderType.enum.ts
 */
export enum AuthProviderType {
    /** Local email/password authentication */
    LOCAL = 'local',

    /** Microsoft Azure Active Directory */
    AZURE_AD = 'azure_ad',

    /** Active Directory via LDAP */
    LDAP = 'ldap',

    /** OpenID Connect */
    OIDC = 'oidc',

    /** OAuth 2.0 */
    OAUTH2 = 'oauth2',

    /** API Key authentication */
    API_KEY = 'api_key',
}

export const AuthProviderTypeSchema = z.nativeEnum(AuthProviderType);

/**
 * Display names for auth providers
 */
export const AUTH_PROVIDER_LABELS: Record<AuthProviderType, string> = {
    [AuthProviderType.LOCAL]: 'Email & Password',
    [AuthProviderType.AZURE_AD]: 'Microsoft Azure AD',
    [AuthProviderType.LDAP]: 'Active Directory (LDAP)',
    [AuthProviderType.OIDC]: 'OpenID Connect',
    [AuthProviderType.OAUTH2]: 'OAuth 2.0',
    [AuthProviderType.API_KEY]: 'API Key',
};

// ═══════════════════════════════════════════════════════════════════════════
// CREDENTIAL SCHEMAS (Backend Compatible)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Local (email/password) credentials
 * Matches ILocalCredentials from backend
 */
export const LocalCredentialsSchema = z.object({
    providerType: z.literal(AuthProviderType.LOCAL),
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
    rememberMe: z.boolean().optional(),
});

/**
 * OAuth/OIDC credentials
 * Matches IOAuthCredentials from backend
 */
export const OAuthCredentialsSchema = z.object({
    providerType: z.union([
        z.literal(AuthProviderType.AZURE_AD),
        z.literal(AuthProviderType.OIDC),
        z.literal(AuthProviderType.OAUTH2),
    ]),
    code: z.string(),
    redirectUri: z.string().url(),
    codeVerifier: z.string().optional(),
});

/**
 * LDAP credentials
 * Matches ILdapCredentials from backend
 */
export const LdapCredentialsSchema = z.object({
    providerType: z.literal(AuthProviderType.LDAP),
    username: z.string().min(1, 'Username is required'),
    password: z.string().min(1, 'Password is required'),
    domain: z.string().optional(),
});

/**
 * API Key credentials
 * Matches IApiKeyCredentials from backend
 */
export const ApiKeyCredentialsSchema = z.object({
    providerType: z.literal(AuthProviderType.API_KEY),
    apiKey: z.string().min(1, 'API key is required'),
});

/**
 * Union of all credential types
 */
export const CredentialsSchema = z.discriminatedUnion('providerType', [
    LocalCredentialsSchema,
    OAuthCredentialsSchema,
    LdapCredentialsSchema,
    ApiKeyCredentialsSchema,
]);

export type LocalCredentials = z.infer<typeof LocalCredentialsSchema>;
export type OAuthCredentials = z.infer<typeof OAuthCredentialsSchema>;
export type LdapCredentials = z.infer<typeof LdapCredentialsSchema>;
export type ApiKeyCredentials = z.infer<typeof ApiKeyCredentialsSchema>;
export type Credentials = z.infer<typeof CredentialsSchema>;

// ═══════════════════════════════════════════════════════════════════════════
// LOGIN PANEL MODEL
// ═══════════════════════════════════════════════════════════════════════════

/**
 * LoginPanel configuration schema
 */
export const LoginPanelModelSchema = extendSchema({
    /** Enabled authentication providers */
    enabledProviders: z.array(AuthProviderTypeSchema).default([AuthProviderType.LOCAL]),

    /** Default provider to show */
    defaultProvider: AuthProviderTypeSchema.default(AuthProviderType.LOCAL),

    /** Show password recovery link */
    showPasswordRecovery: z.boolean().default(true),

    /** Show registration link */
    showRegistration: z.boolean().default(true),

    /** Show "Remember Me" checkbox */
    showRememberMe: z.boolean().default(true),

    /** Application/service name to display */
    appName: z.string().optional(),

    /** Logo URL */
    logoUrl: z.string().url().optional(),

    /** Terms of Service URL */
    termsUrl: z.string().url().optional(),

    /** Privacy Policy URL */
    privacyUrl: z.string().url().optional(),

    /** OAuth redirect URI */
    oauthRedirectUri: z.string().url().optional(),

    /** LDAP default domain */
    ldapDefaultDomain: z.string().optional(),

    /** Loading state */
    isLoading: z.boolean().default(false),

    /** Error message */
    error: z.string().optional(),

    /** Success message */
    successMessage: z.string().optional(),
});

export type LoginPanelModel = z.infer<typeof LoginPanelModelSchema>;

// ═══════════════════════════════════════════════════════════════════════════
// FACTORY
// ═══════════════════════════════════════════════════════════════════════════

export function createLoginPanelModel(data: Partial<LoginPanelModel>): LoginPanelModel {
    return LoginPanelModelSchema.parse(data);
}

// ═══════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * External provider configurations
 * Can be extended with additional OAuth/OIDC providers
 */
export const EXTERNAL_AUTH_CONFIGS = {
    [AuthProviderType.AZURE_AD]: {
        authEndpoint: 'https://login.microsoftonline.com/{tenant}/oauth2/v2.0/authorize',
        scopes: ['openid', 'profile', 'email'],
        icon: 'microsoft',
    },
    [AuthProviderType.OIDC]: {
        scopes: ['openid', 'profile', 'email'],
        icon: 'shield-check',
    },
    [AuthProviderType.OAUTH2]: {
        scopes: ['read', 'write'],
        icon: 'key',
    },
} as const;
