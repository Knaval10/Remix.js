import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useMatches,
  useRouteError,
} from "@remix-run/react";
import type { LinksFunction } from "@remix-run/node";

import "./tailwind.css";
import Header from "./components/Layout/Header";
import Footer from "./components/Layout/Footer";

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body cz-shortcut-listen="true">
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const matches = useMatches();
  const isAdminRoute = matches.some(
    (match) =>
      match.id?.startsWith("routes/admin") ||
      match.id?.startsWith("routes/login")
  );
  return (
    <>
      {!isAdminRoute && <Header />}
      <Outlet />
      {!isAdminRoute && <Footer />}
    </>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Error Icon */}
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>

          {/* Error Content */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {isRouteErrorResponse(error)
                ? `${error.status} ${error.statusText}`
                : "Something went wrong"}
            </h1>

            <p className="text-gray-600 mb-4">
              {isRouteErrorResponse(error)
                ? error.data || "An error occurred while loading this page."
                : error instanceof Error
                ? error.message
                : "An unexpected error occurred. Please try again."}
            </p>

            {/* Custom messages for different status codes */}
            {isRouteErrorResponse(error) && (
              <div className="text-sm text-gray-500 mb-4">
                {error.status === 404 && (
                  <p>The page you're looking for doesn't exist.</p>
                )}
                {error.status === 403 && (
                  <p>You don't have permission to access this resource.</p>
                )}
                {error.status === 500 && (
                  <p>
                    Something went wrong on our end. Please try again later.
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Try Again
            </button>

            <a
              href="/"
              className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Go to Home
            </a>
          </div>

          {/* Development Mode Error Details */}
          {process.env.NODE_ENV === "development" && error instanceof Error && (
            <details className="mt-6 text-left">
              <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                Show Error Details (Development)
              </summary>
              <pre className="mt-2 text-xs bg-gray-100 p-3 rounded overflow-auto text-red-600">
                {error.stack}
              </pre>
            </details>
          )}
        </div>

        {/* Footer */}
        <p className="mt-6 text-sm text-gray-500">
          If the problem persists, please{" "}
          <a
            href="mailto:support@yourapp.com"
            className="text-blue-600 hover:underline"
          >
            contact support
          </a>
        </p>
      </div>
    </div>
  );
}
