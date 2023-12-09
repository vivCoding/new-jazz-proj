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

export const getCarById = (carId: string) =>
  prisma.car.findFirst({
    where: {
      id: carId,
    },
    include: {
      user: true,
    },
  })

export const addCar = (data: Omit<Car, "id">) =>
  prisma.car.create({
    data,
  })

export const deleteCar = async (carId: string) => {
  await prisma.refuel.deleteMany({
    where: {
      carId,
    },
  })
  await prisma.car.delete({
    where: {
      id: carId,
    },
  })
}
