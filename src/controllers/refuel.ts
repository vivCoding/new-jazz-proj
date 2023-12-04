import type { Car, Refuel } from "@prisma/client"
import prisma from "~/util/store/dbConnect"

export const getRefuelsFromCar = (carId: string) =>
  prisma.refuel.findMany({
    where: {
      carId,
    },
    include: {
      car: true,
    },
  })

export const addRefuel = (data: Omit<Refuel, "id" | "mpg" | "costPerMile">) =>
  prisma.refuel.create({
    data,
  })

export const deleteRefuel = (refuelId: string) =>
  prisma.refuel.delete({
    where: {
      id: refuelId,
    },
  })
