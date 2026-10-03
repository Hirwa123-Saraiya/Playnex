import { dbService } from '../data/dbService.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

export async function getUserClubs(req, res) {
  try {
    const { city, sport, search } = req.query;
    const clubs = await dbService.getUserClubs({ city, sport, search });
    return successResponse(res, clubs, 'User clubs retrieved successfully');
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
}

export async function getUserClubDetails(req, res) {
  try {
    const { id } = req.params;
    const club = await dbService.getUserClubDetails(id);
    if (!club) return errorResponse(res, 'Club not found', 404);
    return successResponse(res, club, 'Club details retrieved successfully');
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
}
