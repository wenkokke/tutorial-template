/**
 * @import {Root} from 'mdast'
 * @import {VFile} from 'vfile'
 */
import assert from "node:assert";
import { is } from "unist-util-is";
import { visit } from "unist-util-visit";
import { isNewthoughtDirective } from "./remark-tufte-newthought.mjs";

/**
 * @returns {() => Root}
 */
export default function remarkTufteSection() {
  /**
   * @param {Root} tree
   * @param {VFile} file
   * @returns {Root | null | undefined}
   */
  return function (tree, file) {
    assert(tree.type === "root");
    const children = [];
    // Track whether currently in a section.
    let inSection = false;
    let sectionContentLength = 0;
    // Enter a new section.
    const enter = () => {
      if (inSection && sectionContentLength > 0) {
        leave();
      }
      if (!inSection) {
        children.push({ type: "html", value: "<section>" });
        inSection = true;
        sectionContentLength = 0;
      }
    };
    // Leave the current section.
    const leave = () => {
      if (inSection) {
        children.push({ type: "html", value: "</section>" });
        inSection = false;
        sectionContentLength = 0;
      }
    };
    // Ensure that the document starts with a section.
    enter();
    // Traverse the document and insert sections.
    for (const node of tree.children) {
      if (isSectionStart(node)) {
        enter();
      }
      children.push(node);
      sectionContentLength += 1;
    }
    // Ensure that the document ends with the final section closed.
    leave();
    return { type: "root", children };
  };
}

function isSectionStart(node) {
  const isHeading1 = is(node, { type: "heading", depth: 2 });
  let hasNewthoughtDirective = false;
  visit(
    node,
    isNewthoughtDirective,
    (_newthought) => (hasNewthoughtDirective = true),
  );
  return isHeading1 || hasNewthoughtDirective;
}
