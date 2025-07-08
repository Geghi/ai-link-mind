"use server";

import { createClient } from "../../services/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import * as z from "zod";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export async function login(formData: z.infer<typeof loginSchema>) {
  const validatedFields = loginSchema.safeParse(formData);

  if (!validatedFields.success) {
    return "Invalid fields";
  }

  const { email, password } = validatedFields.data;
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return error.message;
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function signup(formData: z.infer<typeof signupSchema>) {
  const validatedFields = signupSchema.safeParse(formData);

  if (!validatedFields.success) {
    return "Invalid fields";
  }

  const { email, password } = validatedFields.data;
  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/callback`,
    },
  });

  if (error) {
    return error.message;
  }

  revalidatePath("/", "layout");
  redirect("/task-status");
}
