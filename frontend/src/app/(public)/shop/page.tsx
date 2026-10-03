"use client";

import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { ShopProductCard } from "@/components/public/ShopProductCard";
import { fetchProducts } from "@/services/publicSiteService";
import { PRODUCT_CATEGORIES } from "@/mock/publicSiteMockData";
import type { ProductCategory, PublicProduct } from "@/types/publicSite.types";

export default function ShopPage() {
  const [products, setProducts] = useState<PublicProduct[]>([]);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<"All" | ProductCategory>("All");

  useEffect(() => {
    fetchProducts().then(setProducts);
  }, []);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (category !== "All" && p.category !== category) return false;
      if (!query) return true;
      const q = query.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        (p.brand ?? "").toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      );
    });
  }, [products, query, category]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-16">
      <header className="mx-auto max-w-2xl text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Pro shop
        </h1>
        <p className="mt-3 text-base text-muted">
          Rackets, balls, shoes, apparel, and accessories. Members get discounts at checkout.
        </p>
      </header>

      <div className="mt-10 flex flex-wrap items-center gap-2">
        <div className="relative flex-1 md:max-w-sm">
          <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products, brands…"
            className="h-10 w-full rounded-lg border border-line bg-white pl-9 pr-3 text-sm outline-none placeholder:text-muted focus:border-moss/40"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setCategory("All")}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium ${
              category === "All"
                ? "border-moss bg-moss text-white"
                : "border-line bg-white text-muted hover:text-text"
            }`}
          >
            All
          </button>
          {PRODUCT_CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium ${
                category === c
                  ? "border-moss bg-moss text-white"
                  : "border-line bg-white text-muted hover:text-text"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((p) => (
          <ShopProductCard key={p.id} product={p} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="mt-12 text-center text-sm text-muted">
          No products match your filters.
        </p>
      )}

      <p className="mt-12 text-center text-xs text-muted">
        Members get additional discounts. Ask the front desk about tier benefits.
      </p>
    </div>
  );
}