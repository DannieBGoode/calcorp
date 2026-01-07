import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import icon from "astro-icon";

// https://astro.build/config
export default defineConfig({
  site: process.env.SITE_URL || process.env.URL || "https://astroship.web3templates.com",
  integrations: [
    tailwind(),
    mdx(),
    sitemap(),
    icon({
      sets: {
        local: "src/icons", // Specify the directory for local icons
      },
    }),
  ],
});
