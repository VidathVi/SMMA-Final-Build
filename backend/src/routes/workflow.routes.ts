import { Router } from "express";
import { workflowController } from "../controllers/workflow.controller";

const router = Router();

router.post("/", workflowController.create.bind(workflowController));
router.get("/", workflowController.getAll.bind(workflowController));
router.get("/:id", workflowController.getById.bind(workflowController));
router.put("/:id", workflowController.update.bind(workflowController));
router.delete("/:id", workflowController.delete.bind(workflowController));
router.post("/:id/nodes", workflowController.addNode.bind(workflowController));
router.delete("/nodes/:nodeId", workflowController.deleteNode.bind(workflowController));

export default router;
