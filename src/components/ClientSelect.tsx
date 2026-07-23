import type { Client } from "../types";

interface Props {
  clients: Client[];
  selectedId: string | null;
  onChange: (clientId: string) => void;
}

export function ClientSelect({ clients, selectedId, onChange }: Props) {
  const selected = clients.find((c) => c.id === selectedId) ?? null;

  return (
    <div className="field">
      <label htmlFor="client-select">Cliente</label>
      <select
        id="client-select"
        value={selectedId ?? ""}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="" disabled>
          Seleccionar cliente...
        </option>
        {clients.map((c) => (
          <option key={c.id} value={c.id}>
            {c.nombre}
          </option>
        ))}
      </select>

      {selected && (
        <div className="client-details">
          {selected.domicilio && <span>{selected.domicilio}</span>}
          {selected.telefono && <span>Tel: {selected.telefono}</span>}
          {selected.email && <span>{selected.email}</span>}
        </div>
      )}
    </div>
  );
}
