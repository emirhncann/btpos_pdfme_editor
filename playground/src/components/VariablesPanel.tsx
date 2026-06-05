import React, { useState, useRef, useEffect } from 'react';
import { Database, X, Copy, Check } from 'lucide-react';
import { BTPOS_VARIABLES } from '../lib/btposVariables';

export function VariablesPanel() {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const handleOpen = () => {
    if (open) {
      setOpen(false);
      return;
    }
    if (btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setPos({ top: rect.bottom + 4, left: rect.left });
    }
    setOpen(true);
  };

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(e.target as Node) &&
        btnRef.current &&
        !btnRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [open]);

  const copyVariable = (key: string, kind: 'text' | 'table') => {
    const text = kind === 'table' ? key : `{${key}}`;
    void navigator.clipboard.writeText(text).then(() => {
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 1500);
    });
  };

  return (
    <>
      <button
        ref={btnRef}
        onClick={handleOpen}
        className="inline-flex items-center gap-1.5 rounded border border-gray-300 bg-white px-2 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50 transition"
      >
        <Database className="size-3.5" />
        Değişkenler
      </button>

      {open && (
        <div
          ref={panelRef}
          style={{ position: 'fixed', top: pos.top, left: pos.left, zIndex: 9999 }}
          className="w-80 rounded-lg border border-gray-200 bg-white shadow-xl"
        >
          <div className="flex items-center justify-between border-b px-3 py-2">
            <span className="text-sm font-semibold text-gray-800">BTPOS Değişkenleri</span>
            <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600">
              <X className="size-4" />
            </button>
          </div>

          <div className="max-h-96 overflow-y-auto">
            <div className="px-3 py-2 text-xs text-gray-500 bg-gray-50 border-b">
              Tıklayarak kopyala → metin alanına yapıştır
            </div>

            {BTPOS_VARIABLES.map((group) => (
              <div key={group.table}>
                <div className="bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-600 uppercase tracking-wide border-b">
                  {group.label}
                </div>
                {group.variables.map((v) => {
                  const displayText = v.kind === 'table' ? v.key : `{${v.key}}`;
                  const isCopied = copiedKey === v.key;
                  return (
                    <button
                      key={v.key}
                      onClick={() => copyVariable(v.key, v.kind)}
                      className="w-full flex items-center justify-between gap-2 px-3 py-2 text-left hover:bg-blue-50 transition border-b border-gray-50"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <code className="text-xs font-mono text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">
                            {displayText}
                          </code>
                          {v.kind === 'table' && (
                            <span className="text-xs bg-orange-100 text-orange-700 px-1 py-0.5 rounded">
                              tablo
                            </span>
                          )}
                        </div>
                        <div className="mt-0.5 text-xs text-gray-500 truncate">{v.label}</div>
                        {v.example && (
                          <div className="text-xs text-gray-400 truncate">örn: {v.example}</div>
                        )}
                      </div>
                      <div className="shrink-0 text-gray-400">
                        {isCopied ? (
                          <Check className="size-3.5 text-green-500" />
                        ) : (
                          <Copy className="size-3.5" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            ))}
          </div>

          <div className="border-t px-3 py-2 bg-gray-50 text-xs text-gray-500">
            <strong>Tablo için:</strong> Table schema → content alanına yapıştır
          </div>
        </div>
      )}
    </>
  );
}
