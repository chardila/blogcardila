import type { Root } from "mdast";
import type { Plugin } from "unified";
import { visit } from "unist-util-visit";

/**
 * Simple remark plugin to parse {.lightbox} syntax after images
 * Converts: ![alt](src){.lightbox} -> ![alt](src) with data attribute
 */
export const remarkLightboxSyntax: Plugin<[], Root> = () => {
	return (tree) => {
		visit(tree, "paragraph", (node: any) => {
			// Check if paragraph contains an image followed by text with {.lightbox}
			if (node.children && node.children.length >= 2) {
				for (let i = 0; i < node.children.length - 1; i++) {
					const current = node.children[i];
					const next = node.children[i + 1];

					// Check if current is image and next is text with {.lightbox}
					if (
						current.type === "image" &&
						next.type === "text" &&
						next.value &&
						next.value.trim().startsWith("{.lightbox")
					) {
						// Add data-lightbox-marker to image node
						// This will be picked up by rehype plugin
						if (!current.data) {
							current.data = {};
						}
						if (!current.data.hProperties) {
							current.data.hProperties = {};
						}
						current.data.hProperties["data-lightbox-marker"] = "";

						// Preserve original high-res URL for lightbox
						// Only for images from public/ (absolute paths) or remote URLs
						// For images from src/assets (relative paths), let Astro optimize them
						if (current.url && (current.url.startsWith("/") || current.url.startsWith("http"))) {
							current.data.hProperties["data-lightbox-original"] = current.url;
						}

						// Check for data-caption in the syntax
						const captionMatch = next.value.match(/data-caption="([^"]+)"/);
						if (captionMatch) {
							current.data.hProperties["data-caption"] = captionMatch[1];
						}

						// Remove the {.lightbox} text node
						node.children.splice(i + 1, 1);
					}
				}
			}
		});
	};
};
