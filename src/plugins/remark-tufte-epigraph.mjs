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
    const isEpigraph = (node) =>
      node.type === "containerDirective" && node.name === "epigraph";
    const isEpigraphFooter = (node) =>
      node.type === "bracketedSpan" &&
      (node.properties?.className ?? []).includes("footer");
    const isEpigraphCite = (node) =>
      node.type === "bracketedSpan" &&
      (node.properties?.className ?? []).includes("cite");
    flatMapMut(tree, isEpigraph, (epigraph) => {
      flatMapMut(epigraph, isEpigraphFooter, (footer) => {
        flatMapMut(epigraph, isEpigraphCite, (cite) => {
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
        ...epigraph.children,
        { type: "html", value: "</div>" },
      ];
    });
  };
}
