import { dbService } from '../data/dbService.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

export async function getUserFacilities(req, res) {
  try {
    const { clubId, sport } = req.query;
    const facilities = await dbService.getUserFacilities({ clubId, sport });
    return successResponse(res, facilities, 'Facilities retrieved successfully');
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
}
