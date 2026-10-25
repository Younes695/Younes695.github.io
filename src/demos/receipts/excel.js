// Excel export in the browser: one sheet of items, one of totals (same layout as the Python tool).
import writeExcelFile from "write-excel-file/browser";

export const MONEY_FIELDS = [
  ["subtotal", "Subtotal"],
  ["tax", "Tax"],
  ["service_charge", "Service charge"],
  ["discount", "Discount"],
  ["total", "Total"],
  ["cash", "Cash"],
  ["change", "Change"],
];

const header = (labels) => labels.map((value) => ({ value, fontWeight: "bold" }));
const cell = (value) => (value === null || value === undefined || value === "" ? null : { value });

export async function downloadExcel(receipt, fileName = "receipt.xlsx") {
  const items = [
    header(["Item", "Quantity", "Unit price", "Price"]),
    ...receipt.items.map((it) => [cell(it.name), cell(it.quantity), cell(it.unit_price), cell(it.price)]),
  ];
  const totals = [header(["Field", "Amount"]), ...MONEY_FIELDS.map(([key, label]) => [cell(label), cell(receipt[key])])];
  await writeExcelFile([
    { data: items, sheet: "Items", columns: [{ width: 36 }, { width: 10 }, { width: 12 }, { width: 12 }], stickyRowsCount: 1 },
    { data: totals, sheet: "Totals", columns: [{ width: 18 }, { width: 14 }], stickyRowsCount: 1 },
  ]).toFile(fileName);
}
