function withPrefix<T extends Record<string, any>>(
  prefix: string,
  routes: T
): T {
  const normalize = (p: string) =>
    p.startsWith("/") ? p : `${prefix}${p ? "/" + p : ""}`;

  function deepMap(obj: unknown): unknown {
    if (typeof obj === "string") {
      return normalize(obj);
    }
    if (typeof obj === "function") {
      return (...args: unknown[]) => {
        // Call as unknown and normalize result if string
        const res = (obj as (...a: unknown[]) => unknown)(...args)
        return typeof res === 'string' ? normalize(res) : res
      };
    }
    if (typeof obj === "object" && obj !== null) {
      const mapped: Record<string, unknown> = {};
      for (const key in obj as Record<string, unknown>) {
        mapped[key] = deepMap((obj as Record<string, unknown>)[key]);
      }
      return mapped;
    }
    return obj;
  }

  return deepMap(routes) as T;
}

export type RouteConfig = typeof ROUTES;

export const ROUTES = {
  PUBLIC: {
    HOME: "/",
    ABOUT: "/about",
    CONTACT: "/contact",
    SERVICES: "/services",
    PROPERTIES: withPrefix("/properties", {
      LIST: "",
      VIEW: (id: string | number) => `${encodeURIComponent(id)}`
    }),
    PROJECTS: withPrefix("/projects", {
      LIST: "",
      VIEW: (id: string | number) => `${encodeURIComponent(id)}`
    }),
  },

  AUTH: {
    LOGIN: "/admin1928"
  },

  ADMIN: withPrefix("/admin", {
    DASHBOARD: "dashboard",
    PROPERTIES: withPrefix("properties", {
      LIST: "",
      NEW: "new",
      VIEW: (id: string) => `view/${id}`,
      EDIT: (id: string) => `edit/${id}`,
    }),
    PROJECTS: withPrefix("projects", {
      LIST: "",
      NEW: "new",
      VIEW: (id: string) => `view/${id}`,
      EDIT: (id: string) => `edit/${id}`,
    }),
    SETTINGS: "settings",
  })
}