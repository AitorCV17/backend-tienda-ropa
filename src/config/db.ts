// Configuración de la conexión a la base de datos usando Prisma
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default prisma;
