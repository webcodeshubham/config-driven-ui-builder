import { memo, useMemo } from 'react';
import styles from './Layout.module.css';

/**
 * Dynamic layout container driven by schema props.
 *
 * Supports three layout modes:
 *   - row:    horizontal flex
 *   - column: vertical flex (default)
 *   - grid:   CSS grid with configurable column count
 */
const Layout = memo(function Layout({
  direction = 'column',
  gap = 16,
  columns,
  children,
}) {
  const isGrid = direction === 'grid';

  const className = useMemo(() => {
    const parts = [];
    if (isGrid) {
      parts.push(styles.grid);
    } else {
      parts.push(styles.layout);
      parts.push(direction === 'row' ? styles.row : styles.column);
    }
    const gapClass = styles[`gap${gap}`];
    if (gapClass) parts.push(gapClass);
    return parts.join(' ');
  }, [direction, gap, isGrid]);

  const inlineStyle = useMemo(() => {
    const s = {};
    if (!styles[`gap${gap}`]) s.gap = `${gap}px`;
    if (isGrid && columns) {
      s.gridTemplateColumns = `repeat(${columns}, 1fr)`;
    }
    return Object.keys(s).length ? s : undefined;
  }, [gap, isGrid, columns]);

  return (
    <div className={className} style={inlineStyle}>
      {children}
    </div>
  );
});

export default Layout;
