import { shouldRender } from './conditionEngine';

/**
 * Render Engine
 *
 * Core orchestration layer that turns a normalized schema tree into a
 * React element tree.  It is intentionally framework-agnostic in its
 * logic — the only React dependency is that it returns the result of
 * calling `createElement`, which the Renderer component supplies.
 *
 * Responsibilities:
 *   1. Look up the component for `node.type` in the registry.
 *   2. Evaluate show/hide conditions via the Condition Engine.
 *   3. Recursively process child nodes.
 *   4. Forward all remaining props to the resolved component.
 */

/**
 * @param {Object}   node          - A normalized schema node (from schemaParser)
 * @param {Object}   registry      - Component registry mapping type → Component
 * @param {Object}   formValues    - Current form state (for condition evaluation)
 * @param {Function} createElement - React.createElement (injected to keep this file pure JS)
 * @returns {React.Element|null}
 */
export function renderNode(node, registry, formValues, createElement) {
  if (!node) return null;

  if (!shouldRender(node.props, formValues)) return null;

  const Component = registry[node.type];

  if (!Component) {
    if (import.meta.env.DEV) {
      console.warn(`[RenderEngine] No component registered for type "${node.type}"`);
    }
    return null;
  }

  const childElements = node.children.map((child) =>
    renderNode(child, registry, formValues, createElement)
  );

  return createElement(
    Component,
    { key: node.id, ...node.props, nodeId: node.id },
    childElements.length > 0 ? childElements : undefined
  );
}
