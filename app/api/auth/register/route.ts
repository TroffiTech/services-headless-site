import { NextRequest, NextResponse } from "next/server";
import { findUserByEmail, createUser } from "@/server_utils/auth/db";
import bcrypt from "bcryptjs";
import { sendWelcomePasswordEmail } from "@/server_utils/mail";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || !email.endsWith("@troffi.ru")) {
      return NextResponse.json(
        { error: "A valid @troffi.ru email is required for registration" },
        { status: 400 }
      );
    }

    const existingUser = await findUserByEmail(email);

    if (existingUser) {
      return NextResponse.json(
        { error: "This email is already registered. Please login or reset your password." },
        { status: 400 }
      );
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

    return NextResponse.json({
      success: true,
      message: "Account created successfully! Your password has been sent to your email.",
    });
  } catch (error: any) {
    console.error("Registration Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
