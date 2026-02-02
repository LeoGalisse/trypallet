import type { Shipment } from "../../entities/shipment.js";
import type { ShipmentRepository } from "../../repositories/shipment/interface.js";
import type { PathRepository } from "../../repositories/path/interface.js";
import { NoRouteAvailableError } from "../_errors/no-route-available.js";

interface CreateShipmentUseCaseResponse {
  shipment: Shipment;
  eta: number;
}

export class CreateShipmentUseCase {
  constructor(
    private shipmentRepository: ShipmentRepository,
    private pathRepository: PathRepository
  ) { }

  async execute({ from, to, status }: Omit<Shipment, "id" | "eta">): Promise<CreateShipmentUseCaseResponse> {
    const { path, distance } = this.pathRepository.getShortestPath(from, to);

    if (path.length === 0) {
      throw new NoRouteAvailableError(from, to);
    }

    const shipment = await this.shipmentRepository.create({
      from,
      to,
      status,
      eta: distance
    });

    return { shipment, eta: distance };
  }
}
