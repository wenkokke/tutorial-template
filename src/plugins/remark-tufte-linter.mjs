/**
 * @import {Root} from 'mdast'
 */
import { is } from "unist-util-is";
import { visit } from "unist-util-visit";

/**
 * @returns {() => Root}
 */
export default function remarkTuftLinter() {
  return function (tree, file) {
    // max-heading-depth:
    // Check that there are no headings deeper than level 3
    visit(tree, "heading", (heading) => {
      if (heading.depth > 3) {
        file.fail(`unsupported heading of depth ${heading.depth}`, {
          place: heading.position,
          ruleId: "max-heading-depth",
          source: "remark-tufte-linter",
        });
      }
    });
    // supported-bracketed-spans:
    // Check that there are only supported bracketed spans
    visit(tree, "bracketedSpan", (bracketedSpan) => {
      const className = bracketedSpan.properties?.className ?? [];
      if (className.length !== 1) {
        file.fail(
          `unsupported bracketed span with classes '${className.join(" ")}'`,
        );
      }
      const type = className[0];
      if (!["cite", "footer", "marginfigure", "newthought"].includes(type)) {
        file.fail(`unsupported bracketed span '${className[0]}'`);
      }
      for (const prop in bracketedSpan.properties) {
        if (prop === "className") {
          continue;
        }
        if (prop === "src" && type === "iframefigure") {
          continue;
        }
        if (Object.hasOwn(bracketedSpan.properties, prop)) {
          file.fail(`unsupported ${prop} attribute for bracketed span ${type}`);
        }
      }
    });
    // supported-directives:
    // Check that there are only supported directives
    visit(
      tree,
      ["containerDirective", "leafDirective", "textDirective"],
      (directive) => {
        if (
          is(directive, [
            { type: "containerDirective", name: "epigraph" },
            { type: "containerDirective", name: "fullwidthfigure" },
            { type: "containerDirective", name: "iframefigure" },
          ])
        ) {
          for (const prop in directive.attributes) {
            if (directive.name === "iframefigure" && prop === "src") {
              continue;
            }
            if (Object.hasOwn(directive.attributes, prop)) {
              file.fail(
                `unsupported ${prop} attribute for directive ${directive.name}`,
              );
            }
          }
        } else {
          const type = directive.type.match(/(?<type>[a-z]+)Directive/).groups
            .type;
          const pref = ":".repeat(
            ["text", "leaf", "container"].indexOf(type) + 1,
          );
          const name = pref + directive.name;
          file.fail(`unsupported ${type} directive ${name}`, {
            place: directive.position,
            ruleId: "supported-directives",
            source: "remark-tufte-linter",
          });
        }
      },
    );
  };
}
