import type { Root } from "hast";
import type { Plugin } from "unified";
import { visit } from "unist-util-visit";

/**
 * Rehype plugin to process images marked with .lightbox class
 * Adds data attributes needed for the lightbox Web Component
 */
export const rehypeLightbox: Plugin<[], Root> = () => {
	return (tree) => {
		let imageIndex = 0;

		visit(tree, "element", (node) => {
			// Find <img> elements with class "lightbox"
			if (
				node.tagName === "img" &&
				node.properties &&
				Array.isArray(node.properties.className) &&
				node.properties.className.includes("lightbox")
			) {
				// Add data attributes for the Web Component
				node.properties["data-lightbox"] = "";
				node.properties["data-lightbox-index"] = imageIndex++;
				node.properties["data-lightbox-src"] = node.properties.src || "";
				node.properties["data-lightbox-alt"] = node.properties.alt || "";

				// Check for custom caption from data-caption attribute
				if (node.properties["data-caption"]) {
					node.properties["data-lightbox-caption"] = node.properties["data-caption"];
				} else {
					// Default to alt text as caption
					node.properties["data-lightbox-caption"] = node.properties.alt || "";
				}

				// Add cursor pointer styling hint
				const existingClasses = node.properties.className || [];
				node.properties.className = [...existingClasses, "cursor-zoom-in"];
			}
		});
	};
};
