import { NextRequest, NextResponse } from "next/server";
import { findUserByEmail, saveUsers, getUsers } from "@/server_utils/auth/db";
import bcrypt from "bcryptjs";
import { sendWelcomePasswordEmail } from "@/server_utils/mail";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || !email.endsWith("@troffi.ru")) {
      return NextResponse.json(
        { error: "A valid @troffi.ru email is required" },
        { status: 400 }
      );
    }

    const user = await findUserByEmail(email);

    if (!user) {
      return NextResponse.json(
        { error: "User not found. Please register first." },
        { status: 404 }
      );
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

    return NextResponse.json({
      success: true,
      message: "A new password has been sent to your email.",
    });
  } catch (error: any) {
    console.error("Forgot Password Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
