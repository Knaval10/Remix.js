// app/routes/admin/login.tsx
import { json } from "@remix-run/node";
import { Form, useActionData, useNavigation } from "@remix-run/react";
import type { ActionFunction } from "@remix-run/node";

type ActionData = {
  error?: string;
  fieldErrors?: {
    email?: string;
    password?: string;
  };
  token?: string;
  userType?: string;
  userId?: string;
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const email = String(formData.get("email") || "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") || "").trim();

  // Validation
  const fieldErrors: ActionData["fieldErrors"] = {};
  if (!email) {
    fieldErrors.email = "Email is required";
  } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
    fieldErrors.email = "Invalid email format";
  }
  if (!password) {
    fieldErrors.password = "Password is required";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return json<ActionData>({ fieldErrors });
  }

  // API call
  try {
    const res = await fetch(
      "https://lunch-attendance.dev.techcolab.org/api/v1/user/login/",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: email, password }),
      }
    );

    if (!res.ok) {
      return json<ActionData>(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const data = await res.json();

    if (!data?.token || data?.user?.user_type !== "ADMIN") {
      return json<ActionData>(
        { error: "Unauthorized access: Only admins allowed" },
        { status: 403 }
      );
    }

    return json<ActionData>({
      token: data.token,
      userType: data.user.user_type,
      userId: data.user.id,
    });
  } catch {
    return json<ActionData>(
      { error: "Server error. Please try again." },
      { status: 500 }
    );
  }
};

export default function AdminLogin() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();

  if (
    typeof document !== "undefined" &&
    actionData?.token &&
    actionData?.userType === "ADMIN"
  ) {
    localStorage.setItem("authToken", actionData.token);
    localStorage.setItem("userType", actionData.userType);
    localStorage.setItem("userId", actionData.userId ?? "");
    window.location.href = "/admin";
  }

  return (
    <div className="flex items-center min-h-screen">
      <div className="max-w-sm mx-auto h-fit mt-10 p-6 border rounded shadow">
        <h1 className="text-xl font-bold mb-4 text-center">Admin Login</h1>

        {actionData?.error && (
          <div className="mb-4 text-red-600 bg-red-50 p-2 rounded text-sm border border-red-300">
            {actionData.error}
          </div>
        )}

        <Form method="post" className="space-y-5">
          <div>
            <label htmlFor="email" className="block mb-1 font-medium">
              Email
            </label>
            <input
              name="email"
              type="email"
              className="w-full border p-2 rounded"
            />
            {actionData?.fieldErrors?.email && (
              <p className="text-red-500 text-sm mt-1">
                {actionData.fieldErrors.email}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block mb-1 font-medium">
              Password
            </label>
            <input
              name="password"
              type="password"
              className="w-full border p-2 rounded"
            />
            {actionData?.fieldErrors?.password && (
              <p className="text-red-500 text-sm mt-1">
                {actionData.fieldErrors.password}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 transition"
            disabled={navigation.state === "submitting"}
          >
            {navigation.state === "submitting" ? "Logging in..." : "Login"}
          </button>
        </Form>
      </div>
    </div>
  );
}
