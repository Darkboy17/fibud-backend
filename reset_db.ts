/**
 * This script deletes all data from the database.
 * Run this script using `npx ts-node reset_db.ts`.
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function deleteAllData() {
  // Delete all matches
  await prisma.match.deleteMany();

  // Delete all clients
  await prisma.client.deleteMany();

  // Delete all experts
  await prisma.expert.deleteMany();

  console.log('All data deleted successfully!');
}

deleteAllData()
  .catch((error) => {
    console.error('Error deleting data:', error);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });