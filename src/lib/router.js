import { writable } from "svelte/store";

const normalizePath = (path) => {
  if (!path || path === "/") return "/";
  return path.endsWith("/") ? path : `${path}/`;
};

export const location = writable({
  path: normalizePath(window.location.pathname),
  hash: window.location.hash
});

const setLocation = () => {
  location.set({
    path: normalizePath(window.location.pathname),
    hash: window.location.hash
  });
};

export function navigate(href) {
  const url = new URL(href, window.location.origin);
  const path = normalizePath(url.pathname);
  const next = `${path}${url.hash}`;
  const current = `${normalizePath(window.location.pathname)}${window.location.hash}`;

  if (next !== current) {
    history.pushState(null, "", next);
  }
  setLocation();
  window.scrollTo({ top: 0, behavior: "auto" });
}

export function startRouter() {
  const clickHandler = (event) => {
    const hashControl = event.target.closest("[data-route-hash]");
    if (hashControl) {
      event.preventDefault();
      history.replaceState(null, "", hashControl.getAttribute("data-route-hash"));
      setLocation();
      return;
    }

    const anchor = event.target.closest("a");
    if (!anchor) return;

    const href = anchor.getAttribute("href");
    if (!href || anchor.target || anchor.hasAttribute("download")) return;

    if (href.startsWith("#")) {
      event.preventDefault();
      history.replaceState(null, "", href);
      setLocation();
      return;
    }

    const url = new URL(anchor.href);
    if (url.origin !== window.location.origin) return;

    event.preventDefault();
    navigate(`${url.pathname}${url.hash}`);
  };

  document.addEventListener("click", clickHandler);
  window.addEventListener("popstate", setLocation);
  window.addEventListener("hashchange", setLocation);

  return () => {
    document.removeEventListener("click", clickHandler);
    window.removeEventListener("popstate", setLocation);
    window.removeEventListener("hashchange", setLocation);
  };
}
