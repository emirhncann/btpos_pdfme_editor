import type { Plugin, Schema } from '@pdfme/common';

export interface SpacerSchema extends Schema {
  lineHeight: number;
}

// ESC/POS standard: ~4mm per line at 8 dots/mm, 30-dot line spacing
const DEFAULT_LINE_HEIGHT_MM = 4;

const ICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
  <path d="M21 3H3"/>
  <path d="M21 21H3"/>
  <path d="M12 7v10M9 10l3-3 3 3M9 14l3 3 3-3"/>
</svg>`;

const spacer: Plugin<SpacerSchema> = {
  pdf: async () => {
    // Renders as blank space — nothing to draw
  },

  ui: (arg) => {
    const { rootElement, schema } = arg;
    const lines = Math.round(schema.height / (schema.lineHeight || DEFAULT_LINE_HEIGHT_MM));

    Object.assign(rootElement.style, {
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxSizing: 'border-box',
      background: 'repeating-linear-gradient(45deg, #f0f0f0, #f0f0f0 4px, #fafafa 4px, #fafafa 10px)',
      border: '1px dashed #bbb',
      userSelect: 'none',
    });

    const label = document.createElement('span');
    Object.assign(label.style, {
      fontSize: '10px',
      color: '#888',
      pointerEvents: 'none',
      background: 'rgba(255,255,255,0.7)',
      padding: '1px 4px',
      borderRadius: '2px',
    });
    label.textContent = `↕ ${lines} satır boşluk`;
    rootElement.appendChild(label);
  },

  propPanel: {
    schema: ({ i18n }) => ({
      lineHeight: {
        title: 'Satır Yüksekliği (mm)',
        type: 'number',
        widget: 'inputNumber',
        props: { min: 1, max: 20, step: 0.5 },
        span: 24,
      },
    }),
    defaultSchema: {
      name: '',
      type: 'spacer',
      content: '',
      position: { x: 0, y: 0 },
      width: 80,
      height: DEFAULT_LINE_HEIGHT_MM,
      readOnly: true,
      lineHeight: DEFAULT_LINE_HEIGHT_MM,
    },
  },

  icon: ICON_SVG,
};

export default spacer;
