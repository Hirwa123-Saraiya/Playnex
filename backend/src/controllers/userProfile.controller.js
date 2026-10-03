import { dbService } from '../data/dbService.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

export async function getFamilyMembers(req, res) {
  try {
    const userId = req.user?.userId || req.query.userId || 'usr_demo_customer';
    const members = await dbService.getFamilyMembers(userId);
    return successResponse(res, members, 'Family members retrieved successfully');
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
}

export async function addFamilyMember(req, res) {
  try {
    const userId = req.user?.userId || req.body.userId || 'usr_demo_customer';
    const { name, relation, age } = req.body;
    if (!name || !relation) {
      return errorResponse(res, 'Name and relation are required', 400);
    }

    const id = `fam_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const created = await dbService.addFamilyMember({
      id,
      userId,
      name,
      relation,
      age: Number(age) || null,
    });
    return successResponse(res, created, 'Family member added successfully', 201);
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
}

export async function deleteFamilyMember(req, res) {
  try {
    const userId = req.user?.userId || req.query.userId || 'usr_demo_customer';
    const { id } = req.params;
    const deleted = await dbService.deleteFamilyMember(id, userId);
    if (!deleted) return errorResponse(res, 'Family member not found', 404);
    return successResponse(res, { id }, 'Family member removed successfully');
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
}

export async function addClubReview(req, res) {
  try {
    const userId = req.user?.userId || req.body.userId || null;
    const { clubId, userName, rating, comment } = req.body;
    if (!clubId || !userName || !rating) {
      return errorResponse(res, 'Club ID, user name, and rating are required', 400);
    }

    const id = `rev_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const review = await dbService.addClubReview({
      id,
      tenantId: clubId,
      userId,
      userName,
      rating: Number(rating) || 5,
      comment: comment || '',
    });
    return successResponse(res, review, 'Review submitted successfully', 201);
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
}
