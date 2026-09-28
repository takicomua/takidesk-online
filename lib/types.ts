import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().trim().min(2, "Мінімум 2 символи").max(60),
  email: z.string().trim().email("Некоректний email").max(120),
  password: z
    .string()
    .min(8, "Мінімум 8 символів")
    .max(128)
    .refine((v) => /[A-Za-z]/.test(v) && /\d/.test(v), {
      message: "Пароль має містити літери та цифри",
    }),
});

export const loginSchema = z.object({
  email: z.string().trim().email("Некоректний email"),
  password: z.string().min(1, "Введіть пароль"),
});

export type UserRecord = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: string;
};

export type PublicUser = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
};

export type UsersFile = {
  users: UserRecord[];
};
