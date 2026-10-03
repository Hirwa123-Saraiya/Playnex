import { validateBookingInput, isSocialPlaySlot } from '../utils/bookingRules.js';
import { errorResponse } from '../utils/apiResponse.js';

export function validateCreateBooking(req, res, next) {
  const err = validateBookingInput(req.body);
  if (err) return errorResponse(res, err, 400);

  if (req.body.mode === 'SocialPlay') {
    const date = req.body.date || req.body.bookingDate;
    if (!isSocialPlaySlot(date, req.body.startTime)) {
      return errorResponse(
        res,
        'Social play is only allowed on Friday evenings (18:00–22:00).',
        400
      );
    }
  }
  next();
}

export function validateIdParam(req, res, next) {
  const id = req.params.id;
  if (!id || typeof id !== 'string' || id.length > 64) {
    return errorResponse(res, 'Invalid id', 400);
  }
  next();
}