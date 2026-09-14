import { UIElementNode } from '@/types/section';

/**
 * Immutably updates the text content of a specific node by ID in the tree.
 */
export function updateNodeContent(
  tree: UIElementNode,
  id: string,
  newContent: string
): UIElementNode {
  if (tree.id === id) {
    return {
      ...tree,
      content: newContent,
    };
  }

  if (tree.children && tree.children.length > 0) {
    let hasChanged = false;
    const newChildren = tree.children.map((child) => {
      const updatedChild = updateNodeContent(child, id, newContent);
      if (updatedChild !== child) {
        hasChanged = true;
      }
      return updatedChild;
    });

    if (hasChanged) {
      return {
        ...tree,
        children: newChildren,
      };
    }
  }

  return tree;
}

/**
 * Searches for a node in the tree by its ID.
 */
export function findNodeById(
  tree: UIElementNode,
  id: string
): UIElementNode | null {
  if (tree.id === id) return tree;

  if (tree.children) {
    for (const child of tree.children) {
      const found = findNodeById(child, id);
      if (found) return found;
    }
  }

  return null;
}

/**
 * Recursively counts the total number of elements in the tree.
 */
export function countNodes(tree: UIElementNode): number {
  let count = 1;
  if (tree.children) {
    for (const child of tree.children) {
      count += countNodes(child);
    }
  }
  return count;
}

/**
 * Deep clones a tree while assigning fresh unique IDs (useful for new generations).
 */
export function cloneTreeWithNewIds(
  tree: UIElementNode,
  prefix: string = 'node'
): UIElementNode {
  const randomSuffix = Math.random().toString(36).substring(2, 7);
  const newId = `${prefix}-${tree.type}-${randomSuffix}`;

  return {
    ...tree,
    id: newId,
    children: tree.children?.map((child, index) =>
      cloneTreeWithNewIds(child, `${newId}-${index}`)
    ),
  };
}

/**
 * Converts a UIElementNode tree into clean, indented HTML markup.
 */
export function treeToHtml(node: UIElementNode, indent: number = 0): string {
  if (!node) return '';

  const spaces = '  '.repeat(indent);
  const tag =
    node.tag ||
    (node.type === 'section'
      ? 'section'
      : node.type === 'heading'
      ? 'h2'
      : node.type === 'paragraph'
      ? 'p'
      : node.type === 'button'
      ? 'button'
      : node.type === 'badge'
      ? 'span'
      : node.type === 'list'
      ? 'ul'
      : node.type === 'list-item'
      ? 'li'
      : node.type === 'divider'
      ? 'hr'
      : node.type === 'link'
      ? 'a'
      : 'div');

  let attrs = '';
  if (node.id) attrs += ` id="${node.id}"`;
  if (node.className) attrs += ` class="${node.className}"`;
  if (node.attributes) {
    for (const [k, v] of Object.entries(node.attributes)) {
      if (
        v !== undefined &&
        v !== null &&
        typeof v !== 'object' &&
        k !== 'highlight' &&
        k !== 'variant'
      ) {
        attrs += ` ${k}="${v}"`;
      }
    }
  }

  // Self-closing tags
  if (tag === 'hr') {
    return `${spaces}<${tag}${attrs} />\n`;
  }

  const hasChildren = Boolean(node.children && node.children.length > 0);
  const content = node.content !== undefined ? node.content.trim() : '';

  if (!hasChildren) {
    return `${spaces}<${tag}${attrs}>${content}</${tag}>\n`;
  }

  let inner = '';
  if (content) {
    inner += `${spaces}  ${content}\n`;
  }
  if (node.children) {
    for (const child of node.children) {
      inner += treeToHtml(child, indent + 1);
    }
  }

  return `${spaces}<${tag}${attrs}>\n${inner}${spaces}</${tag}>\n`;
}
