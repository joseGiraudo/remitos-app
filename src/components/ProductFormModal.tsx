import { useState } from "react";
import type { Product } from "../types";

interface Props {
  onSubmit: (data: Omit<Product, "id">) => void;
  onCancel: () => void;
}

// Modal para cargar un producto que no esta en products.json. El producto vive
// solo en la sesion del remito actual; no se persiste al JSON original.
export function ProductFormModal({ onSubmit, onCancel }: Props) {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState("");
  const [unidad, setUnidad] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!nombre.trim()) {
      setError("El nombre es obligatorio.");
      return;
    }
    const precioNum = Number(precio);
    if (!Number.isFinite(precioNum) || precioNum < 0) {
      setError("Ingresa un precio valido.");
      return;
    }
    onSubmit({
      nombre: nombre.trim(),
      descripcion: descripcion.trim() || undefined,
      precioUnitario: precioNum,
      unidad: unidad.trim() || undefined,
    });
  }

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-label="Nuevo producto"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="modal-head">
          <h2>Nuevo producto</h2>
        </header>

        <form onSubmit={handleSubmit}>
          <div className="modal-body modal-form">
            <div className="field">
              <label htmlFor="np-nombre">Nombre *</label>
              <input
                id="np-nombre"
                type="text"
                value={nombre}
                autoFocus
                onChange={(e) => setNombre(e.target.value)}
              />
            </div>
            <div className="field">
              <label htmlFor="np-descripcion">Descripcion</label>
              <input
                id="np-descripcion"
                type="text"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
              />
            </div>
            <div className="form-row">
              <div className="field">
                <label htmlFor="np-precio">Precio unitario *</label>
                <input
                  id="np-precio"
                  type="number"
                  min={0}
                  step="any"
                  value={precio}
                  onChange={(e) => setPrecio(e.target.value)}
                />
              </div>
              <div className="field">
                <label htmlFor="np-unidad">Unidad</label>
                <input
                  id="np-unidad"
                  type="text"
                  placeholder="ej: kg, unidad"
                  value={unidad}
                  onChange={(e) => setUnidad(e.target.value)}
                />
              </div>
            </div>

            {error && <p className="error-msg">{error}</p>}
          </div>

          <footer className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onCancel}>
              Cancelar
            </button>
            <button type="submit" className="btn-primary">
              Agregar producto
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
}
