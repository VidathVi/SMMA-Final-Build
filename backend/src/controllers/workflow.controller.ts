import { Request, Response, NextFunction } from "express";
import { workflowService } from "../services/workflow.service";

export class WorkflowController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const workflow = await workflowService.create(req.body);
      res.status(201).json({ success: true, data: workflow });
    } catch (error) {
      next(error);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const workflows = await workflowService.getAll();
      res.json({ success: true, data: workflows });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const workflow = await workflowService.getById(req.params.id as string);
      res.json({ success: true, data: workflow });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const workflow = await workflowService.update(req.params.id as string, req.body);
      res.json({ success: true, data: workflow });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await workflowService.delete(req.params.id as string);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async addNode(req: Request, res: Response, next: NextFunction) {
    try {
      const node = await workflowService.addNode(req.params.id as string, req.body);
      res.status(201).json({ success: true, data: node });
    } catch (error) {
      next(error);
    }
  }

  async deleteNode(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await workflowService.deleteNode(req.params.nodeId as string);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }
}

export const workflowController = new WorkflowController();
