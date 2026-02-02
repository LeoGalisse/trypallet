import type { Shipment } from "../../entities/shipment.js";
import type { ShipmentRepository } from "./interface.js";

export class InMemoryShipmentRepository implements ShipmentRepository {
  private shipments: Map<string, Shipment>;

  constructor() {
    this.shipments = new Map();
  }

  async create(data: Omit<Shipment, "id">): Promise<Shipment> {
    const shipment = {
      id: crypto.randomUUID(),
      ...data
    };

    this.shipments.set(shipment.id, shipment);

    return shipment;
  }

  async findById(id: string): Promise<Shipment | null> {
    return this.shipments.get(id) ?? null;
  }

  async update(id: string, data: Partial<Omit<Shipment, "id">>): Promise<Shipment | null> {
    const shipment = this.shipments.get(id);

    if (!shipment) {
      return null;
    }

    const updatedShipment = { ...shipment, ...data };
    this.shipments.set(id, updatedShipment);

    return updatedShipment;
  }
}