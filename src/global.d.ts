/// <reference types="solid-start/env" />

import type { User } from "@prisma/client"

declare module "@auth/core" {
  interface Session {
    user: User
    accessToken?: string
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    id?: string
    accessToken?: string
  }
}

/*
// interface IUser {
//   id: string
//   name: string
//   email: string
//   image: string
//   cars: ICar[]
// }

// interface ICar {
//   id: string
//   user: IUser
//   name: string
//   description: string
// }

// interface IRefuel {
//   id: string
//   car: ICar
//   date: string
//   gallons: number
//   gallonPrice: number
//   milesDriven: number
//   mpg: number
//   costPerMile: number
// }
*/
