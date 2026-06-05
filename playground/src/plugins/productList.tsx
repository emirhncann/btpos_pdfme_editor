import React, { useCallback, useState } from 'react';
import { createRoot } from 'react-dom/client';
import type { Plugin, PropPanelWidgetProps, Schema } from '@pdfme/common';
import { table } from '@pdfme/schemas';

// ─── Tipler ──────────────────────────────────────────────────────────────────

export type ProductColumn = {
  key: string;
  label: string;
  widthPct: number;
  align: 'left' | 'right' | 'center';
  visible: boolean;
};

export type ProductListSchema = Schema & {
  type: 'product-list';
  columns: ProductColumn[];
  fontSize: number;
  showHead: boolean;
};

// ─── Varsayılan kolonlar ──────────────────────────────────────────────────────

const DEFAULT_COLUMNS: ProductColumn[] = [
  { key: 'name',     label: 'Ürün',    widthPct: 44, align: 'left',  visible: true },
  { key: 'qty',      label: 'Adet',    widthPct: 12, align: 'right', visible: true },
  { key: 'price',    label: 'Fiyat',   widthPct: 14, align: 'right', visible: true },
  { key: 'discount', label: 'İsk%',    widthPct: 10, align: 'right', visible: true },
  { key: 'total',    label: 'Tutar',   widthPct: 14, align: 'right', visible: true },
  { key: 'vat_rate', label: 'KDV%',    widthPct: 10, align: 'right', visible: false },
  { key: 'unit',     label: 'Birim',   widthPct: 10, align: 'left',  visible: false },
];

// Örnek içerik — her satır tüm kolonların verisini içerir (gizliler dahil)
const DEFAULT_CONTENT = JSON.stringify([
  ['Elma',      '2', '5.00',  '0',  '10.00', '18', 'Adet'],
  ['Ekmek',     '1', '7.50',  '10', '6.75',  '8',  'Adet'],
  ['Su (1.5L)', '3', '3.00',  '0',  '9.00',  '18', 'Adet'],
]);

// ─── Tablo schema'sına dönüştürme ─────────────────────────────────────────────

const toTableCompatible = (schema: ProductListSchema, value: string) => {
  const cols = schema.columns ?? DEFAULT_COLUMNS;
  const visibleCols = cols.filter((c) => c.visible);
  const totalW = visibleCols.reduce((s, c) => s + c.widthPct, 0) || 100;

  // Value: her satırdaki görünür kolonları al
  let filteredContent: string;
  try {
    const rows = JSON.parse(value || '[]') as string[][];
    const visibleIndices = cols
      .map((c, i) => ({ c, i }))
      .filter(({ c }) => c.visible)
      .map(({ i }) => i);
    filteredContent = JSON.stringify(rows.map((row) => visibleIndices.map((i) => row[i] ?? '')));
  } catch {
    filteredContent = '[]';
  }

  const fontSize = schema.fontSize ?? 8;

  const tableSchema: any = {
    ...schema,
    type: 'table',
    content: filteredContent,
    head: visibleCols.map((c) => c.label),
    headWidthPercentages: visibleCols.map((c) => (c.widthPct / totalW) * 100),
    showHead: schema.showHead ?? true,
    repeatHead: false,
    tableStyles: { borderColor: '#000000', borderWidth: 0 },
    headStyles: {
      fontName: '',
      fontSize,
      characterSpacing: 0,
      alignment: 'left',
      verticalAlignment: 'middle',
      lineHeight: 1,
      fontColor: '#000000',
      backgroundColor: '',
      borderColor: '#000000',
      borderWidth: { top: 0.3, right: 0, bottom: 0.3, left: 0 },
      padding: { top: 2, right: 1, bottom: 2, left: 1 },
    },
    bodyStyles: {
      fontName: '',
      fontSize,
      characterSpacing: 0,
      alignment: 'left',
      verticalAlignment: 'middle',
      lineHeight: 1,
      fontColor: '#000000',
      backgroundColor: '',
      borderColor: '#000000',
      borderWidth: { top: 0, right: 0, bottom: 0, left: 0 },
      padding: { top: 1, right: 1, bottom: 1, left: 1 },
      alternateBackgroundColor: '',
    },
    columnStyles: {
      alignment: Object.fromEntries(
        visibleCols
          .map((c, i) => [String(i), c.align] as [string, string])
          .filter(([, a]) => a !== 'left'),
      ),
    },
  };

  return { tableSchema, filteredContent };
};

// ─── PDF render ───────────────────────────────────────────────────────────────

const pdfRender = async (arg: any) => {
  const { value, schema } = arg;
  const { tableSchema, filteredContent } = toTableCompatible(schema as ProductListSchema, value);
  return (table.pdf as any)({ ...arg, schema: tableSchema, value: filteredContent });
};

// ─── UI render ────────────────────────────────────────────────────────────────

const uiRender = async (arg: any) => {
  const { value, schema } = arg;
  const { tableSchema, filteredContent } = toTableCompatible(schema as ProductListSchema, value);
  return (table.ui as any)({ ...arg, schema: tableSchema, value: filteredContent });
};

// ─── PropPanel Widget — Kolon Editörü ─────────────────────────────────────────

type ColumnEditorProps = {
  columns: ProductColumn[];
  onChange: (cols: ProductColumn[]) => void;
};

function ColumnEditor({ columns, onChange }: ColumnEditorProps) {
  const update = useCallback(
    (index: number, patch: Partial<ProductColumn>) => {
      const next = columns.map((c, i) => (i === index ? { ...c, ...patch } : c));
      onChange(next);
    },
    [columns, onChange],
  );

  const totalPct = columns
    .filter((c) => c.visible)
    .reduce((s, c) => s + c.widthPct, 0);

  return (
    <div style={{ fontFamily: 'sans-serif', fontSize: 12 }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '20px 1fr 52px 64px',
          gap: '2px 6px',
          alignItems: 'center',
          marginBottom: 4,
          color: '#888',
          fontSize: 11,
          padding: '0 2px',
        }}
      >
        <span />
        <span>Başlık</span>
        <span>Genişlik</span>
        <span>Hizalama</span>
      </div>

      {columns.map((col, i) => (
        <div
          key={col.key}
          style={{
            display: 'grid',
            gridTemplateColumns: '20px 1fr 52px 64px',
            gap: '2px 6px',
            alignItems: 'center',
            marginBottom: 4,
            opacity: col.visible ? 1 : 0.45,
          }}
        >
          {/* Görünürlük checkbox */}
          <input
            type="checkbox"
            checked={col.visible}
            onChange={(e) => update(i, { visible: e.target.checked })}
            style={{ cursor: 'pointer', margin: 0 }}
          />

          {/* Başlık */}
          <input
            type="text"
            value={col.label}
            onChange={(e) => update(i, { label: e.target.value })}
            disabled={!col.visible}
            style={{
              padding: '2px 4px',
              border: '1px solid #d9d9d9',
              borderRadius: 3,
              fontSize: 12,
              width: '100%',
              boxSizing: 'border-box',
            }}
          />

          {/* Genişlik % */}
          <input
            type="number"
            value={col.widthPct}
            min={5}
            max={80}
            disabled={!col.visible}
            onChange={(e) => update(i, { widthPct: Number(e.target.value) })}
            style={{
              padding: '2px 4px',
              border: '1px solid #d9d9d9',
              borderRadius: 3,
              fontSize: 12,
              width: '100%',
              boxSizing: 'border-box',
            }}
          />

          {/* Hizalama */}
          <select
            value={col.align}
            disabled={!col.visible}
            onChange={(e) => update(i, { align: e.target.value as ProductColumn['align'] })}
            style={{
              padding: '2px 3px',
              border: '1px solid #d9d9d9',
              borderRadius: 3,
              fontSize: 11,
              width: '100%',
            }}
          >
            <option value="left">Sol</option>
            <option value="center">Orta</option>
            <option value="right">Sağ</option>
          </select>
        </div>
      ))}

      <div
        style={{
          marginTop: 6,
          fontSize: 11,
          color: Math.abs(totalPct - 100) > 1 ? '#e53e3e' : '#38a169',
          fontWeight: 600,
        }}
      >
        Toplam: {totalPct}%{Math.abs(totalPct - 100) > 1 ? ' ⚠ 100% olmalı' : ' ✓'}
      </div>
    </div>
  );
}

// ─── Widget bağlayıcısı ───────────────────────────────────────────────────────

const roots = new WeakMap<HTMLElement, ReturnType<typeof createRoot>>();

function ProductColumnsWidget(props: PropPanelWidgetProps) {
  const { rootElement, activeSchema, changeSchemas } = props;

  const schema = activeSchema as unknown as ProductListSchema;
  const columns: ProductColumn[] = schema.columns ?? DEFAULT_COLUMNS;

  const handleChange = (newCols: ProductColumn[]) => {
    changeSchemas([{ key: 'columns', value: newCols, schemaId: activeSchema.id }]);
  };

  let root = roots.get(rootElement);
  if (!root) {
    root = createRoot(rootElement);
    roots.set(rootElement, root);
  }
  root.render(<ColumnEditor columns={columns} onChange={handleChange} />);
}

// ─── Plugin tanımı ────────────────────────────────────────────────────────────

const productList: Plugin<ProductListSchema> = {
  pdf: pdfRender,
  ui: uiRender,
  propPanel: {
    schema: () => ({
      columns: {
        title: 'Sütunlar',
        type: 'string',
        widget: 'ProductColumns',
        span: 24,
      },
      showHead: {
        title: 'Başlık Satırı Göster',
        type: 'boolean',
        widget: 'checkbox',
        span: 12,
      },
      fontSize: {
        title: 'Yazı Boyutu (pt)',
        type: 'number',
        widget: 'inputNumber',
        props: { min: 6, max: 20 },
        span: 12,
      },
    }),
    widgets: {
      ProductColumns: ProductColumnsWidget as any,
    },
    defaultSchema: {
      name: 'sale_items',
      type: 'product-list',
      content: DEFAULT_CONTENT,
      position: { x: 0, y: 0 },
      width: 80,
      height: 24,
      columns: DEFAULT_COLUMNS,
      fontSize: 8,
      showHead: true,
    },
  },
  icon: table.icon,
};

export default productList;
