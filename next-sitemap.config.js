require("ts-node").register({
  transpileOnly: true,
});

const { services } = require("./src/data/services.data.ts");

const glob = require("glob").glob;

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://abc.com";

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  additionalPaths: async () => {
    const routes = await glob("src/app/**/page.{js,jsx,ts,tsx,md,mdx}", {
      cwd: __dirname,
    });

    const paths = routes
      .map((file) => {
        return file
          // normalize windows paths
          .replace(/\\/g, "/")

          // remove src/app
          .replace(/^src\/app/, "")

          // remove /page.xxx
          .replace(/\/page\.(js|jsx|ts|tsx|md|mdx)$/, "")

          // remove route groups (folders like (public))
          .replace(/\/\([^/]+\)/g, "")

          // remove dynamic routes ([id], [slug])
          .replace(/\/\[[^\]]+\]/g, "");
      })
      .filter((path) => {
        // exclude private folders (_folder)
        if (path.split("/").some((p) => p.startsWith("_"))) return false;

        // exclude admin routes
        if (path.startsWith("/admin") || path.startsWith("/admin1928")) return false;

        return true;
      })
      .map((path) => {
        const loc = path === "" ? siteUrl : `${siteUrl}${path}`;

        return {
          loc,
          changefreq: "daily",
          lastmod: new Date().toISOString(),
          priority: 0.7,
        };
      });

    const servicePaths = services.map((service) => ({
      loc: `${siteUrl}/services/${service.slug}`,
      changefreq: "weekly",
      lastmod: new Date().toISOString(),
      priority: 0.8,
    }));

    const allPaths = [...paths, ...servicePaths];

    const unique = Array.from(
      new Map(allPaths.map((item) => [item.loc, item])).values()
    );

    return unique;
  },

  generateRobotsTxt: true,
  siteUrl,
  exclude: ["/admin1928", "/admin/*"],
};