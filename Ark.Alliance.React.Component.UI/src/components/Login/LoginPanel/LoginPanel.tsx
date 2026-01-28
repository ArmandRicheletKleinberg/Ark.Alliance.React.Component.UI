/**
 * @fileoverview LoginPanel View Component
 * @module components/Login/LoginPanel
 * 
 * Generic authentication panel supporting multiple auth providers.
 * Uses glassmorphism design with responsive layout and accessibility.
 * 
 * @author Armand Richelet-Kleinberg with the assistance of Anthropic Claude Opus 4.5
 */

import React, { memo, forwardRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrosoft } from '@fortawesome/free-brands-svg-icons';
import {
    faEnvelope,
    faLock,
    faUser,
    faKey,
    faServer,
    faShieldHalved,
    faExclamationCircle,
    faTimes,
} from '@fortawesome/free-solid-svg-icons';
import { useLoginPanel, type UseLoginPanelOptions } from './LoginPanel.viewmodel';
import { AuthProviderType, AUTH_PROVIDER_LABELS } from './LoginPanel.model';
import './LoginPanel.scss';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface LoginPanelProps extends UseLoginPanelOptions {
    /** Additional CSS classes */
    className?: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// PROVIDER ICONS
// ═══════════════════════════════════════════════════════════════════════════

const PROVIDER_ICONS = {
    [AuthProviderType.LOCAL]: faEnvelope,
    [AuthProviderType.AZURE_AD]: faMicrosoft,
    [AuthProviderType.LDAP]: faServer,
    [AuthProviderType.OIDC]: faShieldHalved,
    [AuthProviderType.OAUTH2]: faKey,
    [AuthProviderType.API_KEY]: faKey,
};

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

/**
 * LoginPanel Component
 * 
 * Professional authentication panel with support for multiple providers:
 * - LOCAL: Email/password authentication
 * - AZURE_AD: Microsoft Azure Active Directory
 * - LDAP: Active Directory via LDAP
 * - OIDC: OpenID Connect
 * - OAUTH2: OAuth 2.0
 * - API_KEY: API key authentication
 * 
 * Features:
 * - Responsive glassmorphism design
 * - Provider selector with icons
 * - Dynamic form fields based on provider
 * - Password recovery flow
 * - Remember me checkbox
 * - Error display with dismiss
 * - Loading states
 * - Full accessibility (ARIA, keyboard navigation)
 * 
 * @example
 * ```tsx
 * <LoginPanel
 *   enabledProviders={['local', 'azure_ad']}
 *   defaultProvider="local"
 *   appName="My Application"
 *   logoUrl="/logo.png"
 *   showPasswordRecovery
 *   showRegistration
 *   onLogin={async (credentials) => {
 *     await authService.login(credentials);
 *   }}
 *   onPasswordRecovery={() => navigate('/forgot-password')}
 *   onRegister={() => navigate('/register')}
 * />
 * ```
 */
export const LoginPanel = memo(
    forwardRef<HTMLDivElement, LoginPanelProps>(function LoginPanel(props, ref) {
        const { className, ...options } = props;
        const vm = useLoginPanel(options);

        // ───────────────────────────────────────────────────────────────────
        // Render Functions
        // ───────────────────────────────────────────────────────────────────

        const renderProviderSelector = () => {
            if (vm.model.enabledProviders.length <= 1) return null;

            return (
                <div className="login-panel__provider-selector" role="tablist">
                    {vm.model.enabledProviders.map((provider) => (
                        <button
                            key={provider}
                            type="button"
                            role="tab"
                            aria-selected={vm.activeProvider === provider}
                            aria-label={`Sign in with ${AUTH_PROVIDER_LABELS[provider]}`}
                            className={`login-panel__provider-btn ${vm.activeProvider === provider ? 'login-panel__provider-btn--active' : ''
                                }`}
                            onClick={() => vm.setActiveProvider(provider)}
                            disabled={vm.isSubmitting}
                        >
                            <FontAwesomeIcon icon={PROVIDER_ICONS[provider]} />
                            <span>{AUTH_PROVIDER_LABELS[provider]}</span>
                        </button>
                    ))}
                </div>
            );
        };

        const renderLocalAuthForm = () => (
            <>
                <div className="login-panel__field">
                    <label htmlFor="login-email" className="login-panel__label">
                        <FontAwesomeIcon icon={faEnvelope} />
                        <span>Email</span>
                    </label>
                    <input
                        id="login-email"
                        type="email"
                        className="login-panel__input"
                        placeholder="Enter your email"
                        value={vm.email}
                        onChange={(e) => vm.setEmail(e.target.value)}
                        disabled={vm.isSubmitting}
                        required
                        autoComplete="username"
                        aria-required="true"
                    />
                </div>

                <div className="login-panel__field">
                    <label htmlFor="login-password" className="login-panel__label">
                        <FontAwesomeIcon icon={faLock} />
                        <span>Password</span>
                    </label>
                    <input
                        id="login-password"
                        type="password"
                        className="login-panel__input"
                        placeholder="Enter your password"
                        value={vm.password}
                        onChange={(e) => vm.setPassword(e.target.value)}
                        disabled={vm.isSubmitting}
                        required
                        autoComplete="current-password"
                        aria-required="true"
                    />
                </div>

                {vm.model.showRememberMe && (
                    <div className="login-panel__checkbox">
                        <input
                            id="login-remember"
                            type="checkbox"
                            checked={vm.rememberMe}
                            onChange={(e) => vm.setRememberMe(e.target.checked)}
                            disabled={vm.isSubmitting}
                        />
                        <label htmlFor="login-remember">Remember me</label>
                    </div>
                )}
            </>
        );

        const renderLdapAuthForm = () => (
            <>
                <div className="login-panel__field">
                    <label htmlFor="login-username" className="login-panel__label">
                        <FontAwesomeIcon icon={faUser} />
                        <span>Username</span>
                    </label>
                    <input
                        id="login-username"
                        type="text"
                        className="login-panel__input"
                        placeholder="Enter your username"
                        value={vm.username}
                        onChange={(e) => vm.setUsername(e.target.value)}
                        disabled={vm.isSubmitting}
                        required
                        autoComplete="username"
                        aria-required="true"
                    />
                </div>

                <div className="login-panel__field">
                    <label htmlFor="login-domain" className="login-panel__label">
                        <FontAwesomeIcon icon={faServer} />
                        <span>Domain (optional)</span>
                    </label>
                    <input
                        id="login-domain"
                        type="text"
                        className="login-panel__input"
                        placeholder="DOMAIN"
                        value={vm.domain}
                        onChange={(e) => vm.setDomain(e.target.value)}
                        disabled={vm.isSubmitting}
                        autoComplete="off"
                    />
                </div>

                <div className="login-panel__field">
                    <label htmlFor="login-ldap-password" className="login-panel__label">
                        <FontAwesomeIcon icon={faLock} />
                        <span>Password</span>
                    </label>
                    <input
                        id="login-ldap-password"
                        type="password"
                        className="login-panel__input"
                        placeholder="Enter your password"
                        value={vm.password}
                        onChange={(e) => vm.setPassword(e.target.value)}
                        disabled={vm.isSubmitting}
                        required
                        autoComplete="current-password"
                        aria-required="true"
                    />
                </div>
            </>
        );

        const renderApiKeyForm = () => (
            <div className="login-panel__field">
                <label htmlFor="login-apikey" className="login-panel__label">
                    <FontAwesomeIcon icon={faKey} />
                    <span>API Key</span>
                </label>
                <input
                    id="login-apikey"
                    type="password"
                    className="login-panel__input"
                    placeholder="Enter your API key"
                    value={vm.apiKey}
                    onChange={(e) => vm.setApiKey(e.target.value)}
                    disabled={vm.isSubmitting}
                    required
                    autoComplete="off"
                    aria-required="true"
                />
            </div>
        );

        const renderExternalAuthButtons = () => (
            <div className="login-panel__external">
                <p className="login-panel__external-text">
                    Click below to authenticate with {AUTH_PROVIDER_LABELS[vm.activeProvider]}
                </p>
                <button
                    type="button"
                    className="login-panel__external-btn"
                    onClick={() => vm.handleOAuthLogin(vm.activeProvider)}
                    disabled={vm.isSubmitting}
                >
                    <FontAwesomeIcon icon={PROVIDER_ICONS[vm.activeProvider]} />
                    <span>Sign in with {AUTH_PROVIDER_LABELS[vm.activeProvider]}</span>
                </button>
            </div>
        );

        const renderFormFields = () => {
            if (vm.isExternalAuth) {
                return renderExternalAuthButtons();
            }

            if (vm.isLdapAuth) {
                return renderLdapAuthForm();
            }

            if (vm.isApiKeyAuth) {
                return renderApiKeyForm();
            }

            // Default: local auth
            return renderLocalAuthForm();
        };

        const renderError = () => {
            if (!vm.error) return null;

            return (
                <div className="login-panel__error" role="alert" aria-live="assertive">
                    <FontAwesomeIcon icon={faExclamationCircle} />
                    <span>{vm.error}</span>
                    <button
                        type="button"
                        className="login-panel__error-close"
                        onClick={vm.clearError}
                        aria-label="Dismiss error"
                    >
                        <FontAwesomeIcon icon={faTimes} />
                    </button>
                </div>
            );
        };

        const renderFooter = () => (
            <div className="login-panel__footer">
                {vm.model.showPasswordRecovery && options.onPasswordRecovery && (
                    <button
                        type="button"
                        className="login-panel__link"
                        onClick={options.onPasswordRecovery}
                        disabled={vm.isSubmitting}
                    >
                        Forgot password?
                    </button>
                )}

                {vm.model.showRegistration && options.onRegister && (
                    <button
                        type="button"
                        className="login-panel__link"
                        onClick={options.onRegister}
                        disabled={vm.isSubmitting}
                    >
                        Create account
                    </button>
                )}

                {vm.model.termsUrl && vm.model.privacyUrl && (
                    <p className="login-panel__legal">
                        By signing in, you agree to our{' '}
                        <a href={vm.model.termsUrl} target="_blank" rel="noopener noreferrer">
                            Terms
                        </a>{' '}
                        and{' '}
                        <a href={vm.model.privacyUrl} target="_blank" rel="noopener noreferrer">
                            Privacy Policy
                        </a>
                    </p>
                )}
            </div>
        );

        // ───────────────────────────────────────────────────────────────────
        // Render
        // ───────────────────────────────────────────────────────────────────

        return (
            <div
                ref={ref}
                className={`login-panel ${className || ''}`.trim()}
                data-testid={vm.model.testId}
            >
                {/* Header */}
                {(vm.model.logoUrl || vm.model.appName) && (
                    <div className="login-panel__header">
                        {vm.model.logoUrl && (
                            <img
                                src={vm.model.logoUrl}
                                alt={vm.model.appName || 'Application logo'}
                                className="login-panel__logo"
                            />
                        )}
                        {vm.model.appName && <h1 className="login-panel__title">{vm.model.appName}</h1>}
                    </div>
                )}

                {/* Provider Selector */}
                {renderProviderSelector()}

                {/* Error Message */}
                {renderError()}

                {/* Form */}
                <form className="login-panel__form" onSubmit={vm.handleSubmit} noValidate>
                    {renderFormFields()}

                    {!vm.isExternalAuth && (
                        <button
                            type="submit"
                            className="login-panel__submit"
                            disabled={!vm.canSubmit || vm.isSubmitting}
                            aria-busy={vm.isSubmitting}
                        >
                            {vm.isSubmitting ? (
                                <>
                                    <span className="login-panel__spinner" aria-hidden="true" />
                                    <span>Signing in...</span>
                                </>
                            ) : (
                                <span>Sign In</span>
                            )}
                        </button>
                    )}
                </form>

                {/* Footer */}
                {renderFooter()}
            </div>
        );
    })
);

LoginPanel.displayName = 'LoginPanel';
