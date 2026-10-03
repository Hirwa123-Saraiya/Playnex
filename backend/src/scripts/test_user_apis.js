async function testCRUD() {
  const userId = 'usr_demo_customer';
  const tenantId = 'tenant_1791026940545';
  const facilityId = 'fac_tenant_1791026940545_badminton_1';

  console.log('--- Testing User Portal Endpoints ---');

  // 1. Create booking
  const bRes = await fetch('http://localhost:8000/api/v1/user/bookings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      clubId: tenantId,
      facilityId,
      userId,
      memberName: 'Demo Customer',
      bookingDate: '2026-10-10',
      startTime: '08:00:00',
      endTime: '09:00:00',
      totalPrice: 650,
      paymentStatus: 'paid',
      courtName: 'Olympic Badminton Arena 1'
    })
  }).then(r => r.json());
  console.log('1. Booking Create:', bRes.success ? `SUCCESS (Booking ID: ${bRes.data.id})` : bRes.message);

  const bookingId = bRes.data ? bRes.data.id : null;

  // 2. Get my bookings
  const myBRes = await fetch('http://localhost:8000/api/v1/user/bookings?userId=' + userId).then(r => r.json());
  console.log('2. My Bookings:', myBRes.success ? `SUCCESS (Count: ${myBRes.data.length})` : myBRes.message);

  // 3. Cancel booking
  if (bookingId) {
    const cRes = await fetch(`http://localhost:8000/api/v1/user/bookings/${bookingId}/cancel?userId=${userId}`, {
      method: 'PATCH',
    }).then(r => r.json());
    console.log('3. Cancel Booking:', cRes.success ? `SUCCESS (Status: ${cRes.data.status})` : cRes.message);
  }

  // 4. Purchase membership
  const mRes = await fetch('http://localhost:8000/api/v1/user/memberships/purchase', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userId,
      clubId: tenantId,
      planId: 'plan_tenant_1791026940545_gold',
      planName: 'Gold All-Access Club Membership',
      tier: 'Gold',
      durationMonths: 3,
      paymentMethod: 'UPI',
      amount: 5999
    })
  }).then(r => r.json());
  console.log('4. Purchase Membership:', mRes.success ? `SUCCESS (ID: ${mRes.data.id})` : mRes.message);

  // 5. Get my memberships
  const myMRes = await fetch('http://localhost:8000/api/v1/user/memberships?userId=' + userId).then(r => r.json());
  console.log('5. My Memberships:', myMRes.success ? `SUCCESS (Count: ${myMRes.data.length})` : myMRes.message);

  // 6. Add Family member
  const famRes = await fetch('http://localhost:8000/api/v1/user/profile/family', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userId,
      name: 'Rohan Sharma',
      relation: 'Son',
      age: 12
    })
  }).then(r => r.json());
  console.log('6. Add Family Member:', famRes.success ? `SUCCESS (ID: ${famRes.data.id}, Name: ${famRes.data.name})` : famRes.message);

  const familyMemberId = famRes.data ? famRes.data.id : null;

  // 7. Get Family members
  const myFam = await fetch('http://localhost:8000/api/v1/user/profile/family?userId=' + userId).then(r => r.json());
  console.log('7. Family Members List:', myFam.success ? `SUCCESS (Count: ${myFam.data.length})` : myFam.message);

  // 8. Delete Family member
  if (familyMemberId) {
    const delFam = await fetch(`http://localhost:8000/api/v1/user/profile/family/${familyMemberId}?userId=${userId}`, {
      method: 'DELETE',
    }).then(r => r.json());
    console.log('8. Delete Family Member:', delFam.success ? `SUCCESS (Deleted ID: ${delFam.data.id})` : delFam.message);
  }

  // 9. Add Review
  const revRes = await fetch('http://localhost:8000/api/v1/user/profile/reviews', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      clubId: tenantId,
      userId,
      userName: 'Demo Customer',
      rating: 5,
      comment: 'Super fast courts and world-class hospitality!'
    })
  }).then(r => r.json());
  console.log('9. Add Review:', revRes.success ? `SUCCESS (Rating: ${revRes.data.rating}/5)` : revRes.message);
}

testCRUD().catch(console.error);
