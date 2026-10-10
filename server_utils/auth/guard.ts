import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { apiError } from "@/server_utils/responses";

export async function requireAuth() {
  const session = await getServerSession(authOptions);
  if (!session) {
    throw new Error("Unauthorized");
  }
  return session;
}

export async function withAuth(handler: Function) {
  return async (request: Request, ...args: any[]) => {
    try {
      await requireAuth();
      return await handler(request, ...args);
    } catch (error: any) {
      if (error.message === "Unauthorized") {
        return apiError("Unauthorized", 401);
      }
      throw error;
    }
  };
}
