import { Prisma, PrismaClient } from "@prisma/client";
import faker from "faker";

const prisma = new PrismaClient();

const MAX_USER_COUNT = 20;
const MAX_MODULE_COUNT = 5;
const MAX_CONTRIBUTOR_COUNT = 3;
const MAX_VERSION_COUNT = 7;
const MAX_FILES_COUNT = 10;

async function main() {
  console.log("Start seeding ...");

  const users: string[] = [];
  const max = faker.random.number(MAX_USER_COUNT);
  for (let i = 0; i < max; i++) {
    const firstName = faker.name.firstName();
    const lastName = faker.name.lastName();
    const name = faker.internet.userName(firstName, lastName);
    const user: Prisma.UserCreateInput = {
      name,
      fullName: maybe(faker.name.findName(firstName, lastName)),
      bioText: maybe(faker.lorem.paragraph()),
      email: maybe(faker.internet.email(firstName, lastName)),
      /* accessTokens: maybe(Array.from(
        new Array(faker.random.number(5)),
        () => faker.random.uuid(),
      )), */
    };
    try {
      await prisma.user.create({
        data: user,
      });
      users.push(name);
      console.log(`Created user: ${user.name}`);
    } catch (err) {
      console.error(`Failed to create user: ${user.name}\n  ${err}`);
    }
  }

  const modules: [authorName: string, moduleName: string][] = [];
  for (const user of users) {
    const max = faker.random.number(MAX_MODULE_COUNT);
    for (let i = 0; i < max; i++) {
      const moduleName = faker.lorem.slug(2);
      const module: Prisma.ModuleCreateInput = {
        name: moduleName,
        fullName: maybe(faker.lorem.words(4)),
        description: maybe(faker.lorem.sentences()),
        homepage: maybe(faker.internet.url()),
        repository: maybe(faker.internet.url()),
        issues: maybe(faker.internet.url()),
        license: maybe(faker.lorem.word()),
        private: maybe(faker.random.boolean()),
        unlisted: maybe(faker.random.boolean()),
        ignore: `.${faker.system.fileExt(faker.system.mimeType())}`,
        keywords: maybe(Array.from(
          new Array(faker.random.number(5)),
          () => faker.random.word(),
        )),
        logo: maybe(faker.system.filePath()),
        main: maybe(faker.system.filePath()),
        bin: maybe(Array.from(
          new Array(faker.random.number(5)),
          () => faker.system.filePath(),
        )),
        author: {
          connect: {
            name: user,
          },
        },
        hooks: maybe({
          create: {
            presync: maybe(faker.lorem.words()),
            postsync: maybe(faker.lorem.words()),
            prepublish: maybe(faker.lorem.words()),
            postpublish: maybe(faker.lorem.words()),
          },
        }),
      };
      try {
        await prisma.module.create({
          data: module,
        });
        modules.push([user, moduleName]);
        console.log(`Created module: ${user}/${module.name}`);
      } catch (err) {
        console.error(
          `Failed to create module: ${user}/${module.name}\n  ${err}`,
        );
      }
    }
  }

  const moduleContributors: [
    authorName: string,
    moduleName: string,
    contributors: string[],
  ][] = [];
  for (const [authorName, moduleName] of modules) {
    const contributors = faker.random.arrayElements(
      users.filter((user) => user !== authorName),
      faker.random.number(MAX_CONTRIBUTOR_COUNT),
    );
    try {
      for (const contributorName of contributors) {
        const contributorData: Prisma.ModuleContributorCreateInput = {
          contributor: {
            connect: {
              name: contributorName,
            },
          },
          module: {
            connect: {
              authorName_name: {
                authorName,
                name: moduleName,
              },
            },
          },
        };
        await prisma.moduleContributor.create({
          data: contributorData,
        });
        console.log(
          `Created contributor: ${contributorName} -> ${authorName}/${moduleName}`,
        );
      }
      moduleContributors.push([authorName, moduleName, contributors]);
    } catch (err) {
      console.error(
        `Failed to contributors: ${authorName}/${moduleName}\n  ${err}`,
      );
    }
  }

  const versions: [
    authorName: string,
    moduleName: string,
    versionTags: string[],
  ][] = [];
  for (const [authorName, moduleName, contributors] of moduleContributors) {
    const publishers = [authorName, ...contributors];
    const max = faker.random.number(MAX_VERSION_COUNT);
    const versionTags: string[] = [];
    for (let i = 0; i < max; i++) {
      const files: Prisma.FileUncheckedCreateWithoutVersionInput[] = [];
      const versionTag = faker.system.semver();
      const max = faker.random.number(MAX_FILES_COUNT);
      for (let i = 0; i < max; i++) {
        const name = faker.system.commonFileName(faker.system.commonFileExt());
        files.push({
          name,
          path: `${faker.system.directoryPath()}/${name}`,
          type: faker.system.mimeType(),
          hash: faker.git.commitSha(),
          txID: faker.random.uuid(),
        });
      }
      const version: Prisma.VersionCreateInput = {
        version: versionTag,
        deprecated: maybe(faker.random.boolean()),
        vulnerable: maybe(faker.random.boolean()),
        supportedDeno: maybe([
          maybe(faker.fake("<={{system.semver}}")),
          maybe(faker.fake(">={{system.semver}}")),
        ].filter((element) => element) as string[]),
        logo: maybe(faker.system.filePath()),
        main: maybe(faker.system.filePath()),
        bin: maybe(Array.from(
          new Array(faker.random.number(5)),
          () => faker.system.filePath(),
        )),
        module: {
          connect: {
            authorName_name: {
              authorName,
              name: moduleName,
            },
          },
        },
        publisher: {
          connect: {
            name: faker.random.arrayElement(publishers),
          },
        },
        files: {
          create: files,
        },
      };
      try {
        await prisma.version.create({
          data: version,
        });
        versionTags.push(versionTag);
        console.log(
          `Created version: ${authorName}/${moduleName}@${versionTag}`,
        );
      } catch (err) {
        console.log(
          `Failed to create version: ${authorName}/${moduleName}@${versionTag}\n ${err}`,
        );
      }
    }
    versions.push([authorName, moduleName, versionTags]);
  }

  for (const [authorName, moduleName, versionTags] of versions) {
    for (const tagName of ["latest", "v1", "next", "stable"]) {
      if (faker.random.boolean() && versionTags.length > 0) {
        const version = faker.random.arrayElement(versionTags);
        versionTags.splice(versionTags.indexOf(version));
        const tag: Prisma.TagCreateInput = {
          name: tagName,
          module: {
            connect: {
              authorName_name: {
                authorName,
                name: moduleName,
              },
            },
          },
          version: {
            connect: {
              authorName_moduleName_version: {
                authorName,
                moduleName,
                version,
              },
            },
          },
        };
        try {
          await prisma.tag.create({
            data: tag,
          });
          console.log(
            `Created tag: ${authorName}/${moduleName}@${version}: ${tagName}`,
          );
        } catch (err) {
          console.log(
            `Failed to create tag: ${authorName}/${moduleName}@${version}: ${tagName}\n ${err}`,
          );
        }
      }
    }
  }

  console.log("Seeding finished.");
}

function maybe<T>(element: T) {
  return faker.random.boolean() ? element : undefined;
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
