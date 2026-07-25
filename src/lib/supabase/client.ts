// Standalone Demo Mock Supabase Client

export function createClient() {
  return {
    auth: {
      getSession: async () => ({
        data: {
          session: {
            user: {
              id: "demo-user-1",
              email: "patient@carebridge.ai",
            },
          },
        },
        error: null,
      }),
      getUser: async () => ({
        data: {
          user: {
            id: "demo-user-1",
            email: "patient@carebridge.ai",
          },
        },
        error: null,
      }),
      signUp: async ({ email }: { email: string; password?: string; options?: any }) => ({
        data: {
          user: {
            id: "demo-user-new",
            email,
          },
          session: null,
        },
        error: null,
      }),
      signOut: async () => ({ error: null }),
      onAuthStateChange: (callback: any) => {
        return {
          data: {
            subscription: {
              unsubscribe: () => {},
            },
          },
        };
      },
    },
    from: (_table: string) => ({
      select: () => ({
        eq: () => ({
          single: async () => ({ data: null, error: null }),
          order: async () => ({ data: [], error: null }),
        }),
        order: async () => ({ data: [], error: null }),
      }),
      insert: async () => ({ data: [], error: null }),
      update: () => ({
        eq: async () => ({ data: null, error: null }),
      }),
      delete: () => ({
        eq: async () => ({ data: null, error: null }),
      }),
    }),
  };
}
