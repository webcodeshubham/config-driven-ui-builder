import { shouldRender } from '../engine/conditionEngine';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const URL_REGEX = /^https?:\/\/.+\..+/;
const PHONE_REGEX = /^\+?[\d\s\-()]{7,}$/;

const PATTERN_MAP = {
  email: EMAIL_REGEX,
  url: URL_REGEX,
  phone: PHONE_REGEX,
};

const BUILT_IN_VALIDATORS = {
  required: (value) => {
    if (value === undefined || value === null) return false;
    if (typeof value === 'string') return value.trim().length > 0;
    if (typeof value === 'boolean') return value === true;
    return true;
  },

  minLength: (value, min) => {
    if (typeof value !== 'string') return true;
    return value.length >= min;
  },

  maxLength: (value, max) => {
    if (typeof value !== 'string') return true;
    return value.length <= max;
  },

  pattern: (value, patternKey) => {
    if (!value || typeof value !== 'string') return true;
    const regex = PATTERN_MAP[patternKey] || new RegExp(patternKey);
    return regex.test(value);
  },

  min: (value, min) => {
    const num = Number(value);
    if (isNaN(num)) return true;
    return num >= min;
  },

  max: (value, max) => {
    const num = Number(value);
    if (isNaN(num)) return true;
    return num <= max;
  },

  match: (value, _targetFieldName, _allValues, targetValue) => {
    return value === targetValue;
  },
};

const DEFAULT_MESSAGES = {
  required: (label) => `${label} is required`,
  minLength: (label, min) => `${label} must be at least ${min} characters`,
  maxLength: (label, max) => `${label} must be at most ${max} characters`,
  pattern: (label, patternKey) => {
    const friendly = { email: 'email address', url: 'URL', phone: 'phone number' };
    return `${label} must be a valid ${friendly[patternKey] || 'format'}`;
  },
  min: (label, min) => `${label} must be at least ${min}`,
  max: (label, max) => `${label} must be at most ${max}`,
  match: (label, targetField) => `${label} must match ${targetField}`,
};

/**
 * Validates a single field against its validation rules.
 *
 * @param {*} value - The current field value
 * @param {Object} rules - Validation rules from the schema (e.g. { required: true, minLength: 3 })
 * @param {string} label - Human-readable field label for error messages
 * @param {Object} allValues - All current form values (needed for cross-field validation like "match")
 * @returns {string|null} Error message string, or null if valid
 */
export function validateField(value, rules, label = 'This field', allValues = {}) {
  if (!rules || typeof rules !== 'object') return null;

  for (const [rule, ruleValue] of Object.entries(rules)) {
    if (rule === 'custom') {
      if (typeof ruleValue === 'function') {
        const error = ruleValue(value, allValues);
        if (error) return error;
      }
      continue;
    }

    if (rule === 'customMessage') continue;

    const validator = BUILT_IN_VALIDATORS[rule];
    if (!validator) continue;

    let isValid;
    if (rule === 'match') {
      const targetValue = allValues[ruleValue];
      isValid = validator(value, ruleValue, allValues, targetValue);
    } else {
      isValid = validator(value, ruleValue);
    }

    if (!isValid) {
      if (rules.customMessage && rules.customMessage[rule]) {
        return rules.customMessage[rule];
      }
      const messageFn = DEFAULT_MESSAGES[rule];
      return messageFn ? messageFn(label, ruleValue) : `${label} is invalid`;
    }
  }

  return null;
}

/**
 * Validates all fields in a form at once.
 * Walks through every schema node that has a `name` and `validation` property.
 * Skips fields that are conditionally hidden via showIf/hideIf.
 *
 * @param {Object} values - Current form values keyed by field name
 * @param {Array} schemaChildren - Array of schema node descriptors
 * @returns {Object} Errors object keyed by field name, empty if all valid
 */
export function validateForm(values, schemaChildren) {
  const errors = {};

  const walk = (nodes) => {
    if (!Array.isArray(nodes)) return;
    for (const node of nodes) {
      if (!shouldRender(node, values)) continue;

      if (node.name && node.validation) {
        const error = validateField(
          values[node.name],
          node.validation,
          node.label || node.name,
          values
        );
        if (error) errors[node.name] = error;
      }
      if (node.children) walk(node.children);
    }
  };

  walk(schemaChildren);
  return errors;
}
