import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import type { Client, DeliveryNote, Product } from "../types";
import { formatCurrency, formatDateISOToLocal, formatQuantity } from "./format";

interface GenerateArgs {
  note: DeliveryNote;
  client: Client;
  // Mapa productId -> Product para resolver nombre/unidad de cada item.
  productsById: Map<string, Product>;
}

const FALLBACK_PRODUCT_NAME = "[Producto no disponible]";

// Genera el PDF del remito y dispara la descarga en el navegador.
export function generateDeliveryNotePDF({ note, client, productsById }: GenerateArgs): void {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const marginX = 15;

  // --- Encabezado ---
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("REMITO", marginX, 20);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Fecha: ${formatDateISOToLocal(note.fecha)}`, pageWidth - marginX, 20, {
    align: "right",
  });

  // Linea separadora
  doc.setLineWidth(0.3);
  doc.line(marginX, 25, pageWidth - marginX, 25);

  // --- Datos del cliente ---
  let y = 33;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("Cliente", marginX, y);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  y += 6;
  doc.text(client.nombre, marginX, y);

  const clientLines: string[] = [];
  if (client.domicilio) clientLines.push(client.domicilio);
  if (client.telefono) clientLines.push(`Tel: ${client.telefono}`);
  if (client.email) clientLines.push(client.email);
  for (const line of clientLines) {
    y += 5;
    doc.text(line, marginX, y);
  }

  // --- Tabla de items ---
  const body = note.items.map((item) => {
    const product = productsById.get(item.productId);
    const nombre = product ? product.nombre : FALLBACK_PRODUCT_NAME;
    const unidad = product?.unidad ?? "-";
    const subtotal = item.cantidad * item.precioUnitario;
    return [
      nombre,
      formatQuantity(item.cantidad),
      unidad,
      formatCurrency(item.precioUnitario),
      formatCurrency(subtotal),
    ];
  });

  const total = note.items.reduce(
    (acc, item) => acc + item.cantidad * item.precioUnitario,
    0,
  );

  autoTable(doc, {
    startY: y + 8,
    margin: { left: marginX, right: marginX },
    head: [["Producto", "Cantidad", "Unidad", "P. Unitario", "Subtotal"]],
    body,
    foot: [["", "", "", "TOTAL", formatCurrency(total)]],
    theme: "grid",
    headStyles: { fillColor: [40, 40, 40], textColor: 255, halign: "center" },
    footStyles: { fillColor: [230, 230, 230], textColor: 20, fontStyle: "bold" },
    styles: { fontSize: 9, cellPadding: 2 },
    columnStyles: {
      0: { cellWidth: "auto" },
      1: { halign: "right", cellWidth: 22 },
      2: { halign: "center", cellWidth: 22 },
      3: { halign: "right", cellWidth: 30 },
      4: { halign: "right", cellWidth: 30 },
    },
  });

  // --- Observaciones (debajo del detalle) ---
  const finalY = (doc as unknown as { lastAutoTable: { finalY: number } })
    .lastAutoTable.finalY;

  if (note.observaciones && note.observaciones.trim()) {
    let obsY = finalY + 12;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("Observaciones", marginX, obsY);

    doc.setFont("helvetica", "normal");
    obsY += 6;
    const wrapped = doc.splitTextToSize(
      note.observaciones.trim(),
      pageWidth - marginX * 2,
    );
    doc.text(wrapped, marginX, obsY);
  }

  // --- Descarga ---
  const safeClient = client.nombre.replace(/[^a-z0-9]+/gi, "_").toLowerCase();
  doc.save(`remito_${safeClient}_${note.fecha}.pdf`);
}
