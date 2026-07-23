import type { Client, DeliveryItem, Product } from "../types";
import { formatCurrency, formatDateISOToLocal, formatQuantity } from "../utils/format";

interface Props {
  client: Client;
  items: DeliveryItem[];
  productsById: Map<string, Product>;
  fecha: string;
  observaciones?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmModal({
  client,
  items,
  productsById,
  fecha,
  observaciones,
  onConfirm,
  onCancel,
}: Props) {
  const total = items.reduce(
    (acc, item) => acc + item.cantidad * item.precioUnitario,
    0,
  );

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-label="Confirmar remito"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="modal-head">
          <h2>Confirmar remito</h2>
          <span className="modal-fecha">{formatDateISOToLocal(fecha)}</span>
        </header>

        <div className="modal-body">
          <section className="modal-section">
            <h3>Cliente</h3>
            <p className="modal-client-name">{client.nombre}</p>
            {client.domicilio && client.domicilio !== "-" && (
              <p className="modal-muted">{client.domicilio}</p>
            )}
            {client.telefono && client.telefono !== "-" && (
              <p className="modal-muted">Tel: {client.telefono}</p>
            )}
          </section>

          <section className="modal-section">
            <h3>Detalle</h3>
            <table className="modal-table">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th className="col-num">Cant.</th>
                  <th className="col-num">P. Unit.</th>
                  <th className="col-num">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => {
                  const product = productsById.get(item.productId);
                  const subtotal = item.cantidad * item.precioUnitario;
                  return (
                    <tr key={item.productId}>
                      <td>{product?.nombre ?? "[Producto no disponible]"}</td>
                      <td className="col-num">{formatQuantity(item.cantidad)}</td>
                      <td className="col-num">
                        {formatCurrency(item.precioUnitario)}
                      </td>
                      <td className="col-num">{formatCurrency(subtotal)}</td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={3} className="col-num total-label">
                    TOTAL
                  </td>
                  <td className="col-num total-value">{formatCurrency(total)}</td>
                </tr>
              </tfoot>
            </table>
          </section>

          {observaciones && observaciones.trim() && (
            <section className="modal-section">
              <h3>Observaciones</h3>
              <p className="modal-muted">{observaciones.trim()}</p>
            </section>
          )}
        </div>

        <footer className="modal-actions">
          <button type="button" className="btn-secondary" onClick={onCancel}>
            Volver
          </button>
          <button type="button" className="btn-primary" onClick={onConfirm}>
            Confirmar y descargar
          </button>
        </footer>
      </div>
    </div>
  );
}
