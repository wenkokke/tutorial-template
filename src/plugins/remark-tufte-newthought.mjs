/**
 * @import {Root} from 'mdast'
 * @import {Test} from 'unist-util-is'
 */
import { flatMapMut } from "./unist-util-flatmap.mjs";

/**
 * @returns {() => Root}
 */
export default function remarkTufteNewthought() {
  return function (tree, file) {
    flatMapMut(tree, isNewthoughtDirective, (newthought) => {
      return [
        { type: "html", value: '<span class="newthought">' },
        ...newthought.children,
        { type: "html", value: "</span>" },
      ];
    });
  };
}

/**
 * @type {Test}
 */
export const isNewthoughtDirective = {
  type: "textDirective",
  name: "newthought",
};
