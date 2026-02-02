import { app } from "./app.js";
import { InMemoryPathRepository } from "./repositories/path/in-memory.js";
import { seedPathData } from "./database/seed.js";
import { InMemoryShipmentRepository } from "./repositories/shipment/in-memory.js";

const pathRepository = new InMemoryPathRepository();
const shipmentRepository = new InMemoryShipmentRepository();
seedPathData(pathRepository);

export { pathRepository, shipmentRepository };

app.listen(3333, "0.0.0.0", () => {
  console.log("Server running on port 3333");
});