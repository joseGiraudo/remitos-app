import type { DeliveryItem, Product } from "../types";
import { formatCurrency } from "../utils/format";

interface Props {
  items: DeliveryItem[];
  productsById: Map<string, Product>;
  onChangeCantidad: (productId: string, cantidad: number) => void;
  onChangePrecio: (productId: string, precio: number) => void;
  onRemove: (productId: string) => void;
}

export function ItemsList({
  items,
  productsById,
  onChangeCantidad,
  onChangePrecio,
  onRemove,
}: Props) {
  if (items.length === 0) {
    return <p className="items-empty">Toca una pizza para agregarla al pedido.</p>;
  }

  const total = items.reduce(
    (acc, item) => acc + item.cantidad * item.precioUnitario,
    0,
  );

  return (
    <div className="items-list">
      {items.map((item) => {
        const product = productsById.get(item.productId);
        const subtotal = item.cantidad * item.precioUnitario;
        return (
          <div key={item.productId} className="item-card">
            <div className="item-card-head">
              <span className="item-name">
                {product?.nombre ?? "[Producto no disponible]"}
                {product?.unidad ? (
                  <span className="item-unidad"> / {product.unidad}</span>
                ) : null}
              </span>
              <button
                type="button"
                className="btn-remove"
                onClick={() => onRemove(item.productId)}
                aria-label="Quitar"
              >
                ✕
              </button>
            </div>

            <div className="item-card-body">
              <div className="stepper">
                <button
                  type="button"
                  aria-label="Restar"
                  onClick={() =>
                    onChangeCantidad(item.productId, Math.max(1, item.cantidad - 1))
                  }
                >
                  −
                </button>
                <input
                  type="number"
                  min={1}
                  step="any"
                  value={item.cantidad}
                  onChange={(e) =>
                    onChangeCantidad(item.productId, Number(e.target.value))
                  }
                />
                <button
                  type="button"
                  aria-label="Sumar"
                  onClick={() =>
                    onChangeCantidad(item.productId, item.cantidad + 1)
                  }
                >
                  +
                </button>
              </div>

              <label className="item-precio">
                <span>Precio</span>
                <input
                  type="number"
                  min={0}
                  step="any"
                  value={item.precioUnitario}
                  onChange={(e) =>
                    onChangePrecio(item.productId, Number(e.target.value))
                  }
                />
              </label>

              <span className="item-subtotal">{formatCurrency(subtotal)}</span>
            </div>
          </div>
        );
      })}

      <div className="items-total">
        <span>TOTAL</span>
        <span>{formatCurrency(total)}</span>
      </div>
    </div>
  );
}
