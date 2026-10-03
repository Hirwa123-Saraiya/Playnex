"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft, Package, AlertCircle, Info } from "lucide-react";
import { fetchProduct } from "@/services/publicSiteService";
import { inr, isLowStock, isSoldOut } from "@/lib/publicSiteRules";
import type { PublicProduct } from "@/types/publicSite.types";

export default function ProductDetailPage() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : "";
  const [product, setProduct] = useState<PublicProduct | null | undefined>(undefined);

  useEffect(() => {
    fetchProduct(id).then(setProduct);
  }, [id]);

  if (product === undefined) {
    return (
      <div className="mx-auto max-w-3xl p-6 text-sm text-muted">Loading…</div>
    );
  }

  if (product === null) {
    return (
      <div className="mx-auto max-w-3xl space-y-4 p-6">
        <Link href="/shop" className="inline-flex items-center gap-1 text-sm text-muted hover:text-text">
          <ArrowLeft size={14} /> Back to shop
        </Link>
        <div className="rounded-2xl border border-dashed border-line bg-white p-12 text-center">
          <p className="text-lg font-semibold">Product not found</p>
          <p className="mt-1 text-sm text-muted">This item may no longer be available.</p>
        </div>
      </div>
    );
  }

  const soldOut = isSoldOut(product);
  const low = isLowStock(product);

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-4 md:p-8">
      <Link href="/shop" className="inline-flex items-center gap-1 text-sm text-muted hover:text-text">
        <ArrowLeft size={14} /> Back to shop
      </Link>

      <div className="rounded-2xl border border-line bg-white p-6 sm:p-8">
        <div className="flex items-start gap-4">
          <span className="grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-moss/10 text-moss">
            <Package size={24} />
          </span>
          <div className="min-w-0 flex-1">
            {product.brand && (
              <div className="text-[11px] font-medium uppercase tracking-wide text-muted">
                {product.brand}
              </div>
            )}
            <h1 className="mt-0.5 text-2xl font-bold leading-tight">{product.name}</h1>
            <p className="mt-1 text-sm text-muted">{product.category}</p>
          </div>
        </div>

        <p className="mt-6 text-sm">{product.description}</p>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <div className="text-3xl font-bold">{inr(product.basePrice)}</div>
          {soldOut ? (
            <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-800">
              Sold out
            </span>
          ) : low ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800">
              <AlertCircle size={12} /> Only {product.stock} left
            </span>
          ) : (
            <span className="rounded-full bg-lime/40 px-3 py-1 text-xs font-medium text-moss">
              In stock · {product.stock}
            </span>
          )}
        </div>

        <div className="mt-6 rounded-lg bg-sand/60 p-4 text-sm">
          <div className="flex items-start gap-2">
            <Info size={14} className="mt-0.5 shrink-0 text-moss" />
            <div>
              <div className="font-semibold">Member pricing</div>
              <ul className="mt-2 space-y-1 text-xs text-muted">
                <li>Gold members: <span className="font-semibold text-text">30% off</span></li>
                <li>Silver members: <span className="font-semibold text-text">15% off</span></li>
                <li>Junior members: <span className="font-semibold text-text">20% off</span></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          {soldOut ? (
            <button
              disabled
              className="cursor-not-allowed rounded-lg bg-line px-5 py-3 text-sm font-semibold text-muted"
            >
              Out of stock
            </button>
          ) : (
            <Link
              href={`/trial?product=${product.id}`}
              className="inline-flex items-center gap-2 rounded-lg bg-moss px-5 py-3 text-sm font-semibold text-white hover:bg-mossDark"
            >
              Enquire about this item
            </Link>
          )}
          <Link
            href="/plans"
            className="inline-flex items-center gap-2 rounded-lg border border-line bg-white px-5 py-3 text-sm font-medium hover:border-moss/40"
          >
            See membership plans
          </Link>
        </div>
      </div>
    </div>
  );
}