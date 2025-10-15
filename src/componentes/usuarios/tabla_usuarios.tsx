import React, { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import data from "../../../MOCK_DATA.json";

const columnHelper = createColumnHelper();

const columns = [
  columnHelper.accessor("nombre", { header: "Nombre" }),
  columnHelper.accessor("apellido_paterno", { header: "Apellido Paterno" }),
  columnHelper.accessor("apellido_materno", { header: "Apellido Materno" }),
  columnHelper.accessor("correo_electronico", { header: "Correo Electrónico" }),
  columnHelper.accessor("fecha_nacimiento", { header: "Fecha de Nacimiento" }),
  columnHelper.accessor("direccion", { header: "Dirección" }),
];

function TablaUsuarios() {
  const [filtroColumna, setFiltroColumna] = useState("nombre");
  const [filtroValor, setFiltroValor] = useState("");
  const [columnFilters, setColumnFilters] = useState([]);
  const [sorting, setSorting] = useState([]);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const handleFiltroColumnaChange = (e) => {
    const nuevaColumna = e.target.value;
    setFiltroColumna(nuevaColumna);
    setFiltroValor("");

    setColumnFilters([
      {
        id: nuevaColumna,
        value: "",
      },
    ]);
  };

  const handleFiltroValorChange = (e) => {
    const nuevoValor = e.target.value;
    setFiltroValor(nuevoValor);

    setColumnFilters([
      {
        id: filtroColumna,
        value: nuevoValor,
      },
    ]);
  };

  return (
    <div className="overflow-x-auto">
      <div className="mb-4 flex gap-4">
        <select
          value={filtroColumna}
          onChange={handleFiltroColumnaChange}
          className="border p-2 rounded"
        >
          <option value="nombre">Nombre</option>
          <option value="apellido_paterno">Apellido Paterno</option>
          <option value="apellido_materno">Apellido Materno</option>
          <option value="correo_electronico">Correo Electrónico</option>
          <option value="fecha_nacimiento">Fecha de Nacimiento</option>
          <option value="direccion">Dirección</option>
        </select>

        <input
          type="text"
          placeholder={`Buscar por ${filtroColumna.replace("_", " ")}`}
          value={filtroValor}
          onChange={handleFiltroValorChange}
          className="border p-2 rounded flex-1"
        />
      </div>

      <table className="w-full border border-gray-300 border-collapse table-auto">
        <thead className="bg-gray-800 text-white">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  onClick={header.column.getToggleSortingHandler()}
                  className="text-left p-4 border border-gray-300 cursor-pointer select-none"
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                  {{
                    asc: "⬆️",
                    desc: "⬇️",
                  }[header.column.getIsSorted()] ?? null}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  className="text-left p-4 border border-gray-200"
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex gap-2 mt-4">
        <button
          className="px-4 py-2 bg-gray-500 text-white rounded disabled:opacity-50 cursor-pointer"
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
        >
          Primera Página
        </button>
        <button
          className="px-4 py-2 bg-gray-500 text-white rounded disabled:opacity-50 cursor-pointer"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Página Anterior
        </button>
        <button
          className="px-4 py-2 bg-gray-900 text-white rounded disabled:opacity-50 cursor-pointer"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Página Siguiente
        </button>
        <button
          className="px-4 py-2 bg-gray-900 text-white rounded disabled:opacity-50 cursor-pointer"
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
        >
          Última Página
        </button>
      </div>
    </div>
  );
}

export default TablaUsuarios;
