"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import * as XLSX from "xlsx";

type RowRecord = Record<string, string | number | boolean | null>;

export default function UploadPage() {
  const [rows, setRows] = useState<RowRecord[]>([]);
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const data = new Uint8Array(reader.result as ArrayBuffer);
      const wb = XLSX.read(data, { type: "array" });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json<RowRecord>(ws);
      setRows(json);
    };
    reader.readAsArrayBuffer(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"], "text/csv": [".csv"] } });

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Upload Excel</h1>
      <div {...getRootProps()} className="card p-10 text-center cursor-pointer border-dashed border-2 border-white/20">
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the file here ...</p>
        ) : (
          <p>Drag &apos;n&apos; drop an Excel/CSV file here, or click to select</p>
        )}
      </div>
      {rows.length > 0 && (
        <div className="card overflow-auto">
          <table className="w-full text-sm">
            <thead className="text-white/60">
              <tr>
                {Object.keys(rows[0]).map((k) => (
                  <th key={k} className="text-left p-2">{k}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.slice(0, 50).map((r, idx) => (
                <tr key={idx} className="border-t border-white/10">
                  {Object.values(r).map((v, i) => (
                    <td key={i} className="p-2">{String(v)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}


