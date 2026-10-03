import { dbService } from '../data/dbService.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import { getTenantId } from '../utils/tenantHelper.js';

export async function getAllEvents(req, res) {
  try {
    const events = await dbService.getAllEvents();
    return successResponse(res, events, 'All platform events retrieved successfully');
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
}

export async function getEvents(req, res) {
  try {
    const tenantId = getTenantId(req);
    if (!tenantId) return errorResponse(res, 'Tenant context missing', 400);
    const events = await dbService.getEventsByTenant(tenantId);
    return successResponse(res, events, 'Events retrieved successfully');
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
}

export async function createEvent(req, res) {
  try {
    const tenantId = getTenantId(req);
    if (!tenantId) return errorResponse(res, 'Tenant context missing', 400);
    const { title, description, sport, eventDate, startTime, endTime, entryFee, maxParticipants } = req.body;
    if (!title || !eventDate || !startTime || !endTime) {
      return errorResponse(res, 'Title, event date, start time, and end time are required', 400);
    }

    const eventId = `evt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const created = await dbService.createEvent({
      eventId,
      tenantId,
      title,
      description,
      sport,
      eventDate,
      startTime,
      endTime,
      entryFee: Number(entryFee) || 0,
      maxParticipants: Number(maxParticipants) || 32,
    });
    return successResponse(res, created, 'Event created successfully', 201);
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
}

export async function updateEvent(req, res) {
  try {
    const tenantId = getTenantId(req);
    const { id } = req.params;
    const updated = await dbService.updateEvent(id, tenantId, req.body);
    if (!updated) return errorResponse(res, 'Event not found', 404);
    return successResponse(res, updated, 'Event updated successfully');
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
}

export async function deleteEvent(req, res) {
  try {
    const tenantId = getTenantId(req);
    const { id } = req.params;
    const deleted = await dbService.deleteEvent(id, tenantId);
    if (!deleted) return errorResponse(res, 'Event not found', 404);
    return successResponse(res, { id }, 'Event deleted successfully');
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
}
