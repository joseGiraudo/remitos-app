import { useMemo, useState } from "react";
import type { Product } from "../types";
import { formatCurrency } from "../utils/format";

interface Props {
  products: Product[];
  // productId -> cantidad ya cargada, para mostrar el badge en cada tarjeta.
  quantities: Map<string, number>;
  onAdd: (product: Product) => void;
  onRequestNew: () => void;
}

// Umbral a partir del cual mostramos el buscador. Con pocos productos
// (ej: las pizzas) la grilla sola alcanza y queda mas limpio.
const SEARCH_THRESHOLD = 8;

export function ProductPicker({
  products,
  quantities,
  onAdd,
  onRequestNew,
}: Props) {
  const [query, setQuery] = useState("");
  const showSearch = products.length > SEARCH_THRESHOLD;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;
    return products.filter(
      (p) =>
        p.nombre.toLowerCase().includes(q) ||
        (p.descripcion?.toLowerCase().includes(q) ?? false),
    );
  }, [products, query]);

  return (
    <div className="field">
      <label>Productos</label>
      {showSearch && (
        <input
          type="text"
          placeholder="Buscar producto..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      )}

      <div className="product-grid">
        {filtered.length === 0 && (
          <p className="product-grid-empty">Sin resultados</p>
        )}
        {filtered.map((p) => {
          const qty = quantities.get(p.id) ?? 0;
          return (
            <button
              key={p.id}
              type="button"
              className={`product-card${qty > 0 ? " is-selected" : ""}`}
              onClick={() => onAdd(p)}
            >
              {qty > 0 && <span className="product-badge">{qty}</span>}
              <span className="product-card-name">{p.nombre}</span>
              <span className="product-card-price">
                {formatCurrency(p.precioUnitario)}
              </span>
            </button>
          );
        })}

        <button
          type="button"
          className="product-card product-card-add"
          onClick={onRequestNew}
          title="Cargar un producto que no esta en la lista"
        >
          <span className="product-card-add-icon">+</span>
          <span className="product-card-name">Nuevo producto</span>
        </button>
      </div>
    </div>
  );
}
