import { NextRequest } from "next/server";
import { findUserByEmail, saveUsers, getUsers } from "@/server_utils/auth/db";
import bcrypt from "bcryptjs";
import { sendWelcomePasswordEmail } from "@/server_utils/mail";
import { getClientIp, checkRateLimit } from "@/server_utils/security/rate-limiter";
import { apiResponse, apiError } from "@/server_utils/responses";
import { ForgotPasswordSchema } from "@/server_utils/validation/auth";

export async function POST(request: NextRequest) {
  try {
    // Rate Limiting
    const ip = getClientIp(request);
    if (!checkRateLimit(ip)) {
      return apiError("Too many requests. Please try again in 15 minutes.", 429);
    }

    const body = await request.json();

    // Zod Validation
    const validation = ForgotPasswordSchema.safeParse(body);
    if (!validation.success) {
      return apiError(validation.error.issues[0].message, 400);
    }
    const { email } = validation.data;

    const user = await findUserByEmail(email);

    if (!user) {
      return apiError("User not found. Please register first.", 404);
    }

    // Generate new password
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let newPassword = "";
    for (let i = 0; i < 12; i++) {
      newPassword += charset.charAt(Math.floor(Math.random() * charset.length));
    }

    const newHash = await bcrypt.hash(newPassword, 10);

    // Update user in DB
    const users = await getUsers();
    const updatedUsers = users.map(u =>
      u.email === email ? { ...u, passwordHash: newHash } : u
    );
    await saveUsers(updatedUsers);

    // Send email
    await sendWelcomePasswordEmail(email, newPassword);

    return apiResponse(true, {
      message: "A new password has been sent to your email.",
    });
  } catch (error: any) {
    console.error("Forgot Password Error:", error);
    return apiError("Internal server error", 500);
  }
}
