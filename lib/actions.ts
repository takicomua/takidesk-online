"use server";

import { redirect } from "next/navigation";
import { destroySession, loginUser, registerUser } from "./auth";

export async function registerAction(formData: FormData) {
  const result = await registerUser({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!result.ok) {
    redirect(`/register?error=${encodeURIComponent(result.error)}`);
  }

  redirect("/dashboard");
}

export async function loginAction(formData: FormData) {
  const result = await loginUser({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!result.ok) {
    redirect(`/login?error=${encodeURIComponent(result.error)}`);
  }

  redirect("/dashboard");
}

export async function logoutAction() {
  await destroySession();
  redirect("/");
}
