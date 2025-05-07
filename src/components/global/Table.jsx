import React from "react";

export default function Table({
  title = "",
  columns = [],
  data = [],
  density = "medium", // "high" | "medium" | "low"
}) {
  return (
    <div className={`br-table ${density}`} title={title}>
      <div className="table-header">
        <div className="top-bar">
          {title && <div className="table-title">{title}</div>}
        </div>
      </div>

      <div className="responsive">
        <table>
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.accessor}>{col.header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((row, i) => (
                <tr key={i}>
                  {columns.map((col) => (
                    <td key={col.accessor}>{row[col.accessor]}</td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="text-center">
                  Nenhum registro encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}