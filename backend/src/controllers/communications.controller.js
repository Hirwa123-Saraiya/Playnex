import { dbService } from '../data/dbService.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import { getTenantId } from '../utils/tenantHelper.js';

export async function getAnnouncements(req, res) {
  try {
    const tenantId = getTenantId(req);
    if (!tenantId) return errorResponse(res, 'Tenant context missing', 400);
    const announcements = await dbService.getAnnouncementsByTenant(tenantId);
    return successResponse(res, announcements, 'Announcements retrieved successfully');
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
}

export async function createAnnouncement(req, res) {
  try {
    const tenantId = getTenantId(req);
    if (!tenantId) return errorResponse(res, 'Tenant context missing', 400);
    const { title, message, targetAudience } = req.body;
    if (!title || !message) return errorResponse(res, 'Title and message are required', 400);

    const announcementId = `ann_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const created = await dbService.createAnnouncement({
      announcementId,
      tenantId,
      title,
      message,
      targetAudience: targetAudience || 'all',
    });
    return successResponse(res, created, 'Announcement broadcasted successfully', 201);
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
}

export async function deleteAnnouncement(req, res) {
  try {
    const tenantId = getTenantId(req);
    const { id } = req.params;
    const deleted = await dbService.deleteAnnouncement(id, tenantId);
    if (!deleted) return errorResponse(res, 'Announcement not found', 404);
    return successResponse(res, { id }, 'Announcement deleted successfully');
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
}
