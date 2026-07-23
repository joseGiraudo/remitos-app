import { useMemo, useState } from "react";
import type { Client, DeliveryItem, DeliveryNote, Product } from "../types";
import { todayISO } from "../utils/format";
import { generateDeliveryNotePDF } from "../utils/pdf";
import { ClientSelect } from "./ClientSelect";
import { ProductPicker } from "./ProductPicker";
import { ItemsList } from "./ItemsList";
import { ConfirmModal } from "./ConfirmModal";

interface Props {
  products: Product[];
  clients: Client[];
}

export function DeliveryNoteForm({ products, clients }: Props) {
  const [clientId, setClientId] = useState<string | null>(null);
  const [items, setItems] = useState<DeliveryItem[]>([]);
  const [observaciones, setObservaciones] = useState("");
  const [fecha, setFecha] = useState<string>(todayISO());
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const productsById = useMemo(
    () => new Map(products.map((p) => [p.id, p])),
    [products],
  );
  const quantities = useMemo(
    () => new Map(items.map((i) => [i.productId, i.cantidad])),
    [items],
  );

  const selectedClient = clients.find((c) => c.id === clientId) ?? null;

  // Cada toque sobre una pizza suma una unidad.
  function handleAddProduct(product: Product) {
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === product.id);
      if (existing) {
        return prev.map((i) =>
          i.productId === product.id ? { ...i, cantidad: i.cantidad + 1 } : i,
        );
      }
      return [
        ...prev,
        {
          productId: product.id,
          cantidad: 1,
          precioUnitario: product.precioUnitario,
        },
      ];
    });
  }

  function handleChangeCantidad(productId: string, cantidad: number) {
    setItems((prev) =>
      prev.map((i) =>
        i.productId === productId
          ? { ...i, cantidad: Number.isFinite(cantidad) ? cantidad : 0 }
          : i,
      ),
    );
  }

  function handleChangePrecio(productId: string, precio: number) {
    setItems((prev) =>
      prev.map((i) =>
        i.productId === productId
          ? { ...i, precioUnitario: Number.isFinite(precio) ? precio : 0 }
          : i,
      ),
    );
  }

  function handleRemove(productId: string) {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  }

  function validate(): string | null {
    if (!clientId) return "Elegi un cliente.";
    if (items.length === 0) return "Agrega al menos un producto.";
    if (items.some((i) => i.cantidad <= 0))
      return "Las cantidades deben ser mayores a cero.";
    return null;
  }

  // Paso 1: valida y abre el modal de confirmacion.
  function handleReview() {
    const validationError = validate();
    if (validationError) {
      setErrorMsg(validationError);
      return;
    }
    setErrorMsg(null);
    setShowConfirm(true);
  }

  // Paso 2: confirma en el modal -> genera y descarga el PDF.
  function handleConfirm() {
    if (!selectedClient) {
      setShowConfirm(false);
      setErrorMsg("El cliente seleccionado ya no existe.");
      return;
    }

    const note: DeliveryNote = {
      id: crypto.randomUUID(),
      fecha,
      clientId: selectedClient.id,
      items,
      observaciones: observaciones.trim() || undefined,
    };

    generateDeliveryNotePDF({ note, client: selectedClient, productsById });
    setShowConfirm(false);
  }

  function handleReset() {
    setClientId(null);
    setItems([]);
    setObservaciones("");
    setFecha(todayISO());
    setErrorMsg(null);
  }

  return (
    <div className="form">
      <div className="form-row">
        <ClientSelect
          clients={clients}
          selectedId={clientId}
          onChange={setClientId}
        />
        <div className="field field-fecha">
          <label htmlFor="fecha">Fecha</label>
          <input
            id="fecha"
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
          />
        </div>
      </div>

      <ProductPicker
        products={products}
        quantities={quantities}
        onAdd={handleAddProduct}
      />

      <div className="field">
        <label>Detalle</label>
        <ItemsList
          items={items}
          productsById={productsById}
          onChangeCantidad={handleChangeCantidad}
          onChangePrecio={handleChangePrecio}
          onRemove={handleRemove}
        />
      </div>

      <div className="field">
        <label htmlFor="observaciones">Observaciones (opcional)</label>
        <textarea
          id="observaciones"
          rows={3}
          placeholder="Notas adicionales..."
          value={observaciones}
          onChange={(e) => setObservaciones(e.target.value)}
        />
      </div>

      {errorMsg && <p className="error-msg">{errorMsg}</p>}

      <div className="form-actions">
        <button type="button" className="btn-secondary" onClick={handleReset}>
          Limpiar
        </button>
        <button type="button" className="btn-primary" onClick={handleReview}>
          Generar PDF
        </button>
      </div>

      {showConfirm && selectedClient && (
        <ConfirmModal
          client={selectedClient}
          items={items}
          productsById={productsById}
          fecha={fecha}
          observaciones={observaciones}
          onConfirm={handleConfirm}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </div>
  );
}
