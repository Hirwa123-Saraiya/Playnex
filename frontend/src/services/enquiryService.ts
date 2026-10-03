import type {
  ConversionResult, CreateEnquiryInput, Enquiry, StaffMember,
  UpdateEnquiryInput,
} from "@/types/enquiry.types";
import { MOCK_ENQUIRIES, STAFF } from "@/mock/enquiryMockData";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1";

/* ============================================================
   Public
   ============================================================ */

/** Public: submit an enquiry from the landing page. */
export async function submitEnquiry(input: CreateEnquiryInput): Promise<Enquiry> {
  // const res = await fetch(`${API}/enquiries`, {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify(input),
  // });
  // if (!res.ok) throw new Error(await res.text());
  // return res.json();

  // Mock:
  return Promise.resolve({
    id: `e-${Date.now()}`,
    tenantId: "t1",
    source: input.source,
    name: input.name,
    email: input.email,
    phone: input.phone,
    preferredContact: input.preferredContact,
    sportInterest: input.sportInterest,
    planInterest: input.planInterest,
    message: input.message,
    status: "New",
    assignedToId: null,
    assignedToName: null,
    followUpAt: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    notes: [],
  });
}

/* ============================================================
   Admin
   ============================================================ */

export async function fetchEnquiries(): Promise<Enquiry[]> {
  // const res = await fetch(`${API}/enquiries`, { credentials: "include" });
  // return res.json();
  return Promise.resolve(MOCK_ENQUIRIES);
}

export async function fetchEnquiry(id: string): Promise<Enquiry | null> {
  // const res = await fetch(`${API}/enquiries/${id}`, { credentials: "include" });
  // if (!res.ok) return null;
  // return res.json();
  return Promise.resolve(MOCK_ENQUIRIES.find((e) => e.id === id) ?? null);
}

export async function fetchStaff(): Promise<StaffMember[]> {
  // const res = await fetch(`${API}/staff`, { credentials: "include" });
  // return res.json();
  return Promise.resolve(STAFF.filter((s) => s.active));
}

export async function updateEnquiry(
  id: string,
  input: UpdateEnquiryInput
): Promise<Enquiry> {
  // const res = await fetch(`${API}/enquiries/${id}`, {
  //   method: "PATCH",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify(input),
  //   credentials: "include",
  // });
  // if (!res.ok) throw new Error(await res.text());
  // return res.json();

  // Mock: return the modified enquiry object
  const base = MOCK_ENQUIRIES.find((e) => e.id === id);
  if (!base) throw new Error("Enquiry not found");
  const updated: Enquiry = {
    ...base,
    ...input,
    assignedToName:
      input.assignedToId === null
        ? null
        : STAFF.find((s) => s.id === input.assignedToId)?.name ?? base.assignedToName,
    updatedAt: new Date().toISOString(),
    notes: input.noteText
      ? [
          ...base.notes,
          {
            id: `n-${Date.now()}`,
            authorId: "s1",
            authorName: "You",
            text: input.noteText,
            createdAt: new Date().toISOString(),
          },
        ]
      : base.notes,
  };
  return Promise.resolve(updated);
}

export async function convertToMember(id: string): Promise<ConversionResult> {
  // const res = await fetch(`${API}/enquiries/${id}/convert`, {
  //   method: "POST",
  //   credentials: "include",
  // });
  // if (!res.ok) throw new Error(await res.text());
  // return res.json();

  // Mock:
  const base = MOCK_ENQUIRIES.find((e) => e.id === id);
  if (!base) throw new Error("Enquiry not found");
  return Promise.resolve({
    memberId: `m-${Date.now()}`,
    memberName: base.name,
    tier: base.planInterest,
  });
}