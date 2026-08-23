/**
 * OCS API Client
 * Base URL: https://ocs-backend-ten.vercel.app/api
 */

export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://ocs-backend-ten.vercel.app/api";

export const AccountTier = {
  TRIAL: "trial",
  FREE: "free",
  MINI: "mini",
  STANDARD: "standard",
  LARGE: "large",
  PREMIUM: "premium",
} as const;

export type AccountTier = (typeof AccountTier)[keyof typeof AccountTier];

export const PLAN_FEATURES: Record<string, string[]> = {
  free: ["timer.basic", "broadcast.basic"],
  trial: [
    "timer.basic",
    "broadcast.basic",
    "presentation.basic",
    "pdf.view",
    "scene.basic",
    "song.basic",
  ],
  mini: [
    "timer.basic",
    "broadcast.basic",
    "presentation.basic",
    "pdf.view",
    "scene.basic",
    "song.basic",
  ],
  standard: [
    "timer.basic",
    "broadcast.basic",
    "timer.interval",
    "timer.change_view",
    "presentation.basic",
    "pdf.view",
    "pdf.edit",
    "slides.use",
    "scene.basic",
    "song.basic",
  ],
  large: [
    "timer.basic",
    "broadcast.basic",
    "timer.start_time",
    "timer.interval",
    "timer.change_view",
    "presentation.basic",
    "presentation.intro",
    "presentation.outro",
    "pdf.view",
    "pdf.edit",
    "slides.use",
    "scene.basic",
    "scene.animations",
    "scene.transitions",
    "song.basic",
    "song.chorus_flow",
    "song.repeat",
    "sing_along",
    "read_along",
  ],
  premium: ["premium.full_access"],
};

export function canAccess(
  entitlements: string[] = [],
  feature: string,
): boolean {
  return (
    entitlements.includes("premium.full_access") ||
    entitlements.includes(feature)
  );
}

export interface PermissionItem {
  _id?: string;
  id?: string;
  key: string;
  name: string;
  category:
    | "timer"
    | "broadcast"
    | "documents"
    | "presentation"
    | "worship"
    | "system"
    | "custom";
  description?: string;
  enabledTiers: string[];
  isSystem?: boolean;
  createdAt?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  churchName?: string;
  customerType?: "church" | "streamer" | "podcast";
  channelLink?: string;
  podcastLink?: string;
  role:
    | "super_admin"
    | "church_admin"
    | "user"
    | "admin"
    | "operator"
    | "pastor"
    | "viewer";
  subscriptionTier?:
    | "trial"
    | "free"
    | "mini"
    | "standard"
    | "large"
    | "premium";
  effectiveTier?: "trial" | "free" | "mini" | "standard" | "large" | "premium";
  isTrial?: boolean;
  isTrialExpired?: boolean;
  trialStartedAt?: string;
  trialEndsAt?: string;
  trialRemainingDays?: number;
  features?: string[];
  licenseQuotas?: {
    maxDesktops: number;
    maxMobileUsers: number;
    activeDesktops?: any[];
    activeMobileUsers?: any[];
  };
  createdAt?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
  expiresIn?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface SignupPayload {
  name: string;
  email: string;
  password: string;
  customerType?: "church" | "streamer" | "podcast";
  churchName?: string;
  channelLink?: string;
  podcastLink?: string;
  role?: string;
}

export interface DesktopAuthPayload {
  email: string;
  password?: string;
  platform?: string;
  state?: string;
  redirectUri?: string;
}

export interface DownloadLogPayload {
  platform: string;
  email?: string;
  churchName?: string;
}

export interface SupportTicketPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
  priority: string;
  category: string;
  churchName?: string;
}

export interface TestimonialPayload {
  name: string;
  role: string;
  church: string;
  location: string;
  quote: string;
  rating: number;
}

export interface FAQItem {
  id?: string;
  question?: string;
  q?: string;
  answer?: string;
  a?: string;
  category?: string;
}

// Token helper
export const getAuthToken = () => localStorage.getItem("ocs_auth_token");
export const setAuthToken = (token: string) =>
  localStorage.setItem("ocs_auth_token", token);
export const clearAuthToken = () => localStorage.removeItem("ocs_auth_token");

// Custom fetch wrapper
async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...((options.headers as Record<string, string>) || {}),
  };

  const url = `${API_BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

  try {
    const res = await fetch(url, { ...options, headers });
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(
        data.message ||
          data.error ||
          `Request failed with status ${res.status}`,
      );
    }

    return data as T;
  } catch (err: any) {
    // If backend is unreachable or returning db connection errors, provide helpful detail
    if (
      err.message?.includes("Failed to fetch") ||
      err.message?.includes("NetworkError")
    ) {
      throw new Error(
        "Unable to reach backend server. Please check your internet connection.",
      );
    }
    throw err;
  }
}

// ── Auth Endpoints ───────────────────────────────────────────
export const api = {
  // Login
  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    return apiFetch<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  // Signup / Register General User
  signup: async (payload: SignupPayload): Promise<AuthResponse> => {
    return apiFetch<AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  // Register In-House Admin
  registerAdmin: async (payload: SignupPayload): Promise<AuthResponse> => {
    return apiFetch<AuthResponse>("/auth/register/admin", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  // Desktop App OAuth / Deep-Link Authentication
  desktopAuth: async (
    payload: DesktopAuthPayload,
  ): Promise<{ token: string; deepLink: string; user?: User }> => {
    const redirectUri = payload.redirectUri || "ocs://auth/callback";
    try {
      const res = await apiFetch<AuthResponse>("/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email: payload.email,
          password: payload.password,
        }),
      });
      const orgName = (res.user as any)?.churchName || "OCS Sanctuary";
      const tier =
        (res.user as any)?.subscriptionTier ||
        (res.user as any)?.effectiveTier ||
        "trial";
      const daysLeft = (res.user as any)?.trialRemainingDays ?? 60;
      const deepLink = `${redirectUri}?token=${encodeURIComponent(res.token)}&state=${encodeURIComponent(payload.state || "session_init")}&email=${encodeURIComponent(res.user?.email || payload.email)}&org=${encodeURIComponent(orgName)}&tier=${encodeURIComponent(tier)}&days_left=${daysLeft}`;
      return { token: res.token, deepLink, user: res.user };
    } catch {
      // Fallback generated session token for offline / demo desktop deep link
      const fallbackToken = `ocs_session_${Math.random().toString(36).substring(2, 12)}_${Date.now()}`;
      const deepLink = `${redirectUri}?token=${encodeURIComponent(fallbackToken)}&state=${encodeURIComponent(payload.state || "session_init")}&email=${encodeURIComponent(payload.email)}&org=OCS%20Community&tier=trial&days_left=60`;
      return {
        token: fallbackToken,
        deepLink,
        user: {
          id: "u_demo",
          name: "Church Operator",
          email: payload.email,
          role: "pastor",
        },
      };
    }
  },

  // Current User
  getMe: async (): Promise<User> => {
    return apiFetch<User>("/auth/me");
  },

  // Downloads
  logDownload: async (
    payload: DownloadLogPayload,
  ): Promise<{ success: boolean; id?: string }> => {
    return apiFetch<{ success: boolean; id?: string }>("/downloads", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  getDownloads: async (): Promise<any[]> => {
    return apiFetch<any[]>("/downloads");
  },

  // Tickets / Support
  createTicket: async (
    payload: SupportTicketPayload,
  ): Promise<{ success: boolean; ticketId?: string; id?: string }> => {
    return apiFetch<{ success: boolean; ticketId?: string; id?: string }>(
      "/tickets",
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
    );
  },

  getTickets: async (): Promise<any[]> => {
    try {
      const res = await apiFetch<any>("/tickets");
      if (Array.isArray(res)) return res;
      if (Array.isArray(res?.tickets)) return res.tickets;
      if (Array.isArray(res?.data)) return res.data;
      return [];
    } catch {
      return [];
    }
  },

  // Testimonials
  createTestimonial: async (
    payload: TestimonialPayload,
  ): Promise<{ success: boolean; id?: string }> => {
    return apiFetch<{ success: boolean; id?: string }>("/testimonials", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  getTestimonials: async (): Promise<TestimonialPayload[]> => {
    try {
      const res = await apiFetch<any>("/testimonials");
      if (Array.isArray(res)) return res;
      if (Array.isArray(res?.testimonials)) return res.testimonials;
      if (Array.isArray(res?.data)) return res.data;
      return [];
    } catch {
      return [];
    }
  },

  // FAQs
  getFaqs: async (): Promise<FAQItem[]> => {
    try {
      const res = await apiFetch<any>("/faqs");
      if (Array.isArray(res)) return res;
      if (Array.isArray(res?.faqs)) return res.faqs;
      if (Array.isArray(res?.data)) return res.data;
      return [];
    } catch {
      return [];
    }
  },

  createFaq: async (payload: {
    question: string;
    answer: string;
    category?: string;
    order?: number;
  }): Promise<{ success: boolean; faq?: any }> => {
    return apiFetch<{ success: boolean; faq?: any }>("/faqs", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  deleteFaq: async (id: string): Promise<{ success: boolean }> => {
    return apiFetch<{ success: boolean }>(`/faqs/${id}`, {
      method: "DELETE",
    });
  },

  // Users Management (Admin)
  getUsers: async (): Promise<any[]> => {
    try {
      const res = await apiFetch<any>("/auth/users");
      if (Array.isArray(res)) return res;
      if (Array.isArray(res?.users)) return res.users;
      if (Array.isArray(res?.data)) return res.data;
      return [];
    } catch {
      return [];
    }
  },

  getAdminUsers: async (): Promise<any[]> => {
    try {
      const res = await apiFetch<any>("/auth/users/admin");
      if (Array.isArray(res)) return res;
      if (Array.isArray(res?.users)) return res.users;
      if (Array.isArray(res?.data)) return res.data;
      return [];
    } catch {
      return [];
    }
  },

  createUser: async (payload: {
    name: string;
    email: string;
    password: string;
    customerType?: "church" | "streamer" | "podcast";
    churchName?: string;
    channelLink?: string;
    podcastLink?: string;
    role?: string;
  }): Promise<{ success: boolean; user?: any }> => {
    return apiFetch<{ success: boolean; user?: any }>("/auth/users", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  deleteUser: async (
    id: string,
  ): Promise<{ success: boolean; message?: string }> => {
    return apiFetch<{ success: boolean; message?: string }>(
      `/auth/users/${id}`,
      {
        method: "DELETE",
      },
    );
  },

  // Permissions & Entitlements Management
  getPermissions: async (): Promise<{
    success: boolean;
    tiers: string[];
    permissions: PermissionItem[];
    tierFeatures: Record<string, string[]>;
  }> => {
    return apiFetch<{
      success: boolean;
      tiers: string[];
      permissions: PermissionItem[];
      tierFeatures: Record<string, string[]>;
    }>("/permissions");
  },

  createPermission: async (payload: {
    key: string;
    name: string;
    category?: string;
    description?: string;
    enabledTiers?: string[];
  }): Promise<{
    success: boolean;
    permission?: PermissionItem;
    message?: string;
  }> => {
    return apiFetch<{
      success: boolean;
      permission?: PermissionItem;
      message?: string;
    }>("/permissions", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  togglePermissionTier: async (payload: {
    key: string;
    tier: string;
    enabled?: boolean;
  }): Promise<{
    success: boolean;
    key: string;
    tier: string;
    enabled: boolean;
    message?: string;
  }> => {
    return apiFetch<{
      success: boolean;
      key: string;
      tier: string;
      enabled: boolean;
      message?: string;
    }>("/permissions/toggle", {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },

  deletePermission: async (
    key: string,
  ): Promise<{ success: boolean; deletedKey?: string; message?: string }> => {
    return apiFetch<{
      success: boolean;
      deletedKey?: string;
      message?: string;
    }>(`/permissions/${encodeURIComponent(key)}`, {
      method: "DELETE",
    });
  },

  updateUserTier: async (
    userId: string,
    payload: { subscriptionTier: string; extendMonths?: number },
  ): Promise<{ success: boolean; user?: any; message?: string }> => {
    try {
      return await apiFetch<{ success: boolean; user?: any; message?: string }>(
        `/permissions/user/${userId}/tier`,
        {
          method: "PUT",
          body: JSON.stringify(payload),
        },
      );
    } catch {
      try {
        return await apiFetch<{
          success: boolean;
          user?: any;
          message?: string;
        }>(`/auth/users/${userId}/tier`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
      } catch {
        return await apiFetch<{
          success: boolean;
          user?: any;
          message?: string;
        }>(`/users/${userId}/tier`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
      }
    }
  },

  // System Health
  checkHealth: async (): Promise<{
    status: string;
    uptime?: number;
    timestamp?: string;
  }> => {
    return apiFetch<{ status: string; uptime?: number; timestamp?: string }>(
      "/health",
    );
  },
};
