import { app } from "../app.js";
import { createShipment } from "./controllers/shipments/create.controller.js";
import { getShipmentById } from "./controllers/shipments/get-by-id.controller.js";
import { updateShipmentStatus } from "./controllers/shipments/update-status.controller.js";

export function appRoutes() {
  app.post("/shipments", createShipment);
  app.get("/shipments/:id", getShipmentById);
  app.put("/shipments/:id/status", updateShipmentStatus);
}