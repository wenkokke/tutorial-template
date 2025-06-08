/**
 * @import {Root} from 'mdast'
 * @import {VFile} from 'vfile'
 */
import { flatMapMut } from "./unist-util-flatmap.mjs";

/**
 * @returns {() => Root}
 */
export default function remarkTufteEpigraph() {
  /**
   * @param {Root} tree
   * @param {VFile} file
   * @returns {Root | null | undefined}
   */
  return function (tree, _file) {
    const isEpigraphsFooter = (node) =>
      node.type === "textDirective" && node.name === "footer";
    const isEpigraphsCite = (node) =>
      node.type === "textDirective" && node.name === "cite";
    flatMapMut(tree, "blockquote", (epigraphs) => {
      flatMapMut(epigraphs, isEpigraphsFooter, (footer) => {
        flatMapMut(epigraphs, isEpigraphsCite, (cite) => {
          return [
            { type: "html", value: "<cite>" },
            ...cite.children,
            { type: "html", value: "</cite>" },
          ];
        });
        return [
          { type: "html", value: "<footer>" },
          ...footer.children,
          { type: "html", value: "</footer>" },
        ];
      });
      return [
        { type: "html", value: '<div class="epigraph">' },
        epigraphs,
        { type: "html", value: "</div>" },
      ];
    });
  };
}
