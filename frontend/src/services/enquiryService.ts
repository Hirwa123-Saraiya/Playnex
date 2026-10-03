import type {
  ConversionResult, CreateEnquiryInput, Enquiry, StaffMember,
  UpdateEnquiryInput,
} from "@/types/enquiry.types";
import { MOCK_ENQUIRIES, STAFF } from "@/mock/enquiryMockData";

const STORAGE_KEY = "playnex_enquiries_v1";

function getEnquiriesStore(): Enquiry[] {
  if (typeof window === "undefined") return MOCK_ENQUIRIES;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_ENQUIRIES));
      return MOCK_ENQUIRIES;
    }
    return JSON.parse(raw);
  } catch {
    return MOCK_ENQUIRIES;
  }
}

function saveEnquiriesStore(list: Enquiry[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch (err) {
    console.error("Failed to save enquiries to storage:", err);
  }
}

/* ============================================================
   Public
   ============================================================ */

/** Public: submit an enquiry from the landing page or trial form. */
export async function submitEnquiry(input: CreateEnquiryInput): Promise<Enquiry> {
  const current = getEnquiriesStore();
  const newEnquiry: Enquiry = {
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
    followUpAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24-hr response SLA
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    notes: [],
  };

  const updatedList = [newEnquiry, ...current];
  saveEnquiriesStore(updatedList);
  return Promise.resolve(newEnquiry);
}

/* ============================================================
   Admin
   ============================================================ */

export async function fetchEnquiries(): Promise<Enquiry[]> {
  return Promise.resolve(getEnquiriesStore());
}

export async function fetchEnquiry(id: string): Promise<Enquiry | null> {
  const list = getEnquiriesStore();
  return Promise.resolve(list.find((e) => e.id === id) ?? null);
}

export async function fetchStaff(): Promise<StaffMember[]> {
  return Promise.resolve(STAFF.filter((s) => s.active));
}

export async function updateEnquiry(
  id: string,
  input: UpdateEnquiryInput
): Promise<Enquiry> {
  const list = getEnquiriesStore();
  const idx = list.findIndex((e) => e.id === id);
  if (idx === -1) throw new Error("Enquiry not found");

  const base = list[idx];
  const updated: Enquiry = {
    ...base,
    ...input,
    assignedToName:
      input.assignedToId === null
        ? null
        : input.assignedToId
          ? STAFF.find((s) => s.id === input.assignedToId)?.name ?? base.assignedToName
          : base.assignedToName,
    updatedAt: new Date().toISOString(),
    notes: input.noteText
      ? [
          ...base.notes,
          {
            id: `n-${Date.now()}`,
            authorId: "s1",
            authorName: "Staff Reception",
            text: input.noteText,
            createdAt: new Date().toISOString(),
          },
        ]
      : base.notes,
  };

  list[idx] = updated;
  saveEnquiriesStore(list);
  return Promise.resolve(updated);
}

export async function convertToMember(id: string): Promise<ConversionResult> {
  const list = getEnquiriesStore();
  const idx = list.findIndex((e) => e.id === id);
  if (idx === -1) throw new Error("Enquiry not found");

  const base = list[idx];
  base.status = "Converted";
  base.updatedAt = new Date().toISOString();
  list[idx] = base;
  saveEnquiriesStore(list);

  return Promise.resolve({
    memberId: `m-${Date.now()}`,
    memberName: base.name,
    tier: base.planInterest,
  });
}