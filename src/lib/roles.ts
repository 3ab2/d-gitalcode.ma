export function isClientRole(role?: string | null): boolean {
  return role === "CLIENT" || role === "USER";
}

export function isAdminRole(role?: string | null): boolean {
  return role === "ADMIN";
}
