import { prisma } from "../lib/prisma";
import { ApiError } from "../utils/api-error";

export interface CreateWorkflowInput {
  name: string;
  description?: string;
  createdById: string;
  nodes?: Array<{
    type: string;
    label: string;
    config?: any;
    positionX?: number;
    positionY?: number;
    nextNodeIds?: string[];
  }>;
}

export class WorkflowService {
  async create(data: CreateWorkflowInput) {
    return prisma.workflowDefinition.create({
      data: {
        name: data.name,
        description: data.description,
        createdById: data.createdById,
        nodes: data.nodes
          ? {
              create: data.nodes.map((node) => ({
                type: node.type,
                label: node.label,
                config: node.config || undefined,
                positionX: node.positionX || 0,
                positionY: node.positionY || 0,
                nextNodeIds: node.nextNodeIds || [],
              })),
            }
          : undefined,
      },
      include: {
        nodes: true,
        createdBy: { select: { id: true, name: true, email: true } },
      },
    });
  }

  async getAll() {
    return prisma.workflowDefinition.findMany({
      include: {
        createdBy: { select: { id: true, name: true, email: true } },
        _count: { select: { nodes: true } },
      },
      orderBy: { updatedAt: "desc" },
    });
  }

  async getById(id: string) {
    const workflow = await prisma.workflowDefinition.findUnique({
      where: { id },
      include: {
        nodes: { orderBy: { createdAt: "asc" } },
        createdBy: { select: { id: true, name: true, email: true } },
      },
    });
    if (!workflow) throw ApiError.notFound(`Workflow "${id}" not found`);
    return workflow;
  }

  async update(
    id: string,
    data: { name?: string; description?: string; isActive?: boolean }
  ) {
    const workflow = await prisma.workflowDefinition.findUnique({
      where: { id },
    });
    if (!workflow) throw ApiError.notFound(`Workflow "${id}" not found`);

    return prisma.workflowDefinition.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        isActive: data.isActive,
      },
      include: {
        nodes: true,
        createdBy: { select: { id: true, name: true, email: true } },
      },
    });
  }

  async delete(id: string) {
    const workflow = await prisma.workflowDefinition.findUnique({
      where: { id },
    });
    if (!workflow) throw ApiError.notFound(`Workflow "${id}" not found`);

    await prisma.workflowDefinition.delete({ where: { id } });
    return { message: "Workflow deleted successfully" };
  }

  async addNode(
    workflowId: string,
    node: {
      type: string;
      label: string;
      config?: any;
      positionX?: number;
      positionY?: number;
      nextNodeIds?: string[];
    }
  ) {
    const workflow = await prisma.workflowDefinition.findUnique({
      where: { id: workflowId },
    });
    if (!workflow)
      throw ApiError.notFound(`Workflow "${workflowId}" not found`);

    return prisma.workflowNode.create({
      data: {
        workflowId,
        type: node.type,
        label: node.label,
        config: node.config || undefined,
        positionX: node.positionX || 0,
        positionY: node.positionY || 0,
        nextNodeIds: node.nextNodeIds || [],
      },
    });
  }

  async deleteNode(nodeId: string) {
    const node = await prisma.workflowNode.findUnique({
      where: { id: nodeId },
    });
    if (!node) throw ApiError.notFound(`Node "${nodeId}" not found`);

    await prisma.workflowNode.delete({ where: { id: nodeId } });
    return { message: "Node deleted successfully" };
  }
}

export const workflowService = new WorkflowService();
