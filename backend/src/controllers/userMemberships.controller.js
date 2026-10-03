import { dbService } from '../data/dbService.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

export async function getUserMemberships(req, res) {
  try {
    const userId = req.user?.userId || req.query.userId || 'usr_demo_customer';
    const memberships = await dbService.getUserMemberships(userId);
    return successResponse(res, memberships, 'User memberships retrieved successfully');
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
}

export async function purchaseUserMembership(req, res) {
  try {
    const userId = req.user?.userId || req.body.userId || 'usr_demo_customer';
    const { clubId, planId, planName, tier, durationMonths, paymentMethod, amount } = req.body;

    if (!clubId || !planName) {
      return errorResponse(res, 'Club and plan name are required', 400);
    }

    const membershipId = `ms_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const purchased = await dbService.purchaseUserMembership({
      id: membershipId,
      userId,
      tenantId: clubId,
      planId,
      planName,
      tier: tier || 'Standard',
      durationMonths: Number(durationMonths) || 12,
      paymentMethod: paymentMethod || 'UPI',
      amount: Number(amount) || 0,
    });

    return successResponse(res, purchased, 'Membership purchased successfully', 201);
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
}
