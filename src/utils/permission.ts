import type { AccessToken, ModuleContributor, Permission } from "@prisma/client";
import type { Context } from "../context";

interface Access {
  canRead: boolean;
  canWrite: boolean;
}

function readAccess(permission?: Permission | null): boolean {
  return permission === "READ" || permission === "READ_WRITE";
}

function writeAccess(permission?: Permission | null): boolean {
  return permission === "WRITE" || permission === "READ_WRITE";
}

export function rejectLogin(): never {
  throw new Error("You must get a session token to perform this action.");
}

type UserPermsKey =
  | "accessProfile"
  | "accessTokens"
  | "accessVersions"
  | "accessConfigs"
  | "accessPrivateVersions"
  | "accessPrivateConfigs"
  | "accessPrivateContributions";

interface UserPermissionsInput {
  accessToken?: AccessToken | null;
  isSession?: boolean;
  isLogin?: boolean;
}

export class UserPermissions {
  accessToken?: AccessToken | null;
  isSession?: boolean;
  isLogin?: boolean;
  constructor(options: UserPermissionsInput) {
    this.accessToken = options.accessToken;
    this.isSession = options.isSession;
    this.isLogin = options.isLogin;
  }

  private access(key: UserPermsKey): Access {
    if (this.isSession) {
      return {
        canRead: true,
        canWrite: true,
      };
    }
    if (this.isLogin) rejectLogin();
    return {
      canRead: readAccess(this.accessToken && this.accessToken[key]),
      canWrite: writeAccess(this.accessToken && this.accessToken[key]),
    };
  }

  hasRead = { in: ["READ", "READ_WRITE"] as ["READ", "READ_WRITE"] };

  get profile() {
    return this.access("accessProfile");
  }
  get tokens() {
    return this.access("accessTokens");
  }
  get versions() {
    return this.access("accessVersions");
  }
  get configs() {
    return this.access("accessConfigs");
  }
  get privateConfigs() {
    return this.access("accessPrivateConfigs");
  }
  get privateContributions() {
    return this.access("accessPrivateContributions");
  }
}

interface ModulePermissionsInput {
  authorName: string;
  moduleName: string;
}

type ModulePermsKey = "accessVersions" | "accessConfig" | "accessContributors";

export class ModulePermissions {
  contributor: Promise<ModuleContributor | null>;

  constructor(ctx: Context, authorName_moduleName: ModulePermissionsInput) {
    this.contributor = ctx.prisma.moduleContributor.findUnique({
      where: {
        authorName_moduleName_contributorName: {
          ...authorName_moduleName,
          contributorName: ctx.user,
        },
      },
    });
  }

  private async access(key: ModulePermsKey): Promise<Access> {
    const contributor = await this.contributor;
    return {
      canRead: readAccess(contributor && contributor[key]),
      canWrite: writeAccess(contributor && contributor[key]),
    };
  }

  get versions() {
    return this.access("accessVersions");
  }
  get config() {
    return this.access("accessConfig");
  }
  get contributors() {
    return this.access("accessContributors");
  }
}
