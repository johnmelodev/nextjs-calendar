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
      id: String(id),
      isActive: true,
    },
  });

  if (!location) {
    throw new AppError(404, "Local não encontrado");
  }

  return location;
};

export const createLocation = async (data: CreateLocationInput) => {
  const locationData = {
    name: data.name,
    address: data.address,
    phone: data.phone,
    description: data.description,
    workingHours: data.workingHours,
    city: data.city,
    state: data.state,
    zipCode: data.zipCode,
    isActive: true,
  };

  return prisma.location.create({
    data: locationData,
  });
};

export const updateLocation = async (id: string, data: UpdateLocationInput) => {
  const location = await prisma.location.findUnique({
    where: {
      id: String(id),
      isActive: true,
    },
  });

  if (!location) {
    throw new AppError(404, "Local não encontrado");
  }

  return prisma.location.update({
    where: { id: String(id) },
    data,
  });
};

export const deleteLocation = async (id: string) => {
  const location = await prisma.location.findUnique({
    where: {
      id: String(id),
      isActive: true,
    },
  });

  if (!location) {
    throw new AppError(404, "Local não encontrado");
  }

  return prisma.location.update({
    where: { id: String(id) },
    data: {
      isActive: false,
    },
  });
};
