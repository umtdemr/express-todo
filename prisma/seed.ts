import { PrismaClient, Prisma } from '@prisma/client';


const prismaClient = new PrismaClient();


const noteBookData: Prisma.NoteBookCreateInput[] = [
  {
    title: 'home',
    tasks: {
      create: [
        {
          title: 'take the trash',
        },
        {
          title: 'clean the house',
        },
      ]
    }
  },
  {
    title: 'work',
    tasks: {
      create: [
        {
          title: 'push last commits to git'
        },
        {
          title: 'quit job'
        }
      ]
    }
  }
]


async function main() {
  console.log('starting seeding...');
  for (const nbData of noteBookData) {
    const noteBook = await prismaClient.noteBook.create({
      data: nbData
    })

    console.log(`Created NoteBook with id: ${noteBook.id}`)
  }
  console.log('finished seeding');
}


main()
  .catch((err) => {
    console.error(err);
    process.exit(1)
  })
  .finally(async () => {
    await prismaClient.$disconnect()
  })
