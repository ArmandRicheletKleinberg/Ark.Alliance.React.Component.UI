# LoginPanel

**Professional multi-provider authentication panel with MVVM architecture**

A comprehensive, production-ready login component supporting 6 authentication providers with glassmorphism design, password recovery flow, and full accessibility.

---

## Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [Architecture](#architecture)
4. [Installation](#installation)
5. [API Reference](#api-reference)
6. [Usage Examples](#usage-examples)
7. [Authentication Providers](#authentication-providers)
8. [Password Recovery Flow](#password-recovery-flow)
9. [Styling](#styling)
10. [Accessibility](#accessibility)
11. [Backend Integration](#backend-integration)

---

## Overview

`LoginPanel` is a generic authentication component designed for enterprise applications requiring multiple authentication methods. It follows MVVM architecture and is compatible with the backend auth infrastructure from `Ark.Alliance.TypeScript.Core`.

**Use Cases:**
- SaaS application login portals
- Enterprise admin panels
- Multi-tenant systems
- API gateway authentication
- Internal tools and dashboards

---

## Features

✅ **Multi-Provider Support**: LOCAL, AZURE_AD, LDAP, OIDC, OAUTH2, API_KEY  
✅ **Password Recovery**: Built-in forgot password flow  
✅ **MVVM Architecture**: Clean separation with model, viewmodel, view  
✅ **Backend Compatible**: Matches `Ark.Alliance.TypeScript.Core` auth types  
✅ **Responsive Design**: Mobile-first glassmorphism UI  
✅ **Accessibility**: ARIA labels, keyboard navigation, screen reader support  
✅ **Validation**: Runtime schema validation with Zod  
✅ **Event Emission**: Track auth events (`login:success`, `password-recovery:initiated`, etc.)  
✅ **Customizable**: Logo, app name, links, terms/privacy URLs  

---

## Architecture

### MVVM Layers

```
┌─────────────────────────────────────────────────────────────┐
│ LoginPanel.tsx (View)                                       │
│  • Multi-provider UI with dynamic form fields              │
│  • Error display, loading states                           │
│  • Password recovery mode toggle                           │
└─────────────────────────────────────────────────────────────┘
                           ▲
                           │ uses
                           ▼
┌─────────────────────────────────────────────────────────────┐
│ LoginPanel.viewmodel.ts (ViewModel)                         │
│  • useLoginPanel hook                                       │
│  • State: email, password, username, domain, apiKey, etc.   │
│  • Handlers: handleSubmit, handlePasswordRecoverySubmit     │
│  • Computed: canSubmit, isLocalAuth, isExternalAuth         │
└─────────────────────────────────────────────────────────────┘
                           ▲
                           │ extends
                           ▼
┌─────────────────────────────────────────────────────────────┐
│ LoginPanel.model.ts (Model)                                 │
│  • LoginPanelModelSchema (Zod)                              │
│  • AuthProviderType enum                                    │
│  • Credentials schemas: Local, OAuth, LDAP, ApiKey          │
│  • EXTERNAL_AUTH_CONFIGS constants                          │
└─────────────────────────────────────────────────────────────┘
```

### Backend Compatibility

Credential schemas match backend interfaces from `Ark.Alliance.TypeScript.Core`:
- `ILocalCredentials` → `LocalCredentialsSchema`
- `IOAuthCredentials` → `OAuthCredentialsSchema`
- `ILdapCredentials` → `LdapCredentialsSchema`
- `IApiKeyCredentials` → `ApiKeyCredentialsSchema`

---

## Installation

```bash
npm install ark-alliance-react-ui
```

---

## API Reference

### `LoginPanelProps`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `enabledProviders` | `AuthProviderType[]` | `['local']` | Array of enabled auth providers |
| `defaultProvider` | `AuthProviderType` | `'local'` | Provider to show by default |
| `showPasswordRecovery` | `boolean` | `true` | Show "Forgot password?" link |
| `showRegistration` | `boolean` | `true` | Show "Create account" link |
| `showRememberMe` | `boolean` | `true` | Show "Remember me" checkbox (LOCAL only) |
| `appName` | `string?` | - | Application name to display in header |
| `logoUrl` | `string?` | - | Logo image URL |
| `termsUrl` | `string?` | - | Terms of Service URL |
| `privacyUrl` | `string?` | - | Privacy Policy URL |
| `oauthRedirectUri` | `string?` | - | OAuth redirect URI |
| `ldapDefaultDomain` | `string?` | - | Default LDAP domain |
| `onLogin` | `(credentials: Credentials) => Promise<void>` | - | **Required.** Login handler |
| `onRegister` | `() => void` | - | Registration link click handler |
| `onPasswordRecovery` | `() => void` | - | Password recovery link click handler |
| `oauthProviders` | `Record<AuthProviderType, string>` | - | OAuth provider URLs (for external auth) |
| `className` | `string?` | - | Additional CSS classes |

### `AuthProviderType` Enum

```typescript
enum AuthProviderType {
    LOCAL = 'local',           // Email/password
    AZURE_AD = 'azure_ad',     // Microsoft Azure AD
    LDAP = 'ldap',             // Active Directory (LDAP)
    OIDC = 'oidc',             // OpenID Connect
    OAUTH2 = 'oauth2',         // OAuth 2.0
    API_KEY = 'api_key',       // API Key
}
```

### `Credentials` Types

```typescript
type LocalCredentials = {
    providerType: 'local';
    email: string;
    password: string;
    rememberMe?: boolean;
};

type OAuthCredentials = {
    providerType: 'azure_ad' | 'oidc' | 'oauth2';
    code: string;
    redirectUri: string;
    codeVerifier?: string;
};

type LdapCredentials = {
    providerType: 'ldap';
    username: string;
    password: string;
    domain?: string;
};

type ApiKeyCredentials = {
    providerType: 'api_key';
    apiKey: string;
};

type Credentials = LocalCredentials | OAuthCredentials | LdapCredentials | ApiKeyCredentials;
```

---

## Usage Examples

### Basic Local Authentication

```tsx
import { LoginPanel } from 'ark-alliance-react-ui';
import { authService } from './services/auth';

function LoginPage() {
    return (
        <LoginPanel
            appName="My Application"
            logoUrl="/assets/logo.png"
            onLogin={async (credentials) => {
                await authService.login(credentials);
                navigate('/dashboard');
            }}
            onRegister={() => navigate('/register')}
            onPasswordRecovery={() => navigate('/forgot-password')}
        />
    );
}
```

### Multi-Provider (Azure AD + Local)

```tsx
<LoginPanel
    enabledProviders={['local', 'azure_ad']}
    defaultProvider="local"
    appName="Enterprise Portal"
    logoUrl="/logo.png"
    oauthProviders={{
        azure_ad: 'https://login.microsoftonline.com/<tenant>/oauth2/v2.0/authorize?...',
    }}
    onLogin={async (credentials) => {
        if (credentials.providerType === 'local') {
            await authService.loginLocal(credentials);
        }
    }}
    termsUrl="https://example.com/terms"
    privacyUrl="https://example.com/privacy"
/>
```

### LDAP with Domain

```tsx
<LoginPanel
    enabledProviders={['ldap']}
    ldapDefaultDomain="CORP"
    appName="Active Directory Login"
    onLogin={async (credentials) => {
        if (credentials.providerType === 'ldap') {
            await authService.loginLdap(credentials);
        }
    }}
    showRegistration={false}
/>
```

### API Key Authentication

```tsx
<LoginPanel
    enabledProviders={['api_key']}
    appName="Trading Bot API"
    showRememberMe={false}
    showRegistration={false}
    onLogin={async (credentials) => {
        if (credentials.providerType === 'api_key') {
            await authService.validateApiKey(credentials.apiKey);
        }
    }}
/>
```

---

## Authentication Providers

### LOCAL (Email/Password)

**Form Fields:**
- Email (validated)
- Password
- Remember Me checkbox (optional)

**Credentials Output:**
```typescript
{
    providerType: 'local',
    email: 'user@example.com',
    password: '********',
    rememberMe: true
}
```

---

### AZURE_AD (Microsoft Azure Active Directory)

**UI:**
- External OAuth button: "Sign in with Microsoft Azure AD"

**Flow:**
1. User clicks button
2. Redirects to Azure AD authorization endpoint
3. Returns with authorization code
4. Backend exchanges code for tokens

**Configuration:**
```typescript
oauthProviders={{
    azure_ad: 'https://login.microsoftonline.com/{tenant}/oauth2/v2.0/authorize?client_id=...'
}}
```

---

### LDAP (Active Directory)

**Form Fields:**
- Username
- Domain (optional, can have default)
- Password

**Credentials Output:**
```typescript
{
    providerType: 'ldap',
    username: 'jdoe',
    password: '********',
    domain: 'CORP'
}
```

---

### OIDC / OAUTH2

**UI:**
- External OAuth button with custom label
- Redirects to provider's authorization endpoint

**Configuration:**
```typescript
oauthProviders={{
    oidc: 'https://your-idp.com/authorize?...',
    oauth2: 'https://oauth-provider.com/authorize?...'
}}
```

---

### API_KEY

**Form Fields:**
- API Key (password-masked input)

**Credentials Output:**
```typescript
{
    providerType: 'api_key',
    apiKey: 'sk-...'
}
```

---

## Password Recovery Flow

### Enabling Recovery

```tsx
<LoginPanel
    showPasswordRecovery={true}
    onPasswordRecovery={() => {
        // Option 1: Navigate to recovery page
        navigate('/forgot-password');
        
        // Option 2: Show recovery modal
        setShowRecoveryModal(true);
    }}
    onLogin={async (credentials) => { /* ... */ }}
/>
```

### Using Built-in Recovery State

```tsx
const LoginWithRecovery = () => {
    const handlePasswordRecovery = async (email: string) => {
        await authService.sendPasswordResetEmail(email);
        toast.success('Recovery email sent!');
    };

    return (
        <LoginPanel
            showPasswordRecovery
            onPasswordRecovery={handlePasswordRecovery}
            onLogin={async (credentials) => { /* ... */ }}
        />
    );
};
```

### Recovery Events

```typescript
// ViewModel emits events during recovery flow:
base.emit('password-recovery:initiated', { email: 'user@example.com' });
base.emit('password-recovery:success', { email: 'user@example.com' });
base.emit('password-recovery:error', { error: 'Email not found' });
```

---

## Styling

### Glassmorphism Design

The component uses a modern glassmorphism aesthetic with:
- Backdrop blur effects
- Semi-transparent backgrounds
- Gradient borders
- Smooth transitions
- Neon glow effects

### Customization

Override CSS variables for custom theming:

```css
.login-panel {
    --text-primary: #ffffff;
    --text-secondary: #a0a0a0;
    --gradient-start: #667eea;
    --gradient-end: #764ba2;
}
```

### Responsive Breakpoints

- **Desktop**: Full width (max 420px)
- **Mobile** (<480px): Reduced padding, smaller fonts

---

## Accessibility

✅ **ARIA Labels**: All interactive elements labeled  
✅ **Keyboard Navigation**: Full keyboard support (Tab, Enter, Escape)  
✅ **Screen Readers**: Provider tabs use proper role/aria-selected  
✅ **Focus Management**: Visible focus indicators  
✅ **Error Announcements**: `role="alert"` with `aria-live="assertive"`  
✅ **Form Validation**: `aria-required` and `aria-invalid` attributes  

### Keyboard Shortcuts

| Key | Action |
|-----|--------|
| **Tab** | Navigate between fields and buttons |
| **Enter** | Submit form / click buttons |
| **Escape** | Dismiss error messages |
| **Arrow Keys** | Navigate provider tabs |

---

## Backend Integration

### Express.js Example

```typescript
// routes/auth.ts
import { Router } from 'express';
import { AuthService } from '../services/auth';

const router = Router();

router.post('/login', async (req, res) => {
    const credentials = req.body; // Matches LoginPanel credentials type
    
    try {
        const result = await AuthService.authenticate(credentials);
        res.json({ success: true, token: result.token });
    } catch (error) {
        res.status(401).json({ success: false, error: error.message });
    }
});

router.post('/password-recovery', async (req, res) => {
    const { email } = req.body;
    await AuthService.sendPasswordResetEmail(email);
    res.json({ success: true });
});

export default router;
```

### Ark.Alliance.TypeScript.Core Integration

```typescript
import { AuthController } from '@ark-alliance/core/auth';
import type { Credentials } from 'ark-alliance-react-ui';

const handleLogin = async (credentials: Credentials) => {
    // Credentials type matches backend IAuthCredentials union
    const response = await AuthController.login(credentials);
    
    // Store token
    localStorage.setItem('authToken', response.token);
    
    // Redirect
    window.location.href = '/dashboard';
};
```

---

## Best Practices

1. **Always validate credentials on backend** - Frontend validation is for UX only
2. **Use HTTPS** - Never transmit credentials over HTTP
3. **Implement rate limiting** - Prevent brute force attacks
4. **Log auth events** - Track `password-recovery:initiated`, `login:error` events
5. **Secure OAuth callbacks** - Validate `state` parameter and use PKCE
6. **Handle errors gracefully** - Display user-friendly error messages
7. **Accessibility first** - Test with keyboard and screen readers

---

## License

MIT

---

**M2H.IO (c) 2025 - Ark.Alliance Eco system - Armand Richelet-Kleinberg**
