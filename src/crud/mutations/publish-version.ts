import { arg, mutationField, nonNull } from "nexus";
import { ForbiddenError, UserInputError } from "apollo-server-express";
import semver from "semver";
import { notNull } from "../../utils/null";
import { ModulePermissions } from "../../utils/permission";

export const publishVersion = mutationField("publishVersion", {
  type: nonNull("Version"),
  args: {
    data: nonNull(
      arg({
        type: "VersionInput",
      })
    ),
  },
  async resolve(_parent, args, ctx) {
    const authorName = args.data.author ?? ctx.user;
    const moduleName = args.data.module;
    // potential module contributor
    if (authorName !== ctx.user) {
      const permissions = new ModulePermissions(ctx, {
        authorName,
        moduleName,
      });
      if (!(await permissions.versions).canWrite) {
        throw new ForbiddenError("You are not allowed to publish versions for this module.");
      }
    } else {
      if (!ctx.permissions.versions.canWrite) {
        throw new ForbiddenError("You are not allowed to publish versions");
      }
    }

    if (!semver.valid(args.data.version)) {
      throw new UserInputError("The given version does not follow Semantic Versioning.");
    }

    const version = await ctx.prisma.version.create({
      data: {
        version: args.data.version,
        published: args.data.published,
        deprecated: args.data.deprecated,
        vulnerable: args.data.vulnerable,
        supportedDeno: notNull(args.data.supportedDeno),
        // dependencies:  // TODO
        main: args.data.main,
        bin: notNull(args.data.bin),
        logo: args.data.logo,
        files: {
          create: args.data.files,
        },
        publisher: {
          connect: {
            name: authorName,
          },
        },
        module: {
          connectOrCreate: {
            where: {
              authorName_name: {
                authorName,
                name: moduleName,
              },
            },
            create: {
              authorName,
              name: moduleName,
            },
          },
        },
      },
    });

    const versions = await ctx.prisma.version.findMany({
      where: {
        authorName,
        moduleName,
      },
      select: {
        version: true,
      },
    });

    let latest: string;
    const sorted = semver.sort(versions.map((v) => v.version));
    latest = sorted[sorted.length - 1];
    // Don't include prerelease if a stable version exist.
    if (semver.major(latest) !== 0 && !semver.prerelease(latest)) {
      const sorted2 = semver.sort(sorted.filter((v) => !semver.prerelease(v)));
      latest = sorted2[sorted2.length - 1];
    }

    // Update latest version
    await ctx.prisma.module.update({
      where: {
        authorName_name: {
          authorName,
          name: moduleName,
        },
      },
      data: {
        latest: {
          connect: {
            authorName_moduleName_version: {
              authorName,
              moduleName,
              version: latest,
            },
          },
        },
      },
    });
    return version;
  },
});
