// @ts-check
/**
 * @typedef {import("mdast-util-to-hast").State} State
 * @typedef {import("mdast").Node} MdastNode
 * @typedef {import("@benrbray/mdast-util-cite").InlineCiteNode} MdastCite
 * @typedef {import("hast").Node} HastNode
 * @typedef {import("hast").Text} HastText
 */
import { defineConfig } from "astro/config";
import assert from "assert";
import remarkBehead from "remark-behead";
import remarkBracketedSpans2 from "remark-bracketed-spans-2";
import remarkCite from "@benrbray/remark-cite";
import remarkCustomHeaderId from "remark-custom-header-id";
import remarkDirective from "remark-directive";
import remarkMath from "remark-math";
import remarkSmartyPants from "remark-smartypants";
import remarkTufteEpigraph from "./src/plugins/remark-tufte-epigraph.mjs";
import remarkTufteFigure from "./src/plugins/remark-tufte-figure.mjs";
import remarkTufteLinter from "./src/plugins/remark-tufte-linter.mjs";
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
import { bracketedSpanToHast } from "mdast-util-bracketed-spans";

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
      // @ts-ignore
      remarkBracketedSpans2,
      remarkCite,
      remarkCustomHeaderId,
      remarkDirective,
      remarkMath,
      // @ts-ignore
      [remarkSmartyPants, { dashes: "oldschool" }],
      remarkTufteLinter,
      remarkTufteSection,
      remarkTufteNewthought,
      remarkTufteEpigraph,
      remarkTufteSidenote,
      remarkTufteFigure,
    ],
    remarkRehype: {
      handlers: {
        bracketedSpan: bracketedSpanToHast,
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
