import { useEffect } from "react";

export const SITE_URL = "https://skillport.dev";

type PageMeta = {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
  noindex?: boolean;
};

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

export function usePageMeta({ title, description, path, type = "website", noindex }: PageMeta) {
  useEffect(() => {
    const url = `${SITE_URL}${path === "/" ? "/" : path}`;

    document.title = title;
    setMeta("name", "description", description);
    setMeta("name", "robots", noindex ? "noindex, follow" : "index, follow");
    setMeta("property", "og:title", title);
    setMeta("property", "og:description", description);
    setMeta("property", "og:type", type);
    setMeta("property", "og:url", url);
    setMeta("name", "twitter:title", title);
    setMeta("name", "twitter:description", description);
    setLink("canonical", url);
  }, [title, description, path, type, noindex]);
}
