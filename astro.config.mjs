// @ts-check
import { defineConfig } from "astro/config";
import remarkBehead from "remark-behead";
import remarkDirective from "remark-directive";
import remarkMath from "remark-math";
import remarkTufteCitation from "./src/plugins/remark-tufte-citation.mjs";
import remarkTufteEpigraph from "./src/plugins/remark-tufte-epigraph.mjs";
import remarkTufteFigure from "./src/plugins/remark-tufte-figure.mjs";
import remarkTuftLinter from "./src/plugins/remark-tufte-linter.mjs";
import remarkTufteNewthought from "./src/plugins/remark-tufte-newthought.mjs";
import remarkTufteSection from "./src/plugins/remark-tufte-section.mjs";
import remarkTufteSidenote from "./src/plugins/remark-tufte-sidenote.mjs";
import rehypeCitation from "rehype-citation";
import rehypeMathJax from "rehype-mathjax";
import rehypeTufteCitation from "./src/plugins/rehype-tufte-citation.mjs";

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
      [remarkBehead, { depth: 1 }],
      remarkDirective,
      remarkMath,
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
      [rehypeMathJax, MathJax],
      rehypeTufteCitation,
    ],
    gfm: true,
  },
});
