import { PrismaClient, Prisma } from "@prisma/client";
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
  try {
    const location = await prisma.location.findUnique({
      where: {
        id,
        isActive: true,
      },
    });

    if (!location) {
      throw new AppError("Local não encontrado", 404);
    }

    return location;
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError("Erro ao buscar local", 500);
  }
};

export const createLocation = async (data: CreateLocationInput) => {
  try {
    const locationData: Prisma.LocationCreateInput = {
      name: data.name,
      address: data.address,
      phone: data.phone,
      description: data.description,
      workingHours: data.workingHours as Prisma.JsonValue,
      city: data.city,
      state: data.state,
      zipCode: data.zipCode,
      isActive: true,
    };

    return prisma.location.create({
      data: locationData,
    });
  } catch (error) {
    throw new AppError("Erro ao criar local", 500);
  }
};

export const updateLocation = async (id: string, data: UpdateLocationInput) => {
  try {
    const location = await prisma.location.findUnique({
      where: {
        id,
        isActive: true,
      },
    });

    if (!location) {
      throw new AppError("Local não encontrado", 404);
    }

    const updateData: Prisma.LocationUpdateInput = {
      name: data.name,
      address: data.address,
      phone: data.phone,
      description: data.description,
      workingHours: data.workingHours as Prisma.JsonValue,
      city: data.city,
      state: data.state,
      zipCode: data.zipCode,
      isActive: data.isActive,
    };

    return prisma.location.update({
      where: { id },
      data: updateData,
    });
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError("Erro ao atualizar local", 500);
  }
};

export const deleteLocation = async (id: string) => {
  try {
    const location = await prisma.location.findUnique({
      where: {
        id,
        isActive: true,
      },
    });

    if (!location) {
      throw new AppError("Local não encontrado", 404);
    }

    return prisma.location.update({
      where: { id },
      data: {
        isActive: false,
      },
    });
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError("Erro ao deletar local", 500);
  }
};
