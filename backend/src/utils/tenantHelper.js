/**
 * Helper to resolve the effective tenant ID from authenticated user context or query
 */
export function getTenantId(req) {
  if (req.user?.systemRole === 'SUPER_ADMIN' && req.query.tenantId) {
    return req.query.tenantId;
  }
  return req.user?.tenantId || req.query.tenantId || null;
}
