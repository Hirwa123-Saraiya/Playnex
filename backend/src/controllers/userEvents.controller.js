import { dbService } from '../data/dbService.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

export async function getUserEvents(req, res) {
  try {
    const events = await dbService.getAllEvents();
    return successResponse(res, events, 'Platform events retrieved successfully');
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
}

export async function registerForEvent(req, res) {
  try {
    const { id } = req.params;
    const updated = await dbService.registerEventParticipant(id);
    if (!updated) return errorResponse(res, 'Event not found', 404);
    return successResponse(res, updated, 'Event registration confirmed');
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
}
