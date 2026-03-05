import { createElement, useMemo } from 'react';
import { parseSchema } from '../../utils/schemaParser';
import { renderNode } from '../../engine/renderEngine';
import { useFormContext } from '../../context/FormContext';
import componentRegistry from '../../registry/componentRegistry';

/**
 * Renderer — the bridge between a JSON schema and the React tree.
 *
 * 1. Parses the raw schema into a normalized tree (once, via useMemo).
 * 2. Reads current form values from context (for conditional rendering).
 * 3. Delegates to the render engine which recursively walks the tree,
 *    resolves components from the registry, and produces React elements.
 *
 * An optional `registry` prop lets consumers override or extend the
 * default registry for a specific Renderer instance.
 */
export default function Renderer({ schema, registry }) {
  const { formValues } = useFormContext();

  const normalizedSchema = useMemo(() => parseSchema(schema), [schema]);

  const activeRegistry = useMemo(
    () => (registry ? { ...componentRegistry, ...registry } : componentRegistry),
    [registry]
  );

  const tree = useMemo(
    () => renderNode(normalizedSchema, activeRegistry, formValues, createElement),
    [normalizedSchema, activeRegistry, formValues]
  );

  return tree;
}
