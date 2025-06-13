// @ts-check
import { defineConfig } from "astro/config";
// @ts-ignore
import remarkAgda from "remark-agda";
import remarkBehead from "remark-behead";
import remarkCustomHeaderId from "remark-custom-header-id";
import remarkDirective from "remark-directive";
import remarkMath from "remark-math";
import remarkSmartyPants from "remark-smartypants";
import remarkTufteCitation from "./src/plugins/remark-tufte-citation.mjs";
import remarkTufteEpigraph from "./src/plugins/remark-tufte-epigraph.mjs";
import remarkTufteFigure from "./src/plugins/remark-tufte-figure.mjs";
import remarkTuftLinter from "./src/plugins/remark-tufte-linter.mjs";
import remarkTufteNewthought from "./src/plugins/remark-tufte-newthought.mjs";
import remarkTufteSection from "./src/plugins/remark-tufte-section.mjs";
import remarkTufteSidenote from "./src/plugins/remark-tufte-sidenote.mjs";
import rehypeCitation from "rehype-citation";
import rehypeLinkAnchor from "./src/plugins/rehype-link-anchor.mjs";
import rehypeMathJax from "rehype-mathjax";
import rehypeSlug from "rehype-slug";
import rehypeTufteCitation from "./src/plugins/rehype-tufte-citation.mjs";

// Agda options
const ROOT = import.meta.dirname;
const Agda = {
  agdaStdlibBaseUrl: "https://agda.github.io/agda-stdlib/v2.2/",
  htmlDir: ".astro/cache/remark-agda/html",
  args: ["--library-file=tutorial-template.agda-lib-index"],
  options: {
    cwd: ROOT,
    env: { ROOT },
    stdout: "inherit",
  },
};

// MathJax options:
const MathJax = {
  // TeX Input Processor Options
  // https://docs.mathjax.org/en/latest/options/input/tex.html
  tex: {},
};

// https://astro.build/config
export default defineConfig({
  markdown: {
    syntaxHighlight: "prism",
    remarkPlugins: [
      [remarkAgda, Agda],
      [remarkBehead, { depth: 1 }],
      remarkCustomHeaderId,
      remarkDirective,
      remarkMath,
      // @ts-ignore
      [remarkSmartyPants, { dashes: "oldschool" }],
      remarkTuftLinter,
      remarkTufteSection,
      remarkTufteNewthought,
      remarkTufteEpigraph,
      remarkTufteSidenote,
      remarkTufteFigure,
      remarkTufteCitation,
    ],
    rehypePlugins: [
      [
        rehypeCitation,
        {
          bibliography: "src/assets/bibliography.bib",
          suppressBibliography: true,
          inlineClass: ["inline-cite"],
          showTooltips: true,
          tooltipAttribute: "data-title",
        },
      ],
      rehypeSlug,
      rehypeLinkAnchor,
      [rehypeMathJax, MathJax],
      rehypeTufteCitation,
    ],
  },
});
