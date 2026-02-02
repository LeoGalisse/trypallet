import type { Shipment } from "../../entities/shipment.js";

export interface ShipmentRepository {
  create(data: Omit<Shipment, "id">): Promise<Shipment>;
  findById(id: string): Promise<Shipment | null>;
  update(id: string, data: Partial<Omit<Shipment, "id">>): Promise<Shipment | null>;
}