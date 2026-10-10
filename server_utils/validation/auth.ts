import { z } from "zod";

export const AuthSchema = {
  email: z.string().email("Invalid email format").refine((email) => email.endsWith("@troffi.ru"), {
    message: "Only @troffi.ru emails are authorized",
  }),
  password: z.string().min(6, "Password must be at least 6 characters long"),
};

export const RegisterSchema = z.object({
  email: AuthSchema.email,
});

export const ForgotPasswordSchema = z.object({
  email: AuthSchema.email,
});

export const LoginSchema = z.object({
  email: AuthSchema.email,
  password: AuthSchema.password,
});

export type RegisterInput = z.infer<typeof RegisterSchema>;
export type ForgotPasswordInput = z.infer<typeof ForgotPasswordSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
