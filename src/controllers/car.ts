import type { Car } from "@prisma/client"
import prisma from "~/util/store/dbConnect"

export const getCarsFromUser = (userId: string) =>
  prisma.car.findMany({
    where: {
      userId,
    },
    include: {
      user: true,
      refuels: true,
    },
  })

export const addCar = (data: Omit<Car, "id">) =>
  prisma.car.create({
    data,
  })

export const deleteCar = (carId: string) =>
  prisma.car.delete({
    where: {
      id: carId,
    },
  })
