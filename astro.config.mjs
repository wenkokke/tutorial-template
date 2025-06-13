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
// @ts-ignore
import remarkAgda from "remark-agda";
import remarkBehead from "remark-behead";
import remarkBracketedSpans2 from "remark-bracketed-spans-2";
import remarkCite from "@benrbray/remark-cite";
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
import { bracketedSpanToHast } from "mdast-util-bracketed-spans";

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

/**
 * @param {State} state
 * @param {MdastCite} node
 * @param {MdastNode | undefined} _parent
 * @returns {Array<HastNode> | HastNode | undefined}
 */
function citeToHast(state, node, _parent) {
  assert(node.type === "cite");
  /** @type {HastText} */
  const result = {
    type: "text",
    value: node.value,
  };
  state.patch(node, result);
  return state.applyData(node, result);
}

// https://astro.build/config
export default defineConfig({
  site: "https://wen.works",
  base: import.meta.env.DEV ? "" : "/tutorial-template",
  markdown: {
    syntaxHighlight: "prism",
    remarkPlugins: [
      [remarkAgda, Agda],
      [remarkBehead, { depth: 1 }],
      // @ts-ignore
      remarkBracketedSpans2,
      remarkCite,
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
    remarkRehype: {
      handlers: {
        bracketedSpan: bracketedSpanToHast,
        // @ts-ignore
        cite: citeToHast,
      },
    },
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
