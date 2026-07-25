// Standalone Demo Mock Supabase Server Client

export async function createClient() {
  return {
    auth: {
      getUser: async () => ({
        data: {
          user: {
            id: "demo-user-1",
            email: "patient@carebridge.ai",
          },
        },
        error: null,
      }),
    },
  };
}
