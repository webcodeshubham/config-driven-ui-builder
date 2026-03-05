import { useState, useCallback } from 'react';
import { FormProvider } from './context/FormContext';
import { useTheme } from './context/ThemeContext';
import Renderer from './components/Renderer/Renderer';
import {
  contactFormSchema,
  passwordChangeSchema,
  surveySchema,
} from './config/exampleSchema';
import styles from './styles/App.module.css';

const SCHEMAS = [
  { key: 'contact', label: 'Contact Form', schema: contactFormSchema },
  { key: 'password', label: 'Password Change', schema: passwordChangeSchema },
  { key: 'survey', label: 'Developer Survey', schema: surveySchema },
];

export default function App() {
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('contact');
  const [submittedData, setSubmittedData] = useState(null);

  const activeSchema = SCHEMAS.find((s) => s.key === activeTab);

  const handleSubmit = useCallback((values) => {
    setSubmittedData(values);
  }, []);

  const handleTabChange = useCallback((key) => {
    setActiveTab(key);
    setSubmittedData(null);
  }, []);

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <h1 className={styles.title}>Config-Driven UI Builder</h1>
        <p className={styles.subtitle}>
          Dynamic interfaces rendered entirely from JSON schemas
        </p>
      </header>

      <div className={styles.topBar}>
        <nav className={styles.tabBar}>
          {SCHEMAS.map(({ key, label }) => (
            <button
              key={key}
              className={`${styles.tab} ${activeTab === key ? styles.tabActive : ''}`}
              onClick={() => handleTabChange(key)}
            >
              {label}
            </button>
          ))}
        </nav>
        <button
          className={styles.themeToggle}
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? '\u2600\uFE0F' : '\uD83C\uDF19'}
        </button>
      </div>

      <div className={styles.card}>
        {/*
          A new FormProvider is mounted per schema so that each form
          gets an isolated state tree derived from its own schema.
        */}
        <FormProvider
          key={activeTab}
          schema={activeSchema.schema}
          onSubmit={handleSubmit}
        >
          <Renderer schema={activeSchema.schema} />
        </FormProvider>
      </div>

      {submittedData && (
        <div className={styles.output}>
          <h3 className={styles.outputTitle}>Submitted Data</h3>
          <pre className={styles.outputPre}>
            {JSON.stringify(submittedData, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
