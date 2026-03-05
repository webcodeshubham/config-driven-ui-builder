/**
 * Condition Engine
 *
 * Evaluates `showIf` / `hideIf` directives attached to schema nodes
 * so the renderer can decide whether to mount a component.
 *
 * Supported condition shapes:
 *
 *   Simple equality:
 *     { field: "role", equals: "admin" }
 *
 *   Not-equals:
 *     { field: "role", notEquals: "guest" }
 *
 *   Truthy / falsy:
 *     { field: "hasAccount", equals: true }
 *
 *   Includes (for arrays / multi-select):
 *     { field: "tags", includes: "vip" }
 *
 *   AND (all must pass):
 *     { and: [ { field: "a", equals: 1 }, { field: "b", equals: 2 } ] }
 *
 *   OR (any must pass):
 *     { or: [ { field: "a", equals: 1 }, { field: "b", equals: 2 } ] }
 */

function evaluateSingle(condition, formValues) {
  const { field, equals, notEquals, includes } = condition;

  if (!field) return true;

  const value = formValues[field];

  if (equals !== undefined) return value === equals;
  if (notEquals !== undefined) return value !== notEquals;
  if (includes !== undefined) {
    return Array.isArray(value) ? value.includes(includes) : false;
  }

  return Boolean(value);
}

function evaluateCondition(condition, formValues) {
  if (!condition) return true;

  if (condition.and) {
    return condition.and.every((c) => evaluateCondition(c, formValues));
  }

  if (condition.or) {
    return condition.or.some((c) => evaluateCondition(c, formValues));
  }

  return evaluateSingle(condition, formValues);
}

/**
 * Determines whether a schema node should be rendered.
 *
 * @param {Object} nodeProps - The props of the schema node (may contain showIf / hideIf)
 * @param {Object} formValues - Current form state keyed by field name
 * @returns {boolean}
 */
export function shouldRender(nodeProps, formValues) {
  if (!nodeProps) return true;

  const { showIf, hideIf } = nodeProps;

  if (showIf && !evaluateCondition(showIf, formValues)) return false;
  if (hideIf && evaluateCondition(hideIf, formValues)) return false;

  return true;
}
