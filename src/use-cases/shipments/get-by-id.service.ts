import type { Shipment } from "../../entities/shipment.js";
import type { ShipmentRepository } from "../../repositories/shipment/interface.js";
import { ShipmentDoesNotExistError } from "../_errors/shipment-does-not-exist.js";

export class GetShipmentUseCase {
  constructor(private shipmentRepository: ShipmentRepository) { }

  async execute(id: string): Promise<Shipment | null> {
    const shipment = await this.shipmentRepository.findById(id);

    if (!shipment) {
      throw new ShipmentDoesNotExistError();
    }

    return shipment;
  }
}