/**
 * @import {Root} from 'mdast'
 * @import {Test} from "unist-util-is"
 */
import { is } from "unist-util-is";
import { visit } from "unist-util-visit";

/**
 * @param {Root} tree
 * @param {Test} test
 * @param {(Node) => Node[]}
 * @returns {Root}
 */
export function flatMapMut(tree, test, func) {
  const isParent = (node) => !!node?.children;
  return visit(tree, isParent, (node) => {
    if (Array.isArray(node?.children)) {
      const children = [];
      for (const child of node.children) {
        const result = is(child, test) && func(child);
        if (Array.isArray(result)) {
          children.push(...result);
        } else {
          children.push(child);
        }
      }
      node.children = children;
    }
  });
}

