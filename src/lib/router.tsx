import { useEffect, useState, type AnchorHTMLAttributes, type MouseEvent } from "react";

const NAVIGATE_EVENT = "skillport:navigate";

export type Route = { path: string; hash: string };

export function readRoute(): Route {
  const path = window.location.pathname.replace(/\/+$/, "") || "/";
  return { path, hash: window.location.hash };
}

export function navigate(to: string, options: { replace?: boolean } = {}) {
  const url = new URL(to, window.location.origin);
  const state = { path: url.pathname };
  if (options.replace) window.history.replaceState(state, "", url);
  else window.history.pushState(state, "", url);
  window.dispatchEvent(new Event(NAVIGATE_EVENT));
}

export function useRoute(): Route {
  const [route, setRoute] = useState<Route>(readRoute);

  useEffect(() => {
    const update = () => setRoute(readRoute());
    window.addEventListener("popstate", update);
    window.addEventListener(NAVIGATE_EVENT, update);
    return () => {
      window.removeEventListener("popstate", update);
      window.removeEventListener(NAVIGATE_EVENT, update);
    };
  }, []);

  return route;
}

type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & { to: string };

/** Anchor that keeps real hrefs (open in new tab still works) but navigates in place. */
export function Link({ to, onClick, ...rest }: LinkProps) {
  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    onClick?.(event);
    if (event.defaultPrevented) return;
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    const url = new URL(to, window.location.origin);
    if (url.origin !== window.location.origin) return;

    event.preventDefault();
    navigate(to);
  }

  return <a href={to} onClick={handleClick} {...rest} />;
}
