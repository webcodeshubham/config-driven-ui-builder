import Form from '../components/Form/Form';
import Input from '../components/Input/Input';
import Button from '../components/Button/Button';
import Layout from '../components/Layout/Layout';
import Select from '../components/Select/Select';
import Checkbox from '../components/Checkbox/Checkbox';
import Textarea from '../components/Textarea/Textarea';

/**
 * Component Registry
 *
 * Maps schema `type` strings to actual React components.
 *
 * To extend the system with a new widget:
 *   1. Create the component under src/components/YourWidget/
 *   2. Import it here.
 *   3. Add a `yourwidget: YourWidget` entry.
 *
 * The renderer looks up this map at render time, so newly registered
 * types are available immediately without modifying any engine code.
 */
const componentRegistry = {
  form: Form,
  input: Input,
  button: Button,
  layout: Layout,
  select: Select,
  checkbox: Checkbox,
  textarea: Textarea,
};

/**
 * Runtime registration for plugins or lazy-loaded components.
 */
export function registerComponent(type, component) {
  if (componentRegistry[type] && import.meta.env.DEV) {
    console.warn(`[Registry] Overwriting existing component for type "${type}"`);
  }
  componentRegistry[type] = component;
}

export default componentRegistry;
