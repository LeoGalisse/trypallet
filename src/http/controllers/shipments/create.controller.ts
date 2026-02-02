import type { Request, Response } from "express";
import { z } from "zod";
import { pathRepository, shipmentRepository } from "../../../server.js";
import { CreateShipmentUseCase } from "../../../use-cases/shipments/create.service.js";
import { NoRouteAvailableError } from "../../../use-cases/_errors/no-route-available.js";

export async function createShipment(request: Request, response: Response) {
  const createShipmentBodySchema = z.object({
    from: z.string(),
    to: z.string(),
    status: z.enum(["pending", "in_progress", "delivered"])
  });

  const { from, to, status } = createShipmentBodySchema.parse(request.body);

  try {
    const createShipmentUseCase = new CreateShipmentUseCase(shipmentRepository, pathRepository);

    const { shipment } = await createShipmentUseCase.execute({
      from,
      to,
      status
    });

    return response.status(201).json(shipment);
  } catch (error) {
    if (error instanceof NoRouteAvailableError) {
      return response.status(404).json({ error: error.message });
    }

    return response.status(500).json({ error });
  }
}
