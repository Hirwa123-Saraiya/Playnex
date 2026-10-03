import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Users,
  CreditCard,
  Sparkles,
  MapPin,
  Calendar,
} from 'lucide-react';
import { useUserStore } from '../../store/userStore';
import { UserPaymentSummary } from '../../components/user/UserPaymentSummary';

export const UserMembershipPurchase: React.FC = () => {
  const {
    clubs,
    membershipPlans,
    familyMembers,
    membershipWizard,
    updateMembershipWizard,
    confirmMembershipPurchase,
    setActiveView,
  } = useUserStore();

  const [isProcessing, setIsProcessing] = useState(false);

  const selectedClub = clubs.find((c) => c.id === membershipWizard.clubId) || clubs[0];
  const clubPlans = membershipPlans.filter((p) => p.clubId === selectedClub.id);
  const selectedPlan =
    membershipPlans.find((p) => p.id === membershipWizard.planId) || clubPlans[0] || membershipPlans[0];

  const currentStep = membershipWizard.step || 1;

  const handleNext = () => {
    updateMembershipWizard({ step: Math.min(5, currentStep + 1) });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrev = () => {
    updateMembershipWizard({ step: Math.max(1, currentStep - 1) });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePay = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      confirmMembershipPurchase();
      setActiveView('memberships');
    }, 900);
  };

  const calculateAmount = () => {
    if (membershipWizard.durationMonths === 12) return selectedPlan.priceAnnual;
    if (membershipWizard.durationMonths === 3) return selectedPlan.priceQuarterly;
    return selectedPlan.priceMonthly;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Progress header */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-slate-900">
            Membership Checkout • Step {currentStep} of 5
          </span>
          <span className="text-blue-600 font-semibold">Instant Pass Generation</span>
        </div>

        <div className="grid grid-cols-5 gap-2">
          {['Club', 'Plan', 'Duration', 'Family', 'Payment'].map((s, idx) => (
            <div
              key={s}
              className={`h-2 rounded-full transition-all ${
                idx + 1 < currentStep
                  ? 'bg-emerald-500'
                  : idx + 1 === currentStep
                  ? 'bg-blue-600 ring-2 ring-blue-300'
                  : 'bg-slate-100'
              }`}
            />
          ))}
        </div>
      </div>

      {/* STEP 1: SELECT CLUB */}
      {currentStep === 1 && (
        <div className="space-y-6 animate-in fade-in">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Step 1: Select Club</h2>
            <p className="text-xs text-slate-500">Choose which club membership pass you want to acquire.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {clubs.map((c) => (
              <div
                key={c.id}
                onClick={() => {
                  const firstPlan = membershipPlans.find((p) => p.clubId === c.id);
                  updateMembershipWizard({
                    clubId: c.id,
                    planId: firstPlan ? firstPlan.id : membershipWizard.planId,
                  });
                }}
                className={`p-4 rounded-2xl border cursor-pointer flex items-center gap-3 transition-all ${
                  membershipWizard.clubId === c.id
                    ? 'border-blue-600 bg-blue-50/50 shadow-md ring-2 ring-blue-200'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <img src={c.heroImage} alt={c.name} className="w-14 h-14 rounded-xl object-cover" />
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-slate-900 truncate">{c.name}</h4>
                  <span className="text-[11px] text-slate-500">{c.city}</span>
                </div>
                {membershipWizard.clubId === c.id && <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" />}
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-4">
            <button
              onClick={handleNext}
              className="px-6 py-2.5 bg-blue-600 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5"
            >
              <span>Next: Select Plan</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: SELECT PLAN */}
      {currentStep === 2 && (
        <div className="space-y-6 animate-in fade-in">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Step 2: Select Tier for {selectedClub.name}
            </h2>
            <p className="text-xs text-slate-500">Pick from Silver, Gold, Platinum, or Family passes.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {clubPlans.map((plan) => (
              <div
                key={plan.id}
                onClick={() => updateMembershipWizard({ planId: plan.id })}
                className={`p-5 rounded-2xl border cursor-pointer transition-all space-y-3 ${
                  membershipWizard.planId === plan.id
                    ? 'border-blue-600 bg-blue-50/50 shadow-md ring-2 ring-blue-200'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 uppercase">
                    {plan.tier} Tier
                  </span>
                  <span className="text-sm font-black text-slate-900">₹{plan.priceAnnual}/yr</span>
                </div>
                <h4 className="text-sm font-bold text-slate-900">{plan.name}</h4>
                <p className="text-xs text-slate-500 leading-relaxed">{plan.tagline}</p>
                <div className="text-[11px] text-slate-600 space-y-1 pt-2 border-t border-slate-200/50">
                  {plan.includedFacilities.slice(0, 3).map((f) => (
                    <div key={f}>• {f}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between pt-4">
            <button onClick={handlePrev} className="px-5 py-2.5 border border-slate-200 text-xs font-semibold rounded-xl">
              Back
            </button>
            <button onClick={handleNext} className="px-6 py-2.5 bg-blue-600 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5">
              <span>Next: Select Duration</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: SELECT DURATION */}
      {currentStep === 3 && (
        <div className="space-y-6 animate-in fade-in">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Step 3: Select Validity & Billing Cycle</h2>
            <p className="text-xs text-slate-500">Annual passes include up to 25% savings and complimentary guest passes.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { months: 1, label: 'Monthly Pass', price: selectedPlan.priceMonthly, save: '' },
              { months: 3, label: 'Quarterly Pass', price: selectedPlan.priceQuarterly, save: 'Save 10%' },
              { months: 12, label: 'Annual Pass', price: selectedPlan.priceAnnual, save: 'Best Value • Save 25%' },
            ].map((dur) => (
              <div
                key={dur.months}
                onClick={() => updateMembershipWizard({ durationMonths: dur.months })}
                className={`p-5 rounded-2xl border cursor-pointer text-center space-y-3 transition-all ${
                  membershipWizard.durationMonths === dur.months
                    ? 'border-blue-600 bg-blue-50/50 shadow-md ring-2 ring-blue-200'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                {dur.save && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    {dur.save}
                  </span>
                )}
                <h4 className="text-sm font-bold text-slate-900">{dur.label}</h4>
                <div className="text-2xl font-black text-slate-900">₹{dur.price}</div>
                <p className="text-[11px] text-slate-500">Instant activation</p>
              </div>
            ))}
          </div>

          <div className="flex justify-between pt-4">
            <button onClick={handlePrev} className="px-5 py-2.5 border border-slate-200 text-xs font-semibold rounded-xl">
              Back
            </button>
            <button onClick={handleNext} className="px-6 py-2.5 bg-blue-600 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5">
              <span>Next: Family Add-Ons</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: ADD FAMILY MEMBERS */}
      {currentStep === 4 && (
        <div className="space-y-6 animate-in fade-in">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Step 4: Link Family Members (Optional)</h2>
            <p className="text-xs text-slate-500">
              Grant biometric and turnstile access for your spouse and children under this membership pass.
            </p>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-3">
            {familyMembers.map((fam) => {
              const isIncluded = membershipWizard.linkedFamilyNames.includes(`${fam.name} (${fam.relation})`);
              return (
                <label
                  key={fam.id}
                  className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition-all ${
                    isIncluded ? 'border-blue-600 bg-blue-50/50' : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={isIncluded}
                      onChange={(e) => {
                        const tag = `${fam.name} (${fam.relation})`;
                        const current = membershipWizard.linkedFamilyNames;
                        updateMembershipWizard({
                          linkedFamilyNames: e.target.checked
                            ? [...current, tag]
                            : current.filter((t) => t !== tag),
                        });
                      }}
                      className="w-4 h-4 rounded text-blue-600 border-slate-300"
                    />
                    <img src={fam.avatarUrl} alt={fam.name} className="w-10 h-10 rounded-full object-cover" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{fam.name}</h4>
                      <span className="text-[11px] text-slate-500">{fam.relation} • {fam.age} yrs</span>
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                    Included with Pass
                  </span>
                </label>
              );
            })}
          </div>

          <div className="flex justify-between pt-4">
            <button onClick={handlePrev} className="px-5 py-2.5 border border-slate-200 text-xs font-semibold rounded-xl">
              Back
            </button>
            <button onClick={handleNext} className="px-6 py-2.5 bg-blue-600 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5">
              <span>Proceed to Checkout</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: PAYMENT & ACTIVATION */}
      {currentStep === 5 && (
        <div className="space-y-6 animate-in fade-in">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Step 5: Membership Checkout</h2>
            <p className="text-xs text-slate-500">Pay securely to activate your multi-club access pass.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-4">
              <h4 className="text-xs font-bold uppercase text-slate-400">Membership Summary</h4>
              <div className="space-y-2 text-xs text-slate-700">
                <div className="flex justify-between">
                  <span className="text-slate-400">Club:</span>
                  <span className="font-bold text-slate-900">{selectedClub.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Plan:</span>
                  <span className="font-bold text-slate-900">{selectedPlan.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Duration:</span>
                  <span className="font-bold text-slate-900">{membershipWizard.durationMonths} Months</span>
                </div>
                {membershipWizard.linkedFamilyNames.length > 0 && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">Family Members:</span>
                    <span className="font-bold text-slate-900">{membershipWizard.linkedFamilyNames.length} Linked</span>
                  </div>
                )}
              </div>
            </div>

            <UserPaymentSummary
              amount={calculateAmount()}
              selectedMethod={membershipWizard.paymentMethod}
              onSelectMethod={(method) => updateMembershipWizard({ paymentMethod: method })}
              onPay={handlePay}
              isProcessing={isProcessing}
            />
          </div>
        </div>
      )}
    </div>
  );
};
