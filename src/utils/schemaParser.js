/**
 * Normalizes a raw schema node into a consistent shape.
 * Ensures every node has an `id`, `type`, `props`, and `children` array.
 *
 * This is the single entry-point for transforming user-authored JSON
 * into the internal representation the renderer consumes.
 */
export function normalizeNode(node, parentPath = '') {
  if (!node || typeof node !== 'object') return null;

  const id = node.id || `${parentPath}${node.type || 'unknown'}-${Math.random().toString(36).slice(2, 8)}`;
  const path = parentPath ? `${parentPath}.${id}` : id;

  const { type, children, ...rest } = node;

  return {
    id,
    path,
    type: type || 'unknown',
    props: rest,
    children: Array.isArray(children)
      ? children.map((child, i) => normalizeNode(child, `${path}[${i}].`)).filter(Boolean)
      : [],
  };
}

/**
 * Normalizes an entire schema tree starting from the root.
 */
export function parseSchema(schema) {
  if (!schema) return null;
  return normalizeNode(schema);
}

/**
 * Extracts every field node (nodes with a `name` prop) from a schema tree.
 * Useful for building initial form state or iterating all fields.
 */
export function extractFields(schema) {
  const fields = [];

  const walk = (node) => {
    if (!node) return;
    if (node.props?.name) {
      fields.push({
        name: node.props.name,
        label: node.props.label || node.props.name,
        type: node.type,
        defaultValue: node.props.defaultValue ?? '',
        validation: node.props.validation || null,
      });
    }
    if (Array.isArray(node.children)) {
      node.children.forEach(walk);
    }
  };

  const normalized = typeof schema.id !== 'undefined' ? schema : parseSchema(schema);
  walk(normalized);
  return fields;
}

/**
 * Builds the initial values map for a form by walking the schema and
 * collecting every field's `defaultValue` (or empty string).
 */
export function buildInitialValues(schema) {
  const fields = extractFields(schema);
  const values = {};
  for (const field of fields) {
    values[field.name] = field.defaultValue;
  }
  return values;
}
