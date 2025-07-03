// app/lib/auth/authUtils.ts
export function getAuthFromLocalStorage() {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  return { token, role };
}

export function isAuthenticated(token: string | null) {
  return !!token; // In real case, validate JWT
}

export function hasRole(role: string | null, required: string) {
  return role === required;
}
