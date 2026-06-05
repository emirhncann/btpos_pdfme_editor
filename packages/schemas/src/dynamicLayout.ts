import type { DynamicLayoutArgs, DynamicLayoutCallbackResult, Schema } from '@pdfme/common';
import { getDynamicLayoutForList } from './list/dynamicTemplate.js';
import { getDynamicLayoutForMultiVariableText } from './multiVariableText/dynamicTemplate.js';
import { getDynamicLayoutForTable } from './tables/dynamicTemplate.js';
import { TEXT_OVERFLOW_EXPAND } from './text/constants.js';
import { getDynamicLayoutForText } from './text/dynamicTemplate.js';

export {
  BUILT_IN_DYNAMIC_LAYOUT_SPLIT_UNITS,
  LIST_ITEM_SPLIT_UNIT,
  TABLE_BODY_SPLIT_UNIT,
  TEXT_LINE_SPLIT_UNIT,
  createListItemSplitRange,
  createTableBodySplitRange,
  createTextLineSplitRange,
  getListItemRange,
  getTableBodyRange,
  getTextLineRange,
  type BuiltInDynamicLayoutSplitUnit,
} from './splitRange.js';

const isExpandableTextSchema = (schema: Schema) =>
  (schema.type === 'text' || schema.type === 'multiVariableText') &&
  (schema as { overflow?: unknown }).overflow === TEXT_OVERFLOW_EXPAND;

export const isDynamicLayoutSchema = (schema: Schema) =>
  schema.type === 'table' ||
  schema.type === 'list' ||
  schema.type === 'product-list' ||
  isExpandableTextSchema(schema);

export const getDynamicLayoutForSchema = (
  value: string,
  args: DynamicLayoutArgs,
): Promise<DynamicLayoutCallbackResult> => {
  switch (args.schema.type) {
    case 'table':
      return getDynamicLayoutForTable(value, args);
    case 'product-list': {
      // product-list → table dinamik yükseklik hesabı için kolon filtrelemesi yap
      const plSchema = args.schema as any;
      const cols: Array<{ key: string; widthPct: number; visible: boolean }> =
        plSchema.columns ?? [];
      const visibleIndices = cols
        .map((c: any, i: number) => ({ c, i }))
        .filter(({ c }: any) => c.visible)
        .map(({ i }: any) => i);
      let filteredValue = value;
      try {
        const rows = JSON.parse(value || '[]') as string[][];
        filteredValue = JSON.stringify(rows.map((row) => visibleIndices.map((i: number) => row[i] ?? '')));
      } catch {
        filteredValue = '[]';
      }
      const totalW = cols.filter((c: any) => c.visible).reduce((s: number, c: any) => s + c.widthPct, 0) || 100;
      const tableArgs: DynamicLayoutArgs = {
        ...args,
        schema: {
          ...args.schema,
          type: 'table',
          head: cols.filter((c: any) => c.visible).map((c: any) => c.label),
          headWidthPercentages: cols.filter((c: any) => c.visible).map((c: any) => (c.widthPct / totalW) * 100),
          showHead: plSchema.showHead ?? true,
          headStyles: { fontSize: plSchema.fontSize ?? 8, padding: { top: 2, right: 1, bottom: 2, left: 1 } },
          bodyStyles: { fontSize: plSchema.fontSize ?? 8, padding: { top: 1, right: 1, bottom: 1, left: 1 } },
        } as any,
      };
      return getDynamicLayoutForTable(filteredValue, tableArgs);
    }
    case 'list':
      return getDynamicLayoutForList(value, args);
    case 'text':
      return getDynamicLayoutForText(value, args);
    case 'multiVariableText':
      return getDynamicLayoutForMultiVariableText(value, args);
    default:
      return Promise.resolve([args.schema.height]);
  }
};
