/**
 * @import {Root} from 'mdast'
 * @import {VFile} from 'vfile'
 */
import { flatMapMut } from "./unist-util-flatmap.mjs";
import { marginnote } from "./remark-tufte-sidenote.mjs";
import { is } from "unist-util-is";
import { visit } from "unist-util-visit";
import path from "node:path";
import { pathToFileURL } from "node:url";

/**
 * @returns {() => Root}
 */
export default function remarkTufteFigure() {
  /**
   * @param {Root} tree
   * @param {VFile} file
   * @returns {Root | null | undefined}
   */
  return function (tree, file) {
    // Initialise the label collision map
    const labelCollisionMap = {};
    /**
     * Resolve image label collisions by adding indexes.
     * @param {string} label
     * @returns {string}
     */
    function resolveFigureLabelCollision(label) {
      if (label in labelCollisionMap) {
        const index = labelCollisionMap[label];
        labelCollisionMap[label] += 1;
        return label + "-" + index.toString();
      } else {
        labelCollisionMap[label] = 1;
        return label;
      }
    }
    /**
     * Compute a label from a file path or URL.
     * @param {string} pathOrURL
     * @returns {string}
     */
    function pathOrURLLabel(pathOrURL) {
      let url = URL.parse(pathOrURL) ?? URL.parse(pathToFileURL(pathOrURL));
      return resolveFigureLabelCollision(path.parse(url.pathname).name);
    }
    /**
     * Compute a label from a figure node.
     * @param {Parent | Image | string} input
     * @returns {string}
     */
    function figureLabel(input) {
      if (typeof input === "string") {
        return pathOrURLLabel(input);
      }
      if (is(input, "image")) {
        return pathOrURLLabel(input.url);
      }
      if (typeof input === "object" && "children" in input) {
        let url = null;
        visit(input, ["image", "link"], (node) => (url = node.url));
        return pathOrURLLabel(url);
      }
    }
    /**
     * Test for margin figures
     * @type {Test}
     */
    const isMarginFigure = (node) =>
      is(node, "textDirective") && node.name == "marginfigure";
    // Render margin figures
    flatMapMut(tree, isMarginFigure, (figure) => {
      // Add the figuretype attribute
      let caption = null;
      visit(figure, "image", (image) => {
        caption = image.title;
        image.figuretype = "marginfigure"
      });
      const label = figureLabel(figure);
      const children = figure.children;
      if (caption) {
        children.push({ type: "text", value: caption });
      }
      return marginnote({ label, children });
    });
    /**
     * Test for fullwidth figures
     * @type {Test}
     */
    const isFullwidthFigure = (node) =>
      is(node, "containerDirective") && node.name == "fullwidthfigure";
    // Render fullwidth figures
    flatMapMut(tree, isFullwidthFigure, (figure) => {
      // Add the figuretype attribute
      visit(figure, "image", (image) => (image.figuretype = "fullwidthfigure"));
      // Render fullwidth figure
      return [
        { type: "html", value: '<figure class="fullwidth">' },
        figure,
        { type: "html", value: "</figure>" },
      ];
    });
    /**
     * Test for margin figures
     * @type {Test}
     */
    const isIframeFigure = (node) =>
      is(node, "leafDirective") && node.name == "iframefigure";
    // Render margin figures
    flatMapMut(tree, isIframeFigure, (figure) => {
      // Check that the src attribute is present
      const src = figure?.attributes?.src;
      if (!src) {
        file.fail(`missing attribute 'src' on \`::iframefigure\` directive`);
      }
      const result = [];
      result.push({ type: "html", value: '<figure class="iframe-wrapper">' });
      if (figure.children) {
        const label = figureLabel(src);
        result.push(...marginnote({ label, children: figure.children }));
      }
      result.push({
        type: "html",
        value: `<iframe src="${src}" frameborder="0" allowfullscreen>`,
      });
      result.push({ type: "html", value: "</iframe>" });
      result.push({ type: "html", value: "</figure>" });
      return result;
    });
    /**
     * Test for main figures
     * @type {Test}
     */
    const isMainFigure = (node) => is(node, "image") && !("figuretype" in node);
    flatMapMut(tree, isMainFigure, (figure) => {
      // Add the figuretype attribute
      visit(figure, "image", (image) => (image.figuretype = "main"));
      // Render the main figure
      const result = [];
      result.push({ type: "html", value: "<figure>" });
      if (figure.title) {
        const label = figureLabel(figure);
        const children = [{ type: "text", value: figure.title }];
        result.push(...marginnote({ label, children }));
      }
      result.push(figure);
      result.push({ type: "html", value: "</figure>" });
      return result;
    });
  };
}
