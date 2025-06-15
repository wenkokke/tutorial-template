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
    // supported-directives:
    // Check that there are only supported directives
    visit(
      tree,
      ["containerDirective", "leafDirective", "textDirective"],
      (directive) => {
        if (
          !is(directive, [
            { type: "containerDirective", name: "fullwidthfigure" },
            { type: "leafDirective", name: "iframefigure" },
            { type: "textDirective", name: "marginfigure" },
            { type: "textDirective", name: "footer" },
          ])
        ) {
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
