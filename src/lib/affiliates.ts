import affiliatesData from "./affiliates.json";

export function getAffiliatesMarkdown() {
  let md = "\\n\\n";
  const tag = affiliatesData.tag || "tbsoftwash06-20";
  
  for (const [key, product] of Object.entries(affiliatesData.products)) {
    if (product.asin && !product.asin.startsWith("PENDING_")) {
      md += `[${key}]: https://www.amazon.com/dp/${product.asin}?tag=${tag}\\n`;
    } else {
      // Use search fallback
      const searchStr = encodeURIComponent(product.name);
      md += `[${key}]: https://www.amazon.com/s?k=${searchStr}&tag=${tag}\\n`;
    }
  }
  return md;
}
