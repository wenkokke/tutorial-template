/**
 * @import {Root} from 'hast'
 */
import { is } from "unist-util-is";
import { h } from "hastscript";
import { visit } from "unist-util-visit";
import { flatMapMut } from "./unist-util-flatmap.mjs";

/**
 * @param {State} state
 * @param {MdastCite} node
 * @param {MdastNode | undefined} _parent
 * @returns {Array<HastNode> | HastNode | undefined}
 */
export function citeToHast(state, node, _parent) {
  assert(node.type === "cite");
  /** @type {HastText} */
  const result = {
    type: "text",
    value: node.value.replaceAll('@', '&#0040;'),
  };
  state.patch(node, result);
  return state.applyData(node, result);
}

/**
 * @returns {() => Root}
 */
export default function rehypeTufteCitation() {
  return function (tree, _file) {
    // Unescape "@" symbols in code blocks
    visit(tree, { type: "element", tagName: "code" }, (code) => {
      visit(code, "text", (text) => {
        text.value = text.value.replaceAll("&#0040;", "@");
      });
    });
    // Convert inline-cite tooltips to margin notes
    const isInlineCite = (element) =>
      is(element, { type: "element", tagName: "span" }) &&
      (element?.properties?.className ?? []).includes("inline-cite");
    flatMapMut(tree, isInlineCite, (span) => {
      const label = `mn-${span.properties.id}`;
      const note = inlineBib(span.properties.dataTitle.split(";"));
      return [
        h(
          "label",
          { for: label, class: "margin-toggle", ...span.properties },
          ...span.children,
        ),
        h("input", { type: "checkbox", id: label, class: "margin-toggle" }),
        h("span", { class: "marginnote" }, note),
      ];
    });
    // Convert the bibliography tag from div to section and add a header
    const isBibliography = (element) =>
      is(element, { type: "element", tagName: "div" }) &&
      element?.properties?.id === "refs";
    visit(tree, isBibliography, (div) => {
      div.tagName = "section";
      if (!Array.isArray(div.children)) {
        div.children = [];
      }
      div.children.unshift(h("h2", "Bibliography"));
    });
  };
}

function inlineBib(bibEntries) {
  bibEntries = bibEntries.map((bibEntry) =>
    h("span", { class: "inline-bib-entry" }, bibEntry),
  );
  return h("span", { class: "inline-bib" }, bibEntries);
}
