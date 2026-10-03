export const DEFAULT_WORKSTATIONS = [
  { roleName: 'Shop Manager', emailSlug: 'shop', targetModule: 'Standalone Pro Shop Suite', permissions: ['shop:create', 'shop:read', 'shop:update', 'shop:stock', 'shop:sell', 'inventory:audit', 'gst:invoice'] },
  { roleName: 'Bar Manager', emailSlug: 'bar', targetModule: 'Standalone Bar & Kitchen POS', permissions: ['bar:create', 'bar:read', 'bar:update', 'bar:settle', 'bar:void', 'kot:dispatch'] },
  { roleName: 'Front Desk', emailSlug: 'frontdesk', targetModule: 'Standalone Front Desk Station', permissions: ['booking:create', 'booking:read', 'booking:update', 'booking:cancel', 'walkin:checkin', 'member:read'] },
  { roleName: 'Accountant', emailSlug: 'accountant', targetModule: 'Standalone Finance ERP', permissions: ['finance:read', 'finance:invoice', 'finance:payroll', 'finance:tax', 'gst:audit'] },
  { roleName: 'Coach', emailSlug: 'coach', targetModule: 'Standalone Coaching Station', permissions: ['booking:read', 'member:read', 'event:read', 'clinic:schedule'] },
  { roleName: 'HR', emailSlug: 'hr', targetModule: 'Standalone HR Station', permissions: ['staff:read', 'staff:manage', 'staff:schedule', 'staff:approve_leave'] },
  { roleName: 'Groundskeeper', emailSlug: 'grounds', targetModule: 'Standalone Facility Ops Station', permissions: ['facility:read', 'facility:update', 'court:toggle_availability', 'maintenance:log'] },
];

export function buildDefaultStaff(clubName) {
  const clubEmailSlug = clubName.toLowerCase().replace(/[^a-z0-9]/g, '');
  return DEFAULT_WORKSTATIONS.map((workstation) => ({
    ...workstation,
    email: `${workstation.emailSlug}.${clubEmailSlug}@playnex.com`,
    name: workstation.roleName,
  }));
}
