"use server";

import { redirect } from "next/navigation";
import { destroySession, loginUser, registerUser } from "./auth";

export type FormState = { error: string | null };

export async function registerAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const result = await registerUser({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!result.ok) return { error: result.error };
  redirect("/dashboard");
}

export async function loginAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const result = await loginUser({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!result.ok) return { error: result.error };
  redirect("/dashboard");
}

export async function logoutAction() {
  await destroySession();
  redirect("/");
}
