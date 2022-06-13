import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt'

const prisma = new PrismaClient();

export const generatePassword = async (unhashedPass: string) => {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(unhashedPass, salt)
  return hash;
}


export const comparePassword = async (hashedPass: string, toComparePass: string) => {
  return await bcrypt.compare(toComparePass, hashedPass);
}


export const loginControl = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({
    where: {
      email
    }
  });

  return comparePassword(user!.password, password);
}
