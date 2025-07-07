import Link from "next/link";

export default function AuthCodeError() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md dark:bg-gray-800">
        <h1 className="mb-6 text-center text-3xl font-bold text-red-600 dark:text-red-500">
          Authentication Error
        </h1>
        <p className="mb-6 text-center text-gray-600 dark:text-gray-400">
          There was an error during the authentication process. Please try again.
        </p>
        <Link href="/login" className="block w-full rounded-md bg-blue-600 px-4 py-2 text-center font-medium text-white hover:bg-blue-700">
          
            Return to Login
          
        </Link>
      </div>
    </div>
  );
}
