import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  api,
  getAuthToken,
  setAuthToken,
  clearAuthToken,
  type User,
  type LoginPayload,
  type SignupPayload,
  type DesktopAuthPayload,
  type DownloadLogPayload,
  type SupportTicketPayload,
  type TestimonialPayload,
  type SuggestionPayload,
} from "./api"

// ── Auth Hooks ──────────────────────────────────────────────
export function useLoginMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: LoginPayload) => api.login(payload),
    onSuccess: async (data) => {
      if (data?.token) {
        setAuthToken(data.token)
        if (data.user) {
          queryClient.setQueryData(["auth", "me"], { success: true, user: data.user })
        }
        await queryClient.invalidateQueries({ queryKey: ["auth", "me"] })
        await queryClient.refetchQueries({ queryKey: ["auth", "me"] })
      }
    },
  })
}

export function useSignupMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: SignupPayload) => api.signup(payload),
    onSuccess: async (data) => {
      if (data?.token) {
        setAuthToken(data.token)
        if (data.user) {
          queryClient.setQueryData(["auth", "me"], { success: true, user: data.user })
        }
        await queryClient.invalidateQueries({ queryKey: ["auth", "me"] })
        await queryClient.refetchQueries({ queryKey: ["auth", "me"] })
      }
    },
  })
}

export function useRegisterAdminMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: SignupPayload) => api.registerAdmin(payload),
    onSuccess: async (data) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] })
      if (data?.token && !localStorage.getItem("ocs_auth_token")) {
        setAuthToken(data.token)
        if (data.user) {
          queryClient.setQueryData(["auth", "me"], { success: true, user: data.user })
        }
        await queryClient.invalidateQueries({ queryKey: ["auth", "me"] })
        await queryClient.refetchQueries({ queryKey: ["auth", "me"] })
      }
    },
  })
}

export function useDesktopAuthMutation() {
  return useMutation({
    mutationFn: (payload: DesktopAuthPayload) => api.desktopAuth(payload),
  })
}

export function useCurrentUserQuery() {
  const token = typeof window !== "undefined" ? getAuthToken() : null
  return useQuery({
    queryKey: ["auth", "me", token || "anonymous"],
    queryFn: () => api.getMe(),
    enabled: !!token,
    retry: false,
    staleTime: 1000 * 60 * 2, // 2 mins
  })
}

export function useLogout() {
  const queryClient = useQueryClient()
  return () => {
    clearAuthToken()
    queryClient.clear()
  }
}

// ── Download Hooks ──────────────────────────────────────────
export function useLogDownloadMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: DownloadLogPayload) => api.logDownload(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "downloads"] })
    },
  })
}

export function useDownloadsQuery() {
  return useQuery({
    queryKey: ["admin", "downloads"],
    queryFn: () => api.getDownloads(),
  })
}

export function useAdminDownloadsQuery(params?: {
  platform?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: ["admin", "downloads", "admin-view", params],
    queryFn: () => api.getAdminDownloads(params),
  })
}

// ── Support / Ticket Hooks ───────────────────────────────────
export function useCreateTicketMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: SupportTicketPayload) => api.createTicket(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "tickets"] })
    },
  })
}

export function useTicketsQuery() {
  return useQuery({
    queryKey: ["admin", "tickets"],
    queryFn: () => api.getTickets(),
  })
}

export function useUpdateTicketMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: { status?: string; priority?: string } }) =>
      api.updateTicket(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "tickets"] })
      queryClient.invalidateQueries({ queryKey: ["admin", "notifications"] })
    },
  })
}

export function useAddTicketNoteMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, note }: { id: string; note: string }) => api.addTicketNote(id, note),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "tickets"] })
      queryClient.invalidateQueries({ queryKey: ["admin", "notifications"] })
    },
  })
}

// ── Testimonials Hooks ──────────────────────────────────────
export function useCreateTestimonialMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: TestimonialPayload) => api.createTestimonial(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["testimonials"] })
    },
  })
}

export function useTestimonialsQuery() {
  return useQuery({
    queryKey: ["testimonials"],
    queryFn: () => api.getTestimonials(),
    staleTime: 1000 * 60 * 10,
  })
}

// ── FAQs Hooks ──────────────────────────────────────────────
export function useFaqsQuery() {
  return useQuery({
    queryKey: ["faqs"],
    queryFn: () => api.getFaqs(),
    staleTime: 1000 * 60 * 15,
  })
}

// ── Suggestions Hooks ─────────────────────────────────────────
export function useSuggestionsQuery(params?: {
  status?: string;
  category?: string;
  search?: string;
  sortBy?: string;
  page?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: ["suggestions", params],
    queryFn: () => api.getSuggestions(params),
    staleTime: 1000 * 15,
  })
}

export function useCreateSuggestionMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: SuggestionPayload) => api.createSuggestion(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["suggestions"] })
      queryClient.invalidateQueries({ queryKey: ["admin", "notifications"] })
    },
  })
}

export function useUpvoteSuggestionMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, voterKey }: { id: string; voterKey?: string }) => api.upvoteSuggestion(id, voterKey),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["suggestions"] })
    },
  })
}

export function useDownvoteSuggestionMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, voterKey }: { id: string; voterKey?: string }) => api.downvoteSuggestion(id, voterKey),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["suggestions"] })
    },
  })
}

export function useAddSuggestionCommentMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: { name?: string; email?: string; church?: string; content: string } }) =>
      api.addSuggestionComment(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["suggestions"] })
      queryClient.invalidateQueries({ queryKey: ["admin", "notifications"] })
    },
  })
}

export function useDeleteSuggestionCommentMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, commentId }: { id: string; commentId: string }) =>
      api.deleteSuggestionComment(id, commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["suggestions"] })
    },
  })
}

export function useUpdateSuggestionMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: { status?: string; adminNotes?: string; isPublic?: boolean; isReadByAdmin?: boolean } }) =>
      api.updateSuggestion(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["suggestions"] })
      queryClient.invalidateQueries({ queryKey: ["admin", "notifications"] })
    },
  })
}

export function useDeleteSuggestionMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.deleteSuggestion(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["suggestions"] })
    },
  })
}

// ── Admin Live Notifications & Activity Stream ────────────────
export function useAdminNotificationsQuery(params?: { type?: string; isUnread?: boolean }, options?: { refetchInterval?: number }) {
  return useQuery({
    queryKey: ["admin", "notifications", params],
    queryFn: () => api.getAdminNotifications(params),
    refetchInterval: options?.refetchInterval || 10000, // Real-time 10s auto-refresh
    staleTime: 5000,
  })
}

export function useMarkNotificationReadMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.markAdminNotificationRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "notifications"] })
      queryClient.invalidateQueries({ queryKey: ["suggestions"] })
      queryClient.invalidateQueries({ queryKey: ["admin", "tickets"] })
    },
  })
}

export function useMarkNotificationUnreadMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.markAdminNotificationUnread(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "notifications"] })
    },
  })
}

export function useMarkAllNotificationsReadMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => api.markAllAdminNotificationsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "notifications"] })
      queryClient.invalidateQueries({ queryKey: ["suggestions"] })
      queryClient.invalidateQueries({ queryKey: ["admin", "tickets"] })
    },
  })
}

export function useDeleteNotificationMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.deleteAdminNotification(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "notifications"] })
    },
  })
}

export function useClearReadNotificationsMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => api.clearReadAdminNotifications(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "notifications"] })
    },
  })
}

export function useCreateFaqMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: { question: string; answer: string; category?: string; order?: number }) =>
      api.createFaq(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["faqs"] })
    },
  })
}

export function useDeleteFaqMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.deleteFaq(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["faqs"] })
    },
  })
}

// ── Users Management Hooks ──────────────────────────────────
export function useUsersQuery() {
  return useQuery({
    queryKey: ["admin", "users"],
    queryFn: () => api.getUsers(),
    staleTime: 1000 * 60 * 5,
  })
}

export function useAdminUsersQuery() {
  return useQuery({
    queryKey: ["admin", "super_admins"],
    queryFn: () => api.getAdminUsers(),
    staleTime: 1000 * 60 * 5,
  })
}

export function useCreateUserMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: {
      name: string
      email: string
      password: string
      customerType?: "church" | "streamer" | "podcast"
      churchName?: string
      channelLink?: string
      podcastLink?: string
      role?: string
    }) => api.createUser(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] })
    },
  })
}

export function useDeleteUserMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] })
      queryClient.invalidateQueries({ queryKey: ["admin", "super_admins"] })
    },
  })
}

// ── Permissions & Entitlements Management ────────────────────
export function usePermissionsQuery() {
  return useQuery({
    queryKey: ["admin", "permissions"],
    queryFn: () => api.getPermissions(),
    staleTime: 1000 * 60 * 2,
  })
}

export function useCreatePermissionMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: {
      key: string
      name: string
      category?: string
      description?: string
      enabledTiers?: string[]
    }) => api.createPermission(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "permissions"] })
    },
  })
}

export function useTogglePermissionTierMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: { key: string; tier: string; enabled?: boolean }) =>
      api.togglePermissionTier(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "permissions"] })
    },
  })
}

export function useDeletePermissionMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (key: string) => api.deletePermission(key),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "permissions"] })
    },
  })
}

export function useUpdateUserTierMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ userId, payload }: { userId: string; payload: { subscriptionTier: string; extendMonths?: number } }) =>
      api.updateUserTier(userId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] })
    },
  })
}

// ── User Profile & Account Management Hooks ─────────────────
export function useUpdateProfileMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: Partial<User>) => api.updateProfile(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["auth", "me"] })
      await queryClient.refetchQueries({ queryKey: ["auth", "me"] })
    },
  })
}

export function useUploadAvatarMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (image: string) => api.uploadAvatar(image),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["auth", "me"] })
      await queryClient.refetchQueries({ queryKey: ["auth", "me"] })
    },
  })
}

export function useDeleteAvatarMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => api.deleteAvatar(),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["auth", "me"] })
      await queryClient.refetchQueries({ queryKey: ["auth", "me"] })
    },
  })
}

export function useChangePasswordMutation() {
  return useMutation({
    mutationFn: (payload: { currentPassword: string; newPassword: string }) =>
      api.changePassword(payload),
  })
}

export function useRemoveDeviceMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (deviceId: string) => api.removeDevice(deviceId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["auth", "me"] })
      await queryClient.refetchQueries({ queryKey: ["auth", "me"] })
    },
  })
}

export function useChangeSubscriptionMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: { tier: string; billingCycle?: string }) =>
      api.changeSubscription(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["auth", "me"] })
      await queryClient.refetchQueries({ queryKey: ["auth", "me"] })
    },
  })
}

export function usePaySubscriptionMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: {
      tier: string;
      billingCycle?: string;
      paymentMethod?: string;
      transactionReference?: string;
    }) => api.paySubscription(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["auth", "me"] })
      await queryClient.refetchQueries({ queryKey: ["auth", "me"] })
    },
  })
}

// ── Health Query ────────────────────────────────────────────
export function useBackendHealthQuery() {
  return useQuery({
    queryKey: ["system", "health"],
    queryFn: () => api.checkHealth(),
    retry: 1,
  })
}

