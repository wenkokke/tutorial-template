// @ts-check
import { defineConfig } from "astro/config";
import remarkTufteSection from "./src/plugins/remark-tufte-section.mjs";
import remarkBehead from "remark-behead";
import remarkDirective from "remark-directive";
import remarkTufteSidenote from "./src/plugins/remark-tufte-sidenote.mjs";
import remarkTufteNewthought from "./src/plugins/remark-tufte-newthought.mjs";
import remarkTufteEpigraph from "./src/plugins/remark-tufte-epigraph.mjs";
import remarkTufteFigure from "./src/plugins/remark-tufte-figure.mjs";
import rehypeMathJax from "rehype-mathjax";
import remarkMath from "remark-math";
import rehypeCitation from "rehype-citation";
import rehypeTufteCitation from "./src/plugins/rehype-tufte-citation.mjs";
import remarkTufteCitation from "./src/plugins/remark-tufte-citation.mjs";
import remarkTuftLinter from "./src/plugins/remark-tufte-linter.mjs";

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
      remarkMath,
      remarkDirective,
      [remarkBehead, { depth: 1 }],
      remarkTuftLinter,
      remarkTufteSection,
      remarkTufteNewthought,
      remarkTufteEpigraph,
      remarkTufteSidenote,
      remarkTufteFigure,
      remarkTufteCitation,
    ],
    rehypePlugins: [
      [rehypeMathJax, MathJax],
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
      rehypeTufteCitation,
    ],
    gfm: true,
  },
});
