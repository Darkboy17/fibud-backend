/**
 * This script seeds the database with random data using Faker.
 * Run this script using `npx ts-node seed.ts`.
 */

import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function seed() {
  // Create 20 random experts
  const experts = [];
  for (let i = 0; i < 20; i++) {
    const expert = await prisma.expert.create({
      data: {
        name: faker.person.fullName(),
        specialization: faker.helpers.arrayElement(['Software', 'Data Science', 'DevOps', 'AI', 'Cybersecurity']),
        availability: faker.helpers.arrayElement(['Full-time', 'Part-time']),
        rating: faker.number.float({ min: 3.5, max: 5, fractionDigits: 1 }),
      },
    });
    experts.push(expert);
  }

  // Create 30 random clients
  const clients = [];
  for (let i = 0; i < 30; i++) {
    const client = await prisma.client.create({
      data: {
        name: faker.person.fullName(),
      },
    });
    clients.push(client);
  }

  // Create 50 random matches
  for (let i = 0; i < 50; i++) {
    await prisma.match.create({
      data: {
        expertId: faker.helpers.arrayElement(experts).id,
        clientId: faker.helpers.arrayElement(clients).id,
      },
    });
  }

  console.log('50 random data entries added successfully!');
}

seed()
  .catch((error) => {
    console.error('Error seeding data:', error);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });