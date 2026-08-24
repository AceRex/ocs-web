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
  avatarUrl?: string;
  phone?: string;
  bio?: string;
  preferredBibleTranslation?: string;
  roleTitle?: string;
  notificationPreferences?: {
    emailUpdates?: boolean;
    serviceReminders?: boolean;
    weeklyDigest?: boolean;
  };
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
  subscriptionExpiresAt?: string | null;
  features?: string[];
  licenseQuotas?: {
    maxDesktops: number;
    maxMobileUsers: number;
    activeDesktops?: any[];
    activeMobileUsers?: any[];
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
  expiresIn?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
  adminOnly?: boolean;
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
  appVersion?: string;
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

export interface SuggestionPayload {
  name?: string;
  email: string;
  church?: string;
  category: string;
  impact?: 'nice_to_have' | 'high_value' | 'critical' | string;
  title: string;
  description: string;
}

export interface SuggestionComment {
  commentId: string;
  name: string;
  email?: string;
  church?: string;
  content: string;
  createdAt: string;
}

export interface SuggestionItem {
  _id: string;
  suggestionId: string;
  name: string;
  email: string;
  church?: string;
  category: string;
  impact: string;
  title: string;
  description: string;
  status: 'under_review' | 'planned' | 'in_development' | 'completed' | 'declined';
  upvotes: number;
  downvotes?: number;
  comments?: SuggestionComment[];
  adminNotes?: string;
  isPublic: boolean;
  isReadByAdmin: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AdminNotificationItem {
  id: string;
  type: 'suggestion' | 'complaint' | 'testimonial' | 'user';
  title: string;
  summary: string;
  category: string;
  status: string;
  badge: string;
  timestamp: string;
  targetUrl: string;
  isUnread: boolean;
}

export interface AdminNotificationResponse {
  success: boolean;
  counts: {
    totalUnread: number;
    unreadSuggestions: number;
    openTickets: number;
    totalSuggestions: number;
    totalTickets: number;
  };
  feed: AdminNotificationItem[];
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
export const getAuthToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("ocs_auth_token");
};

export const setAuthToken = (token: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("ocs_auth_token", token);
    window.dispatchEvent(new Event("ocs-auth-change"));
  }
};

export const clearAuthToken = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("ocs_auth_token");
    window.dispatchEvent(new Event("ocs-auth-change"));
  }
};

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

  // Admin Portal Login (strictly enforces admin role check)
  adminLogin: async (payload: LoginPayload): Promise<AuthResponse> => {
    return apiFetch<AuthResponse>("/auth/admin/login", {
      method: "POST",
      body: JSON.stringify({ ...payload, adminOnly: true }),
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
          platform: payload.platform || "desktop",
          deviceName: "Sanctuary Desktop Station",
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
  getMe: async (): Promise<{ success: boolean; user: User }> => {
    const res = await apiFetch<{ success?: boolean; user?: User } | User>("/auth/me");
    if (res && "user" in res && res.user) {
      return { success: true, user: res.user };
    }
    return { success: true, user: res as User };
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

  getAdminDownloads: async (params?: {
    platform?: string;
    search?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }): Promise<{
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    byPlatform: { macos: number; windows: number; android: number; ios: number };
    dailyTimeline: Array<{ date: string; month?: string; macos?: number; windows?: number; android?: number; ios?: number; total?: number; count?: number }>;
    downloads: any[];
  }> => {
    const qs = new URLSearchParams();
    if (params?.platform) qs.set("platform", params.platform);
    if (params?.search) qs.set("search", params.search);
    if (params?.startDate) qs.set("startDate", params.startDate);
    if (params?.endDate) qs.set("endDate", params.endDate);
    if (params?.page) qs.set("page", String(params.page));
    if (params?.limit) qs.set("limit", String(params.limit));
    const queryStr = qs.toString() ? `?${qs.toString()}` : "";
    return apiFetch<any>(`/admin/downloads${queryStr}`);
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

  updateTicket: async (
    id: string,
    payload: { status?: string; priority?: string },
  ): Promise<{ success: boolean; ticket?: any }> => {
    return apiFetch<{ success: boolean; ticket?: any }>(`/tickets/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  },

  addTicketNote: async (
    id: string,
    note: string,
  ): Promise<{ success: boolean; note?: any }> => {
    return apiFetch<{ success: boolean; note?: any }>(`/tickets/${id}/notes`, {
      method: "POST",
      body: JSON.stringify({ note }),
    });
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

  // Suggestions & Feature Ideas
  createSuggestion: async (
    payload: SuggestionPayload,
  ): Promise<{ success: boolean; id?: string; suggestionId?: string; suggestion?: SuggestionItem }> => {
    return apiFetch<{ success: boolean; id?: string; suggestionId?: string; suggestion?: SuggestionItem }>(
      "/suggestions",
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
    );
  },

  getSuggestions: async (params?: {
    status?: string;
    category?: string;
    search?: string;
    sortBy?: string;
    page?: number;
    limit?: number;
  }): Promise<{ success: boolean; suggestions: SuggestionItem[]; total: number; page?: number; totalPages?: number }> => {
    try {
      const qs = new URLSearchParams();
      if (params?.status) qs.set("status", params.status);
      if (params?.category) qs.set("category", params.category);
      if (params?.search) qs.set("search", params.search);
      if (params?.sortBy) qs.set("sortBy", params.sortBy);
      if (params?.page) qs.set("page", String(params.page));
      if (params?.limit) qs.set("limit", String(params.limit));

      const queryStr = qs.toString() ? `?${qs.toString()}` : "";
      const res = await apiFetch<any>(`/suggestions${queryStr}`);
      if (Array.isArray(res?.suggestions)) return res;
      if (Array.isArray(res)) return { success: true, suggestions: res, total: res.length, page: 1, totalPages: 1 };
      return { success: true, suggestions: [], total: 0, page: 1, totalPages: 1 };
    } catch {
      return { success: false, suggestions: [], total: 0, page: 1, totalPages: 1 };
    }
  },

  upvoteSuggestion: async (id: string, voterKey?: string): Promise<{ success: boolean; upvotes: number; downvotes?: number; suggestion?: SuggestionItem }> => {
    return apiFetch<{ success: boolean; upvotes: number; downvotes?: number; suggestion?: SuggestionItem }>(`/suggestions/${id}/upvote`, {
      method: "POST",
      body: JSON.stringify({ voterKey }),
    });
  },

  downvoteSuggestion: async (id: string, voterKey?: string): Promise<{ success: boolean; upvotes: number; downvotes?: number; suggestion?: SuggestionItem }> => {
    return apiFetch<{ success: boolean; upvotes: number; downvotes?: number; suggestion?: SuggestionItem }>(`/suggestions/${id}/downvote`, {
      method: "POST",
      body: JSON.stringify({ voterKey }),
    });
  },

  addSuggestionComment: async (
    id: string,
    payload: { name?: string; email?: string; church?: string; content: string }
  ): Promise<{ success: boolean; message?: string; comment?: SuggestionComment; comments?: SuggestionComment[] }> => {
    return apiFetch<{ success: boolean; message?: string; comment?: SuggestionComment; comments?: SuggestionComment[] }>(`/suggestions/${id}/comments`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  deleteSuggestionComment: async (id: string, commentId: string): Promise<{ success: boolean; comments?: SuggestionComment[] }> => {
    return apiFetch<{ success: boolean; comments?: SuggestionComment[] }>(`/suggestions/${id}/comments/${commentId}`, {
      method: "DELETE",
    });
  },

  updateSuggestion: async (
    id: string,
    payload: { status?: string; adminNotes?: string; isPublic?: boolean; isReadByAdmin?: boolean },
  ): Promise<{ success: boolean; suggestion?: SuggestionItem }> => {
    return apiFetch<{ success: boolean; suggestion?: SuggestionItem }>(`/suggestions/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  },

  deleteSuggestion: async (id: string): Promise<{ success: boolean }> => {
    return apiFetch<{ success: boolean }>(`/suggestions/${id}`, {
      method: "DELETE",
    });
  },

  // Admin Notification Feed & Live Monitoring Stream
  getAdminNotifications: async (params?: { type?: string; isUnread?: boolean }): Promise<AdminNotificationResponse> => {
    try {
      const qs = new URLSearchParams();
      if (params?.type && params.type !== "all") qs.set("type", params.type);
      if (params?.isUnread !== undefined) qs.set("isUnread", String(params.isUnread));
      const queryStr = qs.toString() ? `?${qs.toString()}` : "";
      return await apiFetch<AdminNotificationResponse>(`/admin/notifications${queryStr}`);
    } catch {
      return {
        success: false,
        counts: {
          totalUnread: 0,
          unreadSuggestions: 0,
          openTickets: 0,
          totalSuggestions: 0,
          totalTickets: 0,
        },
        feed: [],
      };
    }
  },

  markAdminNotificationRead: async (id: string): Promise<{ success: boolean; message?: string }> => {
    return apiFetch<{ success: boolean; message?: string }>(`/admin/notifications/${id}/read`, {
      method: "POST",
    });
  },

  markAdminNotificationUnread: async (id: string): Promise<{ success: boolean; message?: string }> => {
    return apiFetch<{ success: boolean; message?: string }>(`/admin/notifications/${id}/unread`, {
      method: "POST",
    });
  },

  markAllAdminNotificationsRead: async (): Promise<{ success: boolean; message?: string }> => {
    return apiFetch<{ success: boolean; message?: string }>("/admin/notifications/mark-all-read", {
      method: "POST",
    });
  },

  deleteAdminNotification: async (id: string): Promise<{ success: boolean; message?: string }> => {
    return apiFetch<{ success: boolean; message?: string }>(`/admin/notifications/${id}`, {
      method: "DELETE",
    });
  },

  clearReadAdminNotifications: async (): Promise<{ success: boolean; message?: string; count?: number }> => {
    return apiFetch<{ success: boolean; message?: string; count?: number }>("/admin/notifications/clear-read", {
      method: "DELETE",
    });
  },

  // User Profile & Account Management
  updateProfile: async (
    payload: Partial<User>
  ): Promise<{ success: boolean; message: string; user: User }> => {
    return apiFetch<{ success: boolean; message: string; user: User }>("/auth/profile", {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  },

  uploadAvatar: async (
    image: string
  ): Promise<{ success: boolean; message: string; avatarUrl: string; user: User }> => {
    return apiFetch<{ success: boolean; message: string; avatarUrl: string; user: User }>("/auth/profile/avatar", {
      method: "POST",
      body: JSON.stringify({ image }),
    });
  },

  deleteAvatar: async (): Promise<{ success: boolean; message: string; user: User }> => {
    return apiFetch<{ success: boolean; message: string; user: User }>("/auth/profile/avatar", {
      method: "DELETE",
    });
  },

  changePassword: async (payload: {
    currentPassword: string;
    newPassword: string;
  }): Promise<{ success: boolean; message: string }> => {
    return apiFetch<{ success: boolean; message: string }>("/auth/profile/password", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  removeDevice: async (
    deviceId: string
  ): Promise<{ success: boolean; message: string; licenseQuotas: any; user: User }> => {
    return apiFetch<{ success: boolean; message: string; licenseQuotas: any; user: User }>(`/auth/profile/devices/${deviceId}`, {
      method: "DELETE",
    });
  },

  changeSubscription: async (payload: {
    tier: string;
    billingCycle?: string;
  }): Promise<{ success: boolean; message: string; user: User }> => {
    return apiFetch<{ success: boolean; message: string; user: User }>("/auth/profile/subscription/change", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  paySubscription: async (payload: {
    tier: string;
    billingCycle?: string;
    paymentMethod?: string;
    transactionReference?: string;
  }): Promise<{ success: boolean; message: string; reference?: string; user: User }> => {
    return apiFetch<{ success: boolean; message: string; reference?: string; user: User }>("/auth/profile/subscription/pay", {
      method: "POST",
      body: JSON.stringify(payload),
    });
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
