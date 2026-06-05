export type VariableKind = 'text' | 'table';

export type VariableEntry = {
  key: string;
  label: string;
  kind: VariableKind;
  example?: string;
};

export type VariableGroup = {
  table: string;
  label: string;
  variables: VariableEntry[];
};

export const BTPOS_VARIABLES: VariableGroup[] = [
  {
    table: 'sales',
    label: 'Satış — Genel',
    variables: [
      { key: 'sales.receipt_no',       label: 'Fiş No',              kind: 'text', example: '000123' },
      { key: 'sales.created_at',       label: 'Tarih / Saat',        kind: 'text', example: '04.06.2026 14:30' },
      { key: 'sales.payment_type',     label: 'Ödeme Tipi',          kind: 'text', example: 'Nakit' },
      { key: 'sales.cashier_name',     label: 'Kasiyer Adı',         kind: 'text', example: 'Ali Veli' },
      { key: 'sales.customer_name',    label: 'Müşteri Adı',         kind: 'text', example: 'Ahmet Yılmaz' },
      { key: 'sales.customer_code',    label: 'Müşteri Kodu',        kind: 'text', example: 'C001' },
    ],
  },
  {
    table: 'sales_amounts',
    label: 'Satış — Tutarlar',
    variables: [
      { key: 'sales.subtotal',         label: 'Ara Toplam (KDV hariç)', kind: 'text', example: '93.64' },
      { key: 'sales.vat_amount',       label: 'Toplam KDV',           kind: 'text', example: '16.86' },
      { key: 'sales.total_amount',     label: 'Genel Toplam',         kind: 'text', example: '110.50' },
      { key: 'sales.discount_rate',    label: 'İskonto Oranı (%)',    kind: 'text', example: '5' },
      { key: 'sales.discount_amount',  label: 'İskonto Tutarı',       kind: 'text', example: '5.82' },
      { key: 'sales.net_amount',       label: 'Net Ödenecek',         kind: 'text', example: '104.68' },
      { key: 'sales.cash_amount',      label: 'Nakit',                kind: 'text', example: '104.68' },
      { key: 'sales.card_amount',      label: 'Kart',                 kind: 'text', example: '0.00' },
    ],
  },
  {
    table: 'sale_items',
    label: 'Ürün Listesi (Tablo)',
    variables: [
      {
        key: 'sale_items',
        label: 'Ürünler — 2D JSON dizisi',
        kind: 'table',
        example: '[["Elma","2","5.00","0","10.00"],...]',
      },
    ],
  },
  {
    table: 'vat_groups',
    label: 'KDV Grupları (Tablo)',
    variables: [
      {
        key: 'vat_groups',
        label: 'KDV oranına göre gruplar',
        kind: 'table',
        example: '[["%18","93.64","16.86"]]',
      },
    ],
  },
  {
    table: 'sale_payments',
    label: 'Ödemeler (Tablo)',
    variables: [
      {
        key: 'sale_payments_table',
        label: 'Ödeme yöntemleri listesi',
        kind: 'table',
        example: '[["Nakit","50.00"],["Kart","54.68"]]',
      },
      { key: 'sale_payments.method',        label: 'Ödeme Yöntemi (tek)', kind: 'text', example: 'Kredi Kartı' },
      { key: 'sale_payments.amount',        label: 'Ödeme Tutarı (tek)',  kind: 'text', example: '104.68' },
      { key: 'sale_payments.acquirer_name', label: 'Banka Adı',           kind: 'text', example: 'Akbank' },
    ],
  },
  {
    table: 'customers',
    label: 'Müşteri',
    variables: [
      { key: 'customers.name',        label: 'Ad Soyad',     kind: 'text', example: 'Ahmet Yılmaz' },
      { key: 'customers.phone',       label: 'Telefon',      kind: 'text', example: '0532 000 00 00' },
      { key: 'customers.tax_no',      label: 'Vergi No',     kind: 'text', example: '1234567890' },
      { key: 'customers.address',     label: 'Adres',        kind: 'text', example: 'Atatürk Cad. No:1' },
      { key: 'customers.city',        label: 'Şehir',        kind: 'text', example: 'İstanbul' },
      { key: 'customers.district',    label: 'İlçe',         kind: 'text', example: 'Kadıköy' },
      { key: 'customers.email',       label: 'E-Posta',      kind: 'text', example: 'ahmet@mail.com' },
      { key: 'customers.balance',     label: 'Bakiye',       kind: 'text', example: '-50.00' },
    ],
  },
  {
    table: 'cashiers',
    label: 'Kasiyer',
    variables: [
      { key: 'cashiers.full_name',     label: 'Ad Soyad',      kind: 'text', example: 'Ali Veli' },
      { key: 'cashiers.cashier_code',  label: 'Kasiyer Kodu',  kind: 'text', example: 'K01' },
    ],
  },
  {
    table: 'activation',
    label: 'Terminal',
    variables: [
      { key: 'activation.terminal_id', label: 'Terminal ID', kind: 'text', example: 'T001' },
      { key: 'activation.company_id',  label: 'Firma ID',    kind: 'text', example: 'F001' },
      { key: 'activation.plan_name',   label: 'Plan',        kind: 'text', example: 'Pro' },
    ],
  },
];
