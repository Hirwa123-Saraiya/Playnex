import { STATUS_COLOR, STATUS_LABEL } from "@/lib/enquiryRules";
import type { EnquiryStatus } from "@/types/enquiry.types";

export function EnquiryStatusBadge({ status }: { status: EnquiryStatus }) {
  return (
    <span
      className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ${STATUS_COLOR[status]}`}
    >
      {STATUS_LABEL[status]}
    </span>
  );
}