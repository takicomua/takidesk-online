"use server";

import { redirect } from "next/navigation";
import { destroySession, loginUser, registerUser, setFlash } from "./auth";

export async function registerAction(formData: FormData) {
  const result = await registerUser({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!result.ok) {
    await setFlash(result.error);
    redirect("/register");
  }

  redirect("/dashboard");
}

export async function loginAction(formData: FormData) {
  const result = await loginUser({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!result.ok) {
    await setFlash(result.error);
    redirect("/login");
  }

  redirect("/dashboard");
}

export async function logoutAction() {
  await destroySession();
  redirect("/");
}
