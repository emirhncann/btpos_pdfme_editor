import React, { useContext, useState } from 'react';
import type { SidebarProps } from '../../../../types.js';
import { DESIGNER_CLASSNAME } from '../../../../constants.js';
import { I18nContext } from '../../../../contexts.js';
import { Input, Typography, Button, InputNumber, Divider } from 'antd';
import SelectableSortableContainer from './SelectableSortableContainer.js';
import { SidebarBody, SidebarFooter, SidebarFrame, SidebarHeader } from '../layout.js';
import { isBlankPdf } from '@pdfme/common';

const { Text } = Typography;
const { TextArea } = Input;

const PAPER_PRESETS = [
  { label: 'A4', width: 210, height: 297 },
  { label: 'A5', width: 148, height: 210 },
  { label: '80mm', width: 80, height: 297 },
  { label: '58mm', width: 58, height: 297 },
];

const ListView = (
  props: Pick<
    SidebarProps,
    | 'schemas'
    | 'onSortEnd'
    | 'onEdit'
    | 'hoveringSchemaId'
    | 'onChangeHoveringSchemaId'
    | 'changeSchemas'
    | 'basePdf'
    | 'onChangeBasePdf'
  >,
) => {
  const {
    schemas,
    onSortEnd,
    onEdit,
    hoveringSchemaId,
    onChangeHoveringSchemaId,
    changeSchemas,
    basePdf,
    onChangeBasePdf,
  } = props;
  const i18n = useContext(I18nContext);
  const [isBulkUpdateFieldNamesMode, setIsBulkUpdateFieldNamesMode] = useState(false);
  const [fieldNamesValue, setFieldNamesValue] = useState('');

  const commitBulk = () => {
    const names = fieldNamesValue.split('\n');
    if (names.length !== schemas.length) {
      alert(i18n('errorBulkUpdateFieldName'));
    } else {
      changeSchemas(
        names.map((value, index) => ({
          key: 'name',
          value,
          schemaId: schemas[index].id,
        })),
      );
      setIsBulkUpdateFieldNamesMode(false);
    }
  };

  const startBulk = () => {
    setFieldNamesValue(schemas.map((s) => s.name).join('\n'));
    setIsBulkUpdateFieldNamesMode(true);
  };

  const blankPdf = isBlankPdf(basePdf) ? basePdf : null;

  const handleWidthChange = (value: number | null) => {
    if (!blankPdf || value === null || value <= 0) return;
    onChangeBasePdf({ ...blankPdf, width: value });
  };

  const handleHeightChange = (value: number | null) => {
    if (!blankPdf || value === null || value < 0) return;
    onChangeBasePdf({ ...blankPdf, height: value });
  };

  const applyPreset = (width: number, height: number) => {
    if (!blankPdf) return;
    onChangeBasePdf({ ...blankPdf, width, height });
  };

  return (
    <SidebarFrame className={DESIGNER_CLASSNAME + 'list-view'}>
      <SidebarHeader>
        <Text strong style={{ textAlign: 'center', width: '100%' }}>
          {i18n('fieldsList')}
        </Text>
      </SidebarHeader>
      <SidebarBody>
        {isBulkUpdateFieldNamesMode ? (
          <TextArea
            wrap="off"
            value={fieldNamesValue}
            onChange={(e) => setFieldNamesValue(e.target.value)}
            style={{
              height: '100%',
              width: '100%',
              resize: 'none',
              lineHeight: '2.75rem',
            }}
          />
        ) : (
          <>
            <SelectableSortableContainer
              schemas={schemas}
              hoveringSchemaId={hoveringSchemaId}
              onChangeHoveringSchemaId={onChangeHoveringSchemaId}
              onSortEnd={onSortEnd}
              onEdit={onEdit}
            />

            {blankPdf && (
              <>
                <Divider style={{ margin: '8px 0' }} />
                <div style={{ padding: '0 8px 8px' }}>
                  <Text strong style={{ display: 'block', marginBottom: 8 }}>
                    {i18n('paperSize')}
                  </Text>

                  <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                    <div style={{ flex: 1 }}>
                      <Text style={{ fontSize: 11, display: 'block', marginBottom: 2 }}>
                        {i18n('width')} (mm)
                      </Text>
                      <InputNumber
                        size="small"
                        style={{ width: '100%' }}
                        min={1}
                        max={1000}
                        value={blankPdf.width}
                        onChange={handleWidthChange}
                        precision={1}
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      <Text style={{ fontSize: 11, display: 'block', marginBottom: 2 }}>
                        {i18n('height')} (mm)
                      </Text>
                      <InputNumber
                        size="small"
                        style={{ width: '100%' }}
                        min={1}
                        max={5000}
                        value={blankPdf.height}
                        onChange={handleHeightChange}
                        precision={1}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                    {PAPER_PRESETS.map((preset) => (
                      <Button
                        key={preset.label}
                        size="small"
                        type={
                          blankPdf.width === preset.width && blankPdf.height === preset.height
                            ? 'primary'
                            : 'default'
                        }
                        onClick={() => applyPreset(preset.width, preset.height)}
                      >
                        {preset.label}
                      </Button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </SidebarBody>
      <SidebarFooter>
        {isBulkUpdateFieldNamesMode ? (
          <>
            <Button
              className={DESIGNER_CLASSNAME + 'bulk-commit'}
              size="small"
              type="text"
              onClick={commitBulk}
            >
              <u> {i18n('commitBulkUpdateFieldName')}</u>
            </Button>
            <span>/</span>
            <Button
              className={DESIGNER_CLASSNAME + 'bulk-cancel'}
              size="small"
              type="text"
              onClick={() => setIsBulkUpdateFieldNamesMode(false)}
            >
              <u> {i18n('cancel')}</u>
            </Button>
          </>
        ) : (
          <Button
            className={DESIGNER_CLASSNAME + 'bulk-update'}
            size="small"
            type="text"
            onClick={startBulk}
          >
            <u> {i18n('bulkUpdateFieldName')}</u>
          </Button>
        )}
      </SidebarFooter>
    </SidebarFrame>
  );
};

export default ListView;
