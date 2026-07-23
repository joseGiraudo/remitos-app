export interface Product {
  id: string;
  nombre: string;
  descripcion?: string;
  precioUnitario: number;
  unidad?: string;
}

export interface Client {
  id: string;
  nombre: string;
  domicilio?: string;
  telefono?: string;
  email?: string;
}

export interface DeliveryItem {
  productId: string;
  cantidad: number;
  // "Foto" del precio al momento de generar el remito. Se inicializa con el
  // precioUnitario del producto pero puede sobreescribirse por linea sin tocar
  // el JSON original.
  precioUnitario: number;
}

export interface DeliveryNote {
  id: string;
  fecha: string; // ISO date (yyyy-mm-dd)
  clientId: string;
  items: DeliveryItem[];
  observaciones?: string;
}
