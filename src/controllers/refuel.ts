import type { Refuel } from "@prisma/client"
import prisma from "~/util/store/dbConnect"

export const getRefuelsFromCar = (
  carId: string,
  fromDate?: Date,
  endDate?: Date
) =>
  prisma.refuel.findMany({
    where: {
      carId,
      date: {
        lte: endDate,
        gte: fromDate,
      },
    },
    include: {
      car: true,
    },
    orderBy: {
      date: "asc",
    },
  })

export const addRefuel = (data: Omit<Refuel, "id" | "mpg" | "costPerMile">) => {
  const mpg = +(data.milesDriven / data.gallons).toFixed(4)
  const costPerMile = +(
    (data.gallonPrice * data.gallons) /
    data.milesDriven
  ).toFixed(4)
  // prepared stmt
  return prisma.$executeRaw`INSERT INTO refuels (date, gallons, "gallonPrice", "milesDriven", mpg, "costPerMile", "carId") VALUES (${
    data.date
  }, ${data.gallons}, ${data.gallonPrice}, ${data.milesDriven}, ${
    isNaN(mpg) ? 0 : mpg
  }, ${isNaN(costPerMile) ? 0 : costPerMile}, ${data.carId})`
}

export const deleteRefuel = (refuelId: string) =>
  prisma.refuel.delete({
    where: {
      id: refuelId,
    },
  })
