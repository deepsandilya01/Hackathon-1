export function getDashboardPath(role) {
  return String(role).trim().toLowerCase() === 'staff'
    ? '/staff/dashboard'
    : '/user/dashboard';
}
