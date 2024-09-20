import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";

import tailwindPlugin from "./plugins/tailwindPlugin.js";
import rawLoaderPlugin from "./plugins/rawLoaderPlugin.js";

const config: Config = {
  title: "Explainable WebGPU",
  favicon: "img/favicon.ico",

  // Set the production url of your site here
  url: "https://explainable-webgpu.coloroflight.me",
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: "/",

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "ColorOfLight", // Usually your GitHub org/user name.
  projectName: "explainable-webgpu", // Usually your repo name.

  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  presets: [
    [
      "classic",
      {
        docs: {
          path: "docs-list/content",
          routeBasePath: "content",
          sidebarPath: "sidebars/content.ts",
        },
        theme: {
          customCss: "./src/css/custom.css",
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    navbar: {
      title: "Explainable WebGPU",
      logo: {
        alt: "Explainable WebGPU Logo",
        src: "img/webgpu-logo.svg",
      },
      items: [
        {
          type: "docSidebar",
          sidebarId: "introduction",
          position: "left",
          label: "Introduction",
          docsPluginId: "introduction",
        },
        {
          type: "docSidebar",
          sidebarId: "content",
          position: "left",
          label: "Content",
        },
      ],
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
  plugins: [
    tailwindPlugin,
    rawLoaderPlugin,
    [
      "@docusaurus/plugin-content-docs",
      {
        id: "introduction",
        path: "docs-list/introduction",
        routeBasePath: "introduction",
        sidebarPath: "sidebars/introduction.ts",
      },
    ],
  ],
};

export default config;
