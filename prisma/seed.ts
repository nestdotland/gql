import { Prisma, PrismaClient } from "@prisma/client";
import faker from "faker";

const prisma = new PrismaClient();

const MAX_USER_COUNT = 30;
const MAX_MODULE_COUNT = 5;
const MAX_VERSION_COUNT = 5;

async function main() {
  console.log("Start seeding ...");

  const userData: Prisma.UserCreateInput[] = [];
  for (let i = 0; i < faker.random.number(MAX_USER_COUNT); i++) {
    const firstName = faker.name.firstName();
    const lastName = faker.name.lastName();
    const user: Prisma.UserCreateInput = {
      name: faker.internet.userName(firstName, lastName),
      fullName: faker.name.findName(firstName, lastName),
      bioText: faker.lorem.paragraph(),
      email: faker.internet.email(firstName, lastName),
    };
    try {
      await prisma.user.create({
        data: user,
      });
      userData.push(user);
      console.log(`Created user with name: ${user.name}`);
    } catch (err) {
      console.error(`Failed to create user: ${user.name}\n${err}`);
    }
  }

  const moduleData: Prisma.ModuleCreateInput[] = [];
  for (const user of userData) {
    for (let i = 0; i < faker.random.number(MAX_MODULE_COUNT); i++) {
      const moduleName = faker.lorem.slug(2);
      const module: Prisma.ModuleCreateInput = {
        name: moduleName,
        fullName: faker.lorem.words(4),
        description: faker.lorem.sentences(),
        homepage: faker.internet.url(),
        repository: faker.internet.url(),
        issues: faker.internet.url(),
        license: faker.lorem.word(),
        private: faker.random.boolean(),
        unlisted: faker.random.boolean(),
        ignore: faker.system.fileExt(faker.system.mimeType()),
        main: faker.system.filePath(),
        bin: Array.from(new Array(faker.random.number(5)), () => faker.system.filePath()),
        keywords: Array.from(new Array(faker.random.number(5)), () => faker.random.word()),
        author: {
          connect: {
            name: user.name,
          },
        },
        /* contributors: {
          connect: faker.random.arrayElements(
            userData.filter((u) => u.name !== user.name),
            faker.random.number(USER_COUNT),
          ).map((u) => {
            return {
              authorName_moduleName_contributorName: {
                authorName: user.name,
                moduleName,
                contributorName: u.name,
              },
            };
          }),
        }, */
      };
      try {
        await prisma.module.create({
          data: module,
        });
        moduleData.push(module);
        console.log(`Created module with name: ${module.name}`);
      } catch (err) {
        console.error(`Failed to create module: ${module.name}\n${err}`);
      }
    }
  }

  const versionData: Prisma.VersionCreateInput[] = [];
  for (const module of moduleData) {
    for (let i = 0; i < faker.random.number(MAX_VERSION_COUNT); i++) {
      const version: Prisma.VersionCreateInput = {
        version: faker.system.semver(),
        published: faker.date.past(),
        deprecated: faker.random.boolean(),
        vulnerable: faker.random.boolean(),
        supportedDeno: faker.fake("<={{system.semver}} >={{system.semver}}"),
        module: {
          connect: {
            authorName_name: {
              authorName: module.author!.connect!.name!,
              name: module.name!,
            },
          },
        },
        publisher: {
          connect: {
            name: module.author!.connect!.name!,
          },
        },
      };
      try {
        await prisma.version.create({
          data: version,
        });
        versionData.push(version);
        console.log(`Created version: ${version.version}`);
      } catch (err) {
        console.error(`Failed to create version: ${version.version}\n${err}`);
        console.debug(version.module.connect);
      }
    }
  }

  console.log("Seeding finished.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
