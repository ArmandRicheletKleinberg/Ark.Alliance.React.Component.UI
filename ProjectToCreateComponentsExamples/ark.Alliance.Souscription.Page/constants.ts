import { AppConfig } from './types';

export const DEFAULT_CONFIG: AppConfig = {
  productName: "Nexus SaaS",
  productTagline: "Scale your business with the ultimate toolkit.",
  defaults: {
    billingCycle: 'monthly',
    currency: '$',
  },
  theme: {
    gradientBackground: "linear-gradient(to bottom right, #0f172a, #1e1b4b, #312e81)",
    primaryColor: "#6366f1", // Indigo 500
    secondaryColor: "#a855f7", // Purple 500
    surfaceColor: "#1e293b", // Slate 800
    glowIntensity: "medium",
    cornerRadius: "1rem",
  },
  tiers: [
    {
      id: "tier_starter",
      name: "Starter",
      tagline: "For individuals",
      description: "Essential tools to get your side project off the ground.",
      icon: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
      media: {
        type: "image",
        url: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80"
      },
      features: [
        "1 User Seat",
        "5 Projects",
        "Community Support",
        "Basic Analytics"
      ],
      pricing: {
        monthly: 9,
        yearly: 90, // 2 months free equivalent
        currency: "$"
      }
    },
    {
      id: "tier_pro",
      name: "Pro",
      tagline: "For growing teams",
      description: "Advanced power for professional workflows.",
      isRecommended: true,
      icon: "https://cdn-icons-png.flaticon.com/512/3135/3135768.png",
      media: {
        type: "video",
        url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
        poster: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80",
        autoPlay: false
      },
      features: [
        "5 User Seats",
        "Unlimited Projects",
        "Priority Email Support",
        "Advanced Analytics",
        "API Access"
      ],
      pricing: {
        monthly: 29,
        yearly: 290,
        currency: "$"
      }
    },
    {
      id: "tier_enterprise",
      name: "Enterprise",
      tagline: "For large orgs",
      description: "Maximum security, control, and dedicated support.",
      icon: "https://cdn-icons-png.flaticon.com/512/3135/3135810.png",
      media: {
        type: "image",
        url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80"
      },
      features: [
        "Unlimited Seats",
        "SSO & Audit Logs",
        "24/7 Phone Support",
        "Custom Integrations",
        "Dedicated Account Manager"
      ],
      pricing: {
        monthly: 99,
        yearly: 990,
        currency: "$"
      }
    }
  ],
  paymentMethods: [
    {
      id: "pm_paypal",
      type: "paypal",
      label: "PayPal",
      enabled: true,
      icon: "https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg"
    },
    {
      id: "pm_usdt_trc20",
      type: "crypto",
      label: "Tether (USDT)",
      enabled: true,
      icon: "https://cryptologos.cc/logos/tether-usdt-logo.png?v=029",
      cryptoConfig: {
        chain: "TRON (TRC20)",
        symbol: "USDT",
        address: "T9yD14Nj9j7xAB4dbGeiX9h8zzC52CCD5", // Placeholder
        confirmationsHint: "Wait for 1 confirmation"
      }
    },
    {
      id: "pm_btc",
      type: "crypto",
      label: "Bitcoin",
      enabled: true,
      icon: "https://cryptologos.cc/logos/bitcoin-btc-logo.png?v=029",
      cryptoConfig: {
        chain: "Bitcoin Network",
        symbol: "BTC",
        address: "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa", // Placeholder (Genesis)
        confirmationsHint: "Requires 2 confirmations (~20 mins)"
      }
    },
    {
      id: "pm_eth",
      type: "crypto",
      label: "Ethereum",
      enabled: true,
      icon: "https://cryptologos.cc/logos/ethereum-eth-logo.png?v=029",
      cryptoConfig: {
        chain: "Ethereum (ERC20)",
        symbol: "ETH",
        address: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045", // Placeholder (Vitalik)
      }
    },
    {
      id: "pm_sol",
      type: "crypto",
      label: "Solana",
      enabled: true,
      icon: "https://cryptologos.cc/logos/solana-sol-logo.png?v=029",
      cryptoConfig: {
        chain: "Solana",
        symbol: "SOL",
        address: "HN7cABqLq46Es1jh92dQQisAq662SmxELLLsHHe4YWrH",
      }
    }
  ]
};