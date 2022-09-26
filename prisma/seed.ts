// prisma/seed.ts

import { PrismaClient } from "@prisma/client";
import { links } from "../data/links";
const prisma = new PrismaClient();

async function main() {
  //   await prisma.user.create({
  //     data: {
  //       email: `hotuong@gmail.com`,
  //       role: "admin",
  //     },
  //   });

  await prisma.link.create({
    data: {
      category: "Open Source",
      description: "GraphQL implementation ",
      id: "2ea8cfb0-44a3-4c07-bdc2-31ffa135ea78",
      imageUrl: "https://www.apollographql.com/apollo-home.jpg",
      title: "Apollo GraphQL",
      url: "https://apollographql.com",
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
