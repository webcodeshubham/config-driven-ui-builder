/**
 * Schema 1 — Contact / Registration Form
 *
 * Demonstrates:
 *   - Multiple input types (text, email, select, checkbox, textarea)
 *   - Nested layouts (row, column, grid)
 *   - Conditional rendering (showIf / hideIf)
 *   - Rich validation (required, pattern, minLength, maxLength, match)
 */
export const contactFormSchema = {
  type: 'form',
  title: 'Contact Registration',
  description: 'Fill in your details to register. Fields marked with * are required.',
  children: [
    {
      type: 'layout',
      direction: 'row',
      gap: 16,
      children: [
        {
          type: 'input',
          label: 'First Name',
          name: 'firstName',
          placeholder: 'John',
          validation: { required: true, minLength: 2 },
        },
        {
          type: 'input',
          label: 'Last Name',
          name: 'lastName',
          placeholder: 'Doe',
          validation: { required: true, minLength: 2 },
        },
      ],
    },
    {
      type: 'input',
      label: 'Email',
      name: 'email',
      inputType: 'email',
      placeholder: 'john@example.com',
      validation: { required: true, pattern: 'email' },
    },
    {
      type: 'input',
      label: 'Phone',
      name: 'phone',
      inputType: 'tel',
      placeholder: '+1 (555) 000-0000',
      validation: { pattern: 'phone' },
      hint: 'Optional — include country code',
    },
    {
      type: 'select',
      label: 'Role',
      name: 'role',
      placeholder: 'Choose a role...',
      validation: { required: true },
      options: [
        { value: 'developer', label: 'Developer' },
        { value: 'designer', label: 'Designer' },
        { value: 'manager', label: 'Manager' },
        { value: 'other', label: 'Other' },
      ],
    },
    {
      type: 'input',
      label: 'Specify Your Role',
      name: 'otherRole',
      placeholder: 'e.g. Data Scientist',
      validation: { required: true },
      showIf: { field: 'role', equals: 'other' },
    },
    {
      type: 'checkbox',
      label: 'I am currently employed',
      name: 'isEmployed',
    },
    {
      type: 'input',
      label: 'Company Name',
      name: 'company',
      placeholder: 'Acme Inc.',
      validation: { required: true },
      showIf: { field: 'isEmployed', equals: true },
    },
    {
      type: 'textarea',
      label: 'Bio',
      name: 'bio',
      placeholder: 'Tell us about yourself...',
      rows: 3,
      validation: { maxLength: 300 },
    },
    {
      type: 'layout',
      direction: 'row',
      gap: 12,
      children: [
        { type: 'button', label: 'Register', buttonType: 'submit', fullWidth: true },
        { type: 'button', label: 'Reset', buttonType: 'reset', variant: 'secondary', fullWidth: true },
      ],
    },
  ],
};

/**
 * Schema 2 — Password Change Form
 *
 * Demonstrates:
 *   - Cross-field validation (match)
 *   - Multiple validation rules per field
 *   - Custom error messages
 */
export const passwordChangeSchema = {
  type: 'form',
  title: 'Change Password',
  description: 'Enter your current password and choose a new one.',
  children: [
    {
      type: 'input',
      label: 'Current Password',
      name: 'currentPassword',
      inputType: 'password',
      validation: { required: true },
    },
    {
      type: 'input',
      label: 'New Password',
      name: 'newPassword',
      inputType: 'password',
      validation: {
        required: true,
        minLength: 8,
        customMessage: {
          minLength: 'Password must be at least 8 characters long',
        },
      },
    },
    {
      type: 'input',
      label: 'Confirm New Password',
      name: 'confirmPassword',
      inputType: 'password',
      validation: {
        required: true,
        match: 'newPassword',
        customMessage: {
          match: 'Passwords do not match',
        },
      },
    },
    {
      type: 'button',
      label: 'Update Password',
      buttonType: 'submit',
      fullWidth: true,
    },
  ],
};

/**
 * Schema 3 — Nested Grid Layout Survey
 *
 * Demonstrates:
 *   - Grid layout with columns
 *   - Deeply nested layouts
 *   - Mixed component types
 *   - Complex conditional rendering with AND/OR
 */
export const surveySchema = {
  type: 'form',
  title: 'Developer Survey',
  description: 'Help us understand your development workflow.',
  children: [
    {
      type: 'layout',
      direction: 'grid',
      columns: 2,
      gap: 16,
      children: [
        {
          type: 'select',
          label: 'Primary Language',
          name: 'language',
          validation: { required: true },
          options: ['JavaScript', 'TypeScript', 'Python', 'Go', 'Rust', 'Java', 'Other'],
        },
        {
          type: 'select',
          label: 'Experience Level',
          name: 'experience',
          validation: { required: true },
          options: [
            { value: 'junior', label: '0-2 years' },
            { value: 'mid', label: '3-5 years' },
            { value: 'senior', label: '6-10 years' },
            { value: 'staff', label: '10+ years' },
          ],
        },
      ],
    },
    {
      type: 'select',
      label: 'Preferred Framework',
      name: 'framework',
      options: ['React', 'Vue', 'Angular', 'Svelte', 'None'],
      showIf: {
        or: [
          { field: 'language', equals: 'JavaScript' },
          { field: 'language', equals: 'TypeScript' },
        ],
      },
    },
    {
      type: 'checkbox',
      label: 'I use a state management library',
      name: 'usesStateLib',
      showIf: {
        or: [
          { field: 'language', equals: 'JavaScript' },
          { field: 'language', equals: 'TypeScript' },
        ],
      },
    },
    {
      type: 'input',
      label: 'Which state library?',
      name: 'stateLib',
      placeholder: 'e.g. Redux, Zustand, MobX',
      showIf: {
        and: [
          { field: 'usesStateLib', equals: true },
          {
            or: [
              { field: 'language', equals: 'JavaScript' },
              { field: 'language', equals: 'TypeScript' },
            ],
          },
        ],
      },
    },
    {
      type: 'textarea',
      label: 'Additional Comments',
      name: 'comments',
      placeholder: 'Any thoughts on the current dev landscape?',
      rows: 4,
      validation: { maxLength: 500 },
    },
    {
      type: 'button',
      label: 'Submit Survey',
      buttonType: 'submit',
      fullWidth: true,
    },
  ],
};

export default contactFormSchema;
