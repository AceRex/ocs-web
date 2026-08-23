import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  api,
  setAuthToken,
  clearAuthToken,
  type LoginPayload,
  type SignupPayload,
  type DesktopAuthPayload,
  type DownloadLogPayload,
  type SupportTicketPayload,
  type TestimonialPayload,
} from "./api"

// ── Auth Hooks ──────────────────────────────────────────────
export function useLoginMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: LoginPayload) => api.login(payload),
    onSuccess: (data) => {
      if (data?.token) {
        setAuthToken(data.token)
        queryClient.setQueryData(["auth", "me"], data.user)
      }
    },
  })
}

export function useSignupMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: SignupPayload) => api.signup(payload),
    onSuccess: (data) => {
      if (data?.token) {
        setAuthToken(data.token)
        queryClient.setQueryData(["auth", "me"], data.user)
      }
    },
  })
}

export function useRegisterAdminMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: SignupPayload) => api.registerAdmin(payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] })
      if (data?.token && !localStorage.getItem("ocs_auth_token")) {
        setAuthToken(data.token)
        queryClient.setQueryData(["auth", "me"], data.user)
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
  return useQuery({
    queryKey: ["auth", "me"],
    queryFn: () => api.getMe(),
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 mins
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

// ── Health Query ────────────────────────────────────────────
export function useBackendHealthQuery() {
  return useQuery({
    queryKey: ["system", "health"],
    queryFn: () => api.checkHealth(),
    retry: 1,
  })
}
