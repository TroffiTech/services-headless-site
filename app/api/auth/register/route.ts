import { NextRequest, NextResponse } from "next/server";
import { findUserByEmail, createUser } from "@/server_utils/auth/db";
import bcrypt from "bcryptjs";
import { sendWelcomePasswordEmail } from "@/server_utils/mail";
import { RegisterSchema } from "@/server_utils/validation/auth";
import { getClientIp, checkRateLimit } from "@/server_utils/security/rate-limiter";
import { apiResponse, apiError } from "@/server_utils/responses";

export async function POST(request: NextRequest) {
  try {
    // Rate Limiting
    const ip = getClientIp(request);
    if (!checkRateLimit(ip)) {
      return apiError("Too many requests. Please try again in 15 minutes.", 429);
    }

    const body = await request.json();

    // Zod Validation
    const validation = RegisterSchema.safeParse(body);

    if (!validation.success) {
      return apiError(validation.error.issues[0].message, 400);
    }

    const { email } = validation.data;

    const existingUser = await findUserByEmail(email);

    if (existingUser) {
      return apiError("This email is already registered. Please login or reset your password.", 400);
    }

    // Generate secure password
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let password = "";
    for (let i = 0; i < 12; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }

    const passwordHash = await bcrypt.hash(password, 10);

    // Save to DB
    await createUser(email, passwordHash);

    // Send email
    await sendWelcomePasswordEmail(email, password);

    return apiResponse(true, {
      message: "Account created successfully! Your password has been sent to your email.",
    });
  } catch (error: any) {
    console.error("Registration Error:", error);
    return apiError("Internal server error", 500);
  }
}
