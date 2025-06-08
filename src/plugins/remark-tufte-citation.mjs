/**
 * @import {Root} from 'mdast'
 */
import { visit } from "unist-util-visit";

/**
 * @returns {() => Root}
 */
export default function remarkTufteCitation() {
  return function (tree, _file) {
    visit(tree, "code", (code) => {
        code.value = code.value.replaceAll('@', '&#0040;');
    })
  };
}
