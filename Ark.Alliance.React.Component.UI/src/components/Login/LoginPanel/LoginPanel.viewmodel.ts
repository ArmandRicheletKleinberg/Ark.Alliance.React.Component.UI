/**
 * @fileoverview LoginPanel ViewModel
 * @module components/Login/LoginPanel
 * 
 * Viewmodel for generic authentication panel.
 * 
 * @author Armand Richelet-Kleinberg with the assistance of Anthropic Claude Opus 4.5
 */

import { useCallback, useMemo, useState } from 'react';
import { useBaseViewModel, type BaseViewModelResult } from '../../../core/base';
import type { LoginPanelModel, Credentials, AuthProviderType, LocalCredentials } from './LoginPanel.model';
import { createLoginPanelModel } from './LoginPanel.model';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface UseLoginPanelOptions extends Partial<LoginPanelModel> {
    /** Callback when user submits login */
    onLogin?: (credentials: Credentials) => Promise<void> | void;

    /** Callback when user clicks registration link */
    onRegister?: () => void;

    /** Callback when user clicks password recovery */
    onPasswordRecovery?: () => void;

    /** OAuth provider URLs */
    oauthProviders?: Record<AuthProviderType, string>;
}

export interface UseLoginPanelResult extends BaseViewModelResult<LoginPanelModel> {
    // State
    activeProvider: AuthProviderType;
    email: string;
    password: string;
    username: string;
    domain: string;
    apiKey: string;
    rememberMe: boolean;
    isSubmitting: boolean;
    error: string | null;
    isPasswordRecovery: boolean;
    recoveryEmail: string;

    // Actions
    setActiveProvider: (provider: AuthProviderType) => void;
    setEmail: (value: string) => void;
    setPassword: (value: string) => void;
    setUsername: (value: string) => void;
    setDomain: (value: string) => void;
    setApiKey: (value: string) => void;
    setRememberMe: (value: boolean) => void;
    setRecoveryEmail: (value: string) => void;
    togglePasswordRecovery: () => void;
    handleSubmit: (e: React.FormEvent) => Promise<void>;
    handlePasswordRecoverySubmit: (e: React.FormEvent) => Promise<void>;
    handleOAuthLogin: (provider: AuthProviderType) => void;
    clearError: () => void;

    // Computed
    canSubmit: boolean;
    canSubmitRecovery: boolean;
    isLocalAuth: boolean;
    isLdapAuth: boolean;
    isApiKeyAuth: boolean;
    isExternalAuth: boolean;
}

// ═══════════════════════════════════════════════════════════════════════════
// HOOK
// ═══════════════════════════════════════════════════════════════════════════

export function useLoginPanel(options: UseLoginPanelOptions): UseLoginPanelResult {
    const { onLogin, onRegister, onPasswordRecovery, oauthProviders, ...modelData } = options;

    // Create model
    const modelOptions = useMemo(() => {
        return createLoginPanelModel(modelData);
    }, [modelData]);

    const base = useBaseViewModel<LoginPanelModel>(modelOptions, {
        model: modelOptions,
        eventChannel: 'loginPanel',
    });

    // State
    const [activeProvider, setActiveProvider] = useState(base.model.defaultProvider);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [domain, setDomain] = useState(base.model.ldapDefaultDomain || '');
    const [apiKey, setApiKey] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isPasswordRecovery, setIsPasswordRecovery] = useState(false);
    const [recoveryEmail, setRecoveryEmail] = useState('');

    // ───────────────────────────────────────────────────────────────────────
    // Computed Values
    // ───────────────────────────────────────────────────────────────────────

    const isLocalAuth = useMemo(() => {
        return activeProvider === 'local';
    }, [activeProvider]);

    const isLdapAuth = useMemo(() => {
        return activeProvider === 'ldap';
    }, [activeProvider]);

    const isApiKeyAuth = useMemo(() => {
        return activeProvider === 'api_key';
    }, [activeProvider]);

    const isExternalAuth = useMemo(() => {
        return ['azure_ad', 'oidc', 'oauth2'].includes(activeProvider);
    }, [activeProvider]);

    const canSubmit = useMemo(() => {
        if (isSubmitting) return false;

        switch (activeProvider) {
            case 'local':
                return email.trim() !== '' && password.trim() !== '';
            case 'ldap':
                return username.trim() !== '' && password.trim() !== '';
            case 'api_key':
                return apiKey.trim() !== '';
            default:
                return false;
        }
    }, [isSubmitting, activeProvider, email, password, username, apiKey]);

    const canSubmitRecovery = useMemo(() => {
        return !isSubmitting && recoveryEmail.trim() !== '' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recoveryEmail);
    }, [isSubmitting, recoveryEmail]);

    // ───────────────────────────────────────────────────────────────────────
    // Event Handlers
    // ───────────────────────────────────────────────────────────────────────

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    const togglePasswordRecovery = useCallback(() => {
        setIsPasswordRecovery((prev) => !prev);
        setError(null);
        // Clear recovery email when switching back to login
        if (isPasswordRecovery) {
            setRecoveryEmail('');
        }
    }, [isPasswordRecovery]);

    const handlePasswordRecoverySubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();

        if (!canSubmitRecovery || !options.onPasswordRecovery) return;

        setIsSubmitting(true);
        setError(null);

        try {
            // Option 1: If onPasswordRecovery accepts email parameter
            if (options.onPasswordRecovery.length > 0) {
                await Promise.resolve(options.onPasswordRecovery(recoveryEmail as never));
            } else {
                // Option 2: If onPasswordRecovery is just navigation
                options.onPasswordRecovery();
            }

            base.emit('password-recovery:initiated', { email: recoveryEmail });

            // Optionally reset form after successful submission
            setRecoveryEmail('');
            setIsPasswordRecovery(false);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Password recovery failed';
            setError(message);
            base.emit('password-recovery:error', { error: message });
        } finally {
            setIsSubmitting(false);
        }
    }, [canSubmitRecovery, options, recoveryEmail, base]);

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();

        if (!canSubmit || !onLogin) return;

        setIsSubmitting(true);
        setError(null);

        try {
            let credentials: Credentials;

            switch (activeProvider) {
                case 'local':
                    credentials = {
                        providerType: 'local',
                        email,
                        password,
                        rememberMe,
                    } as LocalCredentials;
                    break;

                case 'ldap':
                    credentials = {
                        providerType: 'ldap',
                        username,
                        password,
                        domain: domain || undefined,
                    };
                    break;

                case 'api_key':
                    credentials = {
                        providerType: 'api_key',
                        apiKey,
                    };
                    break;

                default:
                    throw new Error(`Unsupported provider: ${activeProvider}`);
            }

            await onLogin(credentials);
            base.emit('login:success', { provider: activeProvider });
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Login failed';
            setError(message);
            base.emit('login:error', { error: message });
        } finally {
            setIsSubmitting(false);
        }
    }, [canSubmit, onLogin, activeProvider, email, password, username, domain, apiKey, rememberMe, base]);

    const handleOAuthLogin = useCallback((provider: AuthProviderType) => {
        if (!['azure_ad', 'oidc', 'oauth2'].includes(provider)) return;

        const providerUrl = oauthProviders?.[provider];
        if (providerUrl) {
            window.location.href = providerUrl;
        }

        base.emit('oauth:redirect', { provider });
    }, [oauthProviders, base]);

    // ───────────────────────────────────────────────────────────────────────
    // Return
    // ───────────────────────────────────────────────────────────────────────

    return {
        ...base,
        activeProvider,
        email,
        password,
        username,
        domain,
        apiKey,
        rememberMe,
        isSubmitting,
        error,
        isPasswordRecovery,
        recoveryEmail,
        setActiveProvider,
        setEmail,
        setPassword,
        setUsername,
        setDomain,
        setApiKey,
        setRememberMe,
        setRecoveryEmail,
        togglePasswordRecovery,
        handleSubmit,
        handlePasswordRecoverySubmit,
        handleOAuthLogin,
        clearError,
        canSubmit,
        canSubmitRecovery,
        isLocalAuth,
        isLdapAuth,
        isApiKeyAuth,
        isExternalAuth,
    };
}
