import type { PrismaPromise, Refuel } from "@prisma/client"
import prisma from "~/util/store/dbConnect"

export const getRefuelsFromCar = (
  carId: string,
  fromDate?: Date,
  endDate?: Date
): PrismaPromise<Refuel[]> => {
  if (fromDate && endDate) {
    return prisma.$queryRaw`SELECT * FROM refuels WHERE "carId" = ${carId} AND ${fromDate} <= date AND date <= ${endDate} ORDER BY date`
  } else {
    return prisma.$queryRaw`SELECT * FROM refuels WHERE "carId" = ${carId} ORDER BY date`
  }
}

export const addRefuel = (data: Omit<Refuel, "id" | "mpg" | "costPerMile">) => {
  const mpg =
    data.gallons === 0 ? 0 : +(data.milesDriven / data.gallons).toFixed(4)
  const costPerMile =
    data.milesDriven === 0
      ? 0
      : +((data.gallonPrice * data.gallons) / data.milesDriven).toFixed(4)
  // prepared stmt
  return prisma.$executeRaw`INSERT INTO refuels (date, gallons, "gallonPrice", "milesDriven", mpg, "costPerMile", "carId") VALUES (${data.date}, ${data.gallons}, ${data.gallonPrice}, ${data.milesDriven}, ${mpg}, ${costPerMile}, ${data.carId})`
}

export const deleteRefuel = (refuelId: string) =>
  prisma.refuel.delete({
    where: {
      id: refuelId,
    },
  })
