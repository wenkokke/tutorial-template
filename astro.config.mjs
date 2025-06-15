// @ts-check
import { defineConfig } from "astro/config";
import remarkBehead from "remark-behead";
import remarkDirective from "remark-directive";
import remarkMath from "remark-math";
import remarkSmartyPants from "remark-smartypants";
import remarkTufteEpigraph from "./src/plugins/remark-tufte-epigraph.mjs";
import remarkTufteFigure from "./src/plugins/remark-tufte-figure.mjs";
import remarkTuftLinter from "./src/plugins/remark-tufte-linter.mjs";
import remarkTufteNewthought from "./src/plugins/remark-tufte-newthought.mjs";
import remarkTufteSection from "./src/plugins/remark-tufte-section.mjs";
import remarkTufteSidenote from "./src/plugins/remark-tufte-sidenote.mjs";
import rehypeCitation from "rehype-citation";
import rehypeLinkAnchor from "./src/plugins/rehype-link-anchor.mjs";
import rehypeMathJax from "rehype-mathjax";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import rehypeTufteCitation from "./src/plugins/rehype-tufte-citation.mjs";
import rehypeTufteCode from "./src/plugins/rehype-tufte-code.mjs";

// MathJax options:
const MathJax = {
  // TeX Input Processor Options
  // https://docs.mathjax.org/en/latest/options/input/tex.html
  tex: {},
};

// https://astro.build/config
export default defineConfig({
  site: "https://wen.works",
  base: import.meta.env.DEV ? "" : "/tutorial-template",
  markdown: {
    syntaxHighlight: "prism",
    remarkPlugins: [
      [remarkBehead, { depth: 1 }],
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
    ],
    remarkRehype: {
      handlers: {
        // @ts-ignore
        cite: rehypeTufteCitation.citeToHast,
      },
    },
    rehypePlugins: [
      rehypeRaw,
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
      rehypeTufteCode,
    ],
  },
});
