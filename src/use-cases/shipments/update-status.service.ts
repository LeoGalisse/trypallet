import type { Shipment } from "../../entities/shipment.js";
import type { ShipmentRepository } from "../../repositories/shipment/interface.js";
import { ShipmentDoesNotExistError } from "../_errors/shipment-does-not-exist.js";

export class UpdateShipmentStatusUseCase {
  constructor(private shipmentRepository: ShipmentRepository) { }

  async execute(id: string, status: string): Promise<Shipment> {
    const shipment = await this.shipmentRepository.update(id, { status });

    if (!shipment) {
      throw new ShipmentDoesNotExistError();
    }

    return shipment;
  }
}