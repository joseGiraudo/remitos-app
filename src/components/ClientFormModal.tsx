import { useState } from "react";
import type { Client } from "../types";

interface Props {
  onSubmit: (data: Omit<Client, "id">) => void;
  onCancel: () => void;
}

// Modal para cargar un cliente que no esta en clients.json. El cliente vive
// solo en la sesion del remito actual; no se persiste al JSON original.
export function ClientFormModal({ onSubmit, onCancel }: Props) {
  const [nombre, setNombre] = useState("");
  const [domicilio, setDomicilio] = useState("");
  const [telefono, setTelefono] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!nombre.trim()) {
      setError("El nombre es obligatorio.");
      return;
    }
    onSubmit({
      nombre: nombre.trim(),
      domicilio: domicilio.trim() || undefined,
      telefono: telefono.trim() || undefined,
      email: email.trim() || undefined,
    });
  }

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-label="Nuevo cliente"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="modal-head">
          <h2>Nuevo cliente</h2>
        </header>

        <form onSubmit={handleSubmit}>
          <div className="modal-body modal-form">
            <div className="field">
              <label htmlFor="nc-nombre">Nombre *</label>
              <input
                id="nc-nombre"
                type="text"
                value={nombre}
                autoFocus
                onChange={(e) => setNombre(e.target.value)}
              />
            </div>
            <div className="field">
              <label htmlFor="nc-domicilio">Domicilio</label>
              <input
                id="nc-domicilio"
                type="text"
                value={domicilio}
                onChange={(e) => setDomicilio(e.target.value)}
              />
            </div>
            <div className="field">
              <label htmlFor="nc-telefono">Telefono</label>
              <input
                id="nc-telefono"
                type="text"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
              />
            </div>
            <div className="field">
              <label htmlFor="nc-email">Email</label>
              <input
                id="nc-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {error && <p className="error-msg">{error}</p>}
          </div>

          <footer className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onCancel}>
              Cancelar
            </button>
            <button type="submit" className="btn-primary">
              Agregar cliente
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
}
