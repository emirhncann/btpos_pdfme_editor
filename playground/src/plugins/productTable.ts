import { table } from '@pdfme/schemas';
import type { Plugin } from '@pdfme/common';

// Termal fiş için hazır yapılandırılmış ürün listesi tablosu.
// Sol sidebar'dan eklenince doğrudan sale_items olarak gelir.
const productTable: Plugin<any> = {
  pdf: table.pdf,
  ui: table.ui,
  propPanel: {
    ...table.propPanel,
    defaultSchema: {
      name: 'sale_items',
      type: 'table',
      position: { x: 0, y: 0 },
      width: 80,
      height: 24,
      content: JSON.stringify([
        ['Elma',       '2', '5.00', '0',  '10.00'],
        ['Ekmek',      '1', '7.50', '10', '6.75'],
        ['Su (1.5L)',  '3', '3.00', '0',  '9.00'],
      ]),
      showHead: true,
      repeatHead: false,
      head: ['Ürün', 'Adet', 'Fiyat', 'İsk%', 'Tutar'],
      headWidthPercentages: [46, 13, 14, 10, 17],
      tableStyles: {
        borderColor: '#000000',
        borderWidth: 0,
      },
      headStyles: {
        fontName: '',
        fontSize: 8,
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
        fontSize: 8,
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
        alignment: { '1': 'right', '2': 'right', '3': 'right', '4': 'right' },
      },
    },
  },
  icon: table.icon,
};

export default productTable;
