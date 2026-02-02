import type { Request, Response } from "express";
import { z } from "zod";
import { UpdateShipmentStatusUseCase } from "../../../use-cases/shipments/update-status.service.js";
import { shipmentRepository } from "../../../server.js";
import { ShipmentDoesNotExistError } from "../../../use-cases/_errors/shipment-does-not-exist.js";

export async function updateShipmentStatus(request: Request, response: Response) {
  const updateShipmentParamsSchema = z.object({
    id: z.string()
  });

  const updateShipmentBodySchema = z.object({
    status: z.enum(["pending", "in_progress", "delivered"])
  });

  const { id } = updateShipmentParamsSchema.parse(request.params);
  const { status } = updateShipmentBodySchema.parse(request.body);

  try {
    const updateShipmentStatusUseCase = new UpdateShipmentStatusUseCase(shipmentRepository);

    const shipment = await updateShipmentStatusUseCase.execute(id, status);

    return response.status(200).json(shipment);
  } catch (error) {
    if (error instanceof ShipmentDoesNotExistError) {
      return response.status(404).json({ error: error.message });
    }

    return response.status(500).json({ error });
  }
}
