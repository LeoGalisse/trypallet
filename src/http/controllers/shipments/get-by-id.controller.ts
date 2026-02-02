import type { Request, Response } from "express";
import { z } from "zod";
import { InMemoryShipmentRepository } from "../../../repositories/shipment/in-memory.js";
import { GetShipmentUseCase } from "../../../use-cases/shipments/get-by-id.service.js";
import { shipmentRepository } from "../../../server.js";
import { ShipmentDoesNotExistError } from "../../../use-cases/_errors/shipment-does-not-exist.js";

export async function getShipmentById(request: Request, response: Response) {
  const getShipmentParamsSchema = z.object({
    id: z.string()
  });

  const { id } = getShipmentParamsSchema.parse(request.params);

  try {
    const getShipmentUseCase = new GetShipmentUseCase(shipmentRepository);

    const shipment = await getShipmentUseCase.execute(id);

    return response.status(200).json(shipment);
  } catch (error) {
    if (error instanceof ShipmentDoesNotExistError) {
      return response.status(404).json({ error: error.message });
    }

    return response.status(500).json({ error });
  }
}
