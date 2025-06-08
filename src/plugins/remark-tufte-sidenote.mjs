/**
 * @import {Parent, Root} from 'mdast'
 * @import {VFile} from 'vfile'
 */
import { visit } from "unist-util-visit";
import { flatMapMut } from "./unist-util-flatmap.mjs";
import { visit } from "unist-util-visit";

/**
 * @returns {() => Root}
 */
export default function remarkTufteSidenote() {
  /**
   * @param {Root} tree
   * @param {VFile} file
   * @returns {Root | null | undefined}
   */
  return function (tree, file) {
    // Gather footnote definitions:
    const footnoteDefinitions = {};
    visit(tree, "footnoteDefinition", (node) => {
      footnoteDefinitions[node.label] = node;
    });
    /**
     * Get footnote definiens from footnote label.
     * @param {Parent} footnoteDefinition
     * @returns {Node[]}
     */
    function getFootnoteDefinition(label) {
      if (label in footnoteDefinitions) {
        return footnoteDefinitions[label];
      } else {
        file.fail(`Unknown footnote ${label}`);
      }
    }
    // Render footnote references:
    flatMapMut(tree, "footnoteReference", ({ label }) => {
      if (/^mn-/.test(label)) {
        return marginnote(getFootnoteDefinition(label));
      } else {
        return sidenote(getFootnoteDefinition(label));
      }
    });
  };
}
/**
 *
 * @param {Node} marginnote
 * @returns {Node[]}
 */
export function marginnote({ label, children }) {
  const definiens =
    children.length === 1 && children[0].type === "paragraph"
      ? children[0].children
      : children;
  return [
    {
      type: "html",
      value: `<label for="${label}" class="margin-toggle">`,
    },
    { type: "html", value: "&#8853;" },
    { type: "html", value: "</label>" },
    {
      type: "html",
      value: `<input type="checkbox" id="${label}" class="margin-toggle"/>`,
    },
    { type: "html", value: '<span class="marginnote">' },
    ...definiens,
    { type: "html", value: "</span>" },
  ];
}
/**
 *
 * @param {Node} sidenote
 * @returns {Node[]}
 */
export function sidenote({ label, children }) {
  const definiens =
    children.length === 1 && children[0].type === "paragraph"
      ? children[0].children
      : children;
  return [
    {
      type: "html",
      value: `<label for="${label}" class="margin-toggle sidenote-number">`,
    },
    { type: "html", value: "</label>" },
    {
      type: "html",
      value: `<input type="checkbox" id="${label}" class="margin-toggle"/>`,
    },
    { type: "html", value: '<span class="sidenote">' },
    ...definiens,
    { type: "html", value: "</span>" },
  ];
}
