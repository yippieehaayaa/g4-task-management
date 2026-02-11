import { prisma } from "../client";

type CreateServiceInput = {
  name: string;
  description?: string;
  apiKey: string;
};

type UpdateServiceInput = {
  name?: string;
  description?: string;
};

const createService = async (input: CreateServiceInput) => {
  return await prisma.service.create({ data: input });
};

const findServiceById = async (id: string) => {
  return await prisma.service.findUnique({
    where: { id, deletedAt: null },
  });
};

const findServiceByApiKey = async (apiKey: string) => {
  return await prisma.service.findUnique({
    where: { apiKey, deletedAt: null, isActive: true },
  });
};

const updateService = async (id: string, input: UpdateServiceInput) => {
  return await prisma.service.update({
    where: { id, deletedAt: null },
    data: input,
  });
};

const deactivateService = async (id: string) => {
  return await prisma.service.update({
    where: { id },
    data: { isActive: false },
  });
};

const softDeleteService = async (id: string) => {
  return await prisma.service.update({
    where: { id },
    data: { deletedAt: new Date(), isActive: false },
  });
};

export {
  createService,
  findServiceById,
  findServiceByApiKey,
  updateService,
  deactivateService,
  softDeleteService,
};
