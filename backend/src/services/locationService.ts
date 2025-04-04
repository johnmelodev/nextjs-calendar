import { PrismaClient } from "@prisma/client";
import {
  CreateLocationInput,
  UpdateLocationInput,
} from "../schemas/locationSchema";
import { AppError } from "../middlewares/errorHandler";

const prisma = new PrismaClient();

export interface CreateLocationData {
  name: string;
  address: string;
  phone: string;
  description?: string;
  workingHours: {
    [key: string]: {
      isOpen: boolean;
      periods: Array<{
        start: string;
        end: string;
      }>;
    };
  };
}

export interface UpdateLocationData extends Partial<CreateLocationData> {}

export const getLocations = async () => {
  return prisma.location.findMany({
    where: {
      isActive: true,
    },
  });
};

export const getLocation = async (id: string) => {
  const location = await prisma.location.findUnique({
    where: {
      id,
      isActive: true,
    },
  });

  if (!location) {
    throw new AppError(404, "Local não encontrado");
  }

  return location;
};

export const createLocation = async (data: CreateLocationInput) => {
  return prisma.location.create({
    data: {
      ...data,
      isActive: true,
    },
  });
};

export const updateLocation = async (id: string, data: UpdateLocationInput) => {
  const location = await prisma.location.findUnique({
    where: {
      id,
      isActive: true,
    },
  });

  if (!location) {
    throw new AppError(404, "Local não encontrado");
  }

  return prisma.location.update({
    where: { id },
    data,
  });
};

export const deleteLocation = async (id: string) => {
  const location = await prisma.location.findUnique({
    where: {
      id,
      isActive: true,
    },
  });

  if (!location) {
    throw new AppError(404, "Local não encontrado");
  }

  return prisma.location.update({
    where: { id },
    data: {
      isActive: false,
    },
  });
};
