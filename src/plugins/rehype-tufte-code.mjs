/**
 * @import {Root} from 'hast'
 * @import {VFile} from 'vfile'
 */
import { visit } from "unist-util-visit";

/**
 * @returns {() => Root}
 */
export default function rehypeTufteCode() {
  /**
   * @param {Root} tree
   * @param {VFile} file
   * @returns {Root | null | undefined}
   */
  return function (tree, _file) {
    visit(tree, {type: "element", tagName: "pre"}, (pre) => {
      if (!Array.isArray(pre.properties?.className)) {
        pre.properties.className = [];
      }
      pre.properties.className.push('fullwidth');
    });
  };
}
