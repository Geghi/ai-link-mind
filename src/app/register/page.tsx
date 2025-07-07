import { RegisterForm } from "@/components/auth/RegisterForm";
import Link from "next/link";

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center text-center w-full text-white p-4 sm:p-8 lg:p-12">
      <div className="w-full max-w-md relative flex flex-col gap-4 rounded-xl border bg-background/80 p-6 shadow-2xl shadow-primary/10 backdrop-blur-sm">
        <h1 className="mb-6 text-center text-3xl font-bold text-gray-100">
          Register
        </h1>
        <RegisterForm />
        <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-blue-600 hover:underline dark:text-blue-500">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
