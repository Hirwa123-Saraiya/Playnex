import Link from "next/link";
import { Package, AlertCircle } from "lucide-react";
import { inr, isLowStock, isSoldOut } from "@/lib/publicSiteRules";
import type { PublicProduct } from "@/types/publicSite.types";

export function ShopProductCard({
  product, memberDiscount,
}: {
  product: PublicProduct;
  memberDiscount?: number;
}) {
  const soldOut = isSoldOut(product);
  const low = isLowStock(product);
  const discounted =
    memberDiscount && memberDiscount > 0
      ? Math.round(product.basePrice * (1 - memberDiscount / 100))
      : null;

  return (
    <Link
      href={`/shop/${product.id}`}
      className="group flex flex-col rounded-xl border border-line bg-card p-4 transition-shadow hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-2">
        <span className="grid h-10 w-10 place-items-center rounded-lg bg-moss/10 text-moss">
          <Package size={18} />
        </span>
        {soldOut ? (
          <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-medium text-red-800">
            Sold out
          </span>
        ) : low ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-medium text-amber-800">
            <AlertCircle size={10} /> Low stock
          </span>
        ) : null}
      </div>

      <div className="mt-3 flex-1">
        {product.brand && (
          <div className="text-[11px] font-medium uppercase tracking-wide text-muted">
            {product.brand}
          </div>
        )}
        <div className="mt-0.5 line-clamp-2 font-semibold leading-snug group-hover:underline">
          {product.name}
        </div>
        <p className="mt-1 line-clamp-2 text-xs text-muted">{product.description}</p>
      </div>

      <div className="mt-3 border-t border-line pt-3">
        {discounted ? (
          <div className="flex items-baseline gap-2">
            <span className="text-base font-bold">{inr(discounted)}</span>
            <span className="text-xs text-muted line-through">
              {inr(product.basePrice)}
            </span>
            <span className="ml-auto rounded-full bg-lime/40 px-2 py-0.5 text-[10px] font-semibold text-moss">
              Member price
            </span>
          </div>
        ) : (
          <div className="text-base font-bold">{inr(product.basePrice)}</div>
        )}
      </div>
    </Link>
  );
}