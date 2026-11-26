import { useEffect } from "react";

export const SITE_URL = "https://skillport.mathclass.uk";
export const OG_IMAGE = `${SITE_URL}/og.png`;

type StructuredData = Record<string, unknown>;

type PageMeta = {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
  noindex?: boolean;
  keywords?: string[];
  /** schema.org JSON-LD for this page only, replaced on every navigation. */
  jsonLd?: StructuredData | StructuredData[];
};

const JSON_LD_ID = "page-jsonld";

function upsert(selector: string, create: () => HTMLElement): HTMLElement {
  let element = document.head.querySelector<HTMLElement>(selector);
  if (!element) {
    element = create();
    document.head.appendChild(element);
  }
  return element;
}

function setMeta(attribute: "name" | "property", key: string, value: string) {
  const element = upsert(`meta[${attribute}="${key}"]`, () => {
    const tag = document.createElement("meta");
    tag.setAttribute(attribute, key);
    return tag;
  });
  element.setAttribute("content", value);
}

function setLink(rel: string, href: string) {
  const element = upsert(`link[rel="${rel}"]`, () => {
    const tag = document.createElement("link");
    tag.setAttribute("rel", rel);
    return tag;
  });
  element.setAttribute("href", href);
}

/**
 * Client-side head for the SPA. Every page sets the same set of tags the static
 * shell carries, so a crawler that renders JavaScript sees one consistent
 * canonical, social card and structured-data graph instead of stale markup.
 */
export function usePageMeta({
  title,
  description,
  path,
  type = "website",
  noindex,
  keywords,
  jsonLd,
}: PageMeta) {
  const url = `${SITE_URL}${path === "/" ? "/" : path}`;
  const keywordText = keywords?.join(", ") ?? "";
  const jsonLdText = jsonLd ? JSON.stringify(jsonLd) : "";

  useEffect(() => {
    document.title = title;
    setMeta("name", "description", description);
    setMeta(
      "name",
      "robots",
      noindex ? "noindex, follow" : "index, follow, max-image-preview:large, max-snippet:-1",
    );
    if (keywordText) setMeta("name", "keywords", keywordText);
    else document.querySelector('meta[name="keywords"]')?.remove();

    setMeta("property", "og:site_name", "skillport");
    setMeta("property", "og:title", title);
    setMeta("property", "og:description", description);
    setMeta("property", "og:type", type);
    setMeta("property", "og:url", url);
    setMeta("property", "og:image", OG_IMAGE);
    setMeta("property", "og:image:width", "1200");
    setMeta("property", "og:image:height", "630");
    setMeta("property", "og:image:alt", `${title} — skillport`);
    setMeta("property", "og:locale", "en_US");

    setMeta("name", "twitter:card", "summary_large_image");
    setMeta("name", "twitter:title", title);
    setMeta("name", "twitter:description", description);
    setMeta("name", "twitter:image", OG_IMAGE);
    setMeta("name", "twitter:image:alt", `${title} — skillport`);

    setLink("canonical", url);

    let script = document.getElementById(JSON_LD_ID) as HTMLScriptElement | null;
    if (jsonLdText) {
      if (!script) {
        script = document.createElement("script");
        script.id = JSON_LD_ID;
        script.type = "application/ld+json";
        document.head.appendChild(script);
      }
      script.textContent = jsonLdText;
    } else if (script) {
      script.remove();
    }
  }, [title, description, url, type, noindex, keywordText, jsonLdText]);
}
