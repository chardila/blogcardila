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
			// Find <img> elements with data-lightbox-marker attribute
			if (
				node.tagName === "img" &&
				node.properties &&
				node.properties["data-lightbox-marker"] !== undefined
			) {
				// Add data attributes for the Web Component
				node.properties["data-lightbox"] = "";
				node.properties["data-lightbox-index"] = String(imageIndex++);

				// Only set explicit source if we have a specific original (e.g. absolute public path)
				// Otherwise rely on the src attribute (which Astro may have optimized)
				if (node.properties["data-lightbox-original"]) {
					node.properties["data-lightbox-src"] = node.properties["data-lightbox-original"];
				}
				node.properties["data-lightbox-alt"] = node.properties.alt || "";

				// Add lazy loading for better performance
				node.properties.loading = "lazy";

				// Check for custom caption from data-caption attribute
				if (node.properties["data-caption"]) {
					node.properties["data-lightbox-caption"] = node.properties["data-caption"];
				} else {
					// Default to alt text as caption
					node.properties["data-lightbox-caption"] = node.properties.alt || "";
				}

				const existingClasses = Array.isArray(node.properties.className)
					? node.properties.className
					: typeof node.properties.className === "string"
						? [node.properties.className]
						: [];
				// Join classes into a string and set 'class' directly to avoid Astro/React confusion
				node.properties.class = [...existingClasses, "cursor-zoom-in"].join(" ");
				// Remove className to prevent duplication or misuse
				delete node.properties.className;
			}
		});
	};
};
