// import { customAlphabet } from 'nanoid';
// import { Octokit } from '@octokit/core';

// const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
// const nanoid = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', 32);
// console.log(nanoid());

// (async () => {
//   await octokit
//     .request('GET /repos/{owner}/{repo}/git/trees/{tree_sha}', {
//       owner: 'nestdotland',
//       repo: 'nest',
//       tree_sha: 'main',
//       recursive: '1',
//     })
//     .then(console.log)
//     .catch(console.error);
// })();

export const users = [
    {
      username: "maximousblk",
      name: "Maximous Black",
      bio: "I'm a Web Developer who likes building beautiful web interfaces & experiences.",
      avatar: "https://github.com/maximousblk.png",
      authTokens: [
        "NEST_ARNOLD1IEO83GJY47GFPWXC0WY122CMVLXGVMMQLF9P1FI8ARDP6M05HEWTWKEUC",
        "NEST_1EING2W9KZYURTL391TVPB6THCD2GUEDCMVN4CG5RORW6WM0ZNE9KEJIJ0OSG73J",
        "NEST_MKSLUBSNJDRAW60I8LI8QLK3GUUQ5J4VH0SC0WX8INQCZ48OYUULH7Y9YRPXUI5J",
      ],
    },
    {
      username: "oganexon",
      name: "Maël Acier",
      avatar: "https://github.com/oganexon.png",
      authTokens: [
        "NEST_UQTSNPFK95Y7F9163D9A3RHVONW553VS6AU81UE4LZOLNJS339JVIXGI5E7K42IJ",
        "NEST_9A47LZP8P8931A5G2I2Z5CZLQ6UH8X0KBG53QRTM16PHKB2OVX2SJDZXBTSS4D00",
        "NEST_ULTIA3SPZB143SXCQ72XZ68SVCTB5ALTRTEPJ0UUUZ70TA0OC2ZA9S1YG4VWT1WG",
      ],
    },
    {
      username: "nestland",
      name: "Nest Land",
      avatar: "https://github.com/nestdotland.png",
      bio: "The Nest Authors",
      authTokens: [
        "NEST_H0BSQXH1R9F15M4SUVIAA6IC417ZP3RO2A4WB5R2C0Y8FAN6AFTB6LMWCYYCX6XA",
        "NEST_QOLXHVMGB5YVPEFPNODFPKZFZQSVKZ00CS4O6EYGMKJFIGGSKCOECKVYQSN2X7UZ",
        "NEST_GL3BQY7C4V92M66NPTFH9TVA4DL2AXLNSOAO9YHGC25VQ415ARKSSJEDXVRCF6X5",
      ],
    },
    {
      username: "denoland",
      name: "Deno",
      avatar: "https://github.com/denoland.png",
      bio: "The Deno Authors",
      authTokens: [
        "NEST_0PIZARI9GARR45FQDVALOVLGT1CAIVHDWB78ZOYUTV4KLDNRT93L326215M9201R",
        "NEST_WGBWXLID4C1RCYU6OY0OH2MSA17FPPY2KPDDXBT7UCMBU330LBTP06T9C57D3WXL",
        "NEST_NYXJLS3ZR04ZY9RK7SD8TIFECBUG5WLBQ377JWLPOK2IT38ZKFE6UPU0QD9PD229",
      ],
    },
    {
      username: "ry",
      name: "Ryan Dahl",
      avatar: "https://github.com/ry.png",
      bio: "Creator of NodeJS and Deno. No big deal 😎",
      authTokens: [
        "NEST_7LW3JCPZE3Y587LXU5HJ479VUN5BIFJ9GZMH87IPNCIVCC3EO3R82RG7VCE6V46A",
        "NEST_06TH800F9LBC8VIIP6DNYKH4LQI1W5FC2HREQ1GMNHL75I2AMEQQ48D9SQLH558J",
        "NEST_IUI54C5YRQHP2FIJTACOXGN5X2TCOR7P1GXQ5HOOTYEONQSYJE2Y8AAB19KY3PDT",
      ],
    },
  ];
  
  export const modules = [
    {
      name: "std",
      author: "denoland",
      fullname: "Standard Library",
      homepage: "https://deno.land/std",
      contributors: ["ry", "denoland"],
      src: "https://deno.land/src@",
      versions: [
        { name: "0.94.0", deps: [], tdeps: [], tpdeps: [] },
        { name: "0.95.0", deps: [], tdeps: [], tpdeps: [] },
        { name: "0.96.0", deps: [], tdeps: [], tpdeps: [] },
        { name: "0.97.0", deps: [], tdeps: [], tpdeps: [] },
        { name: "0.98.0", deps: [], tdeps: [], tpdeps: [] },
        { name: "0.99.0", deps: [], tdeps: [], tpdeps: [] },
      ],
      tags: [
        {
          name: "latest",
          version: "0.99.0",
        },
      ],
      devConfig: {
        ignore: [],
      },
      publishConfig: {
        main: "",
        bin: [],
      },
      files: [
        "LICENSE",
        "README.md",
        "flags/mod.ts",
        "fmt/colors.ts",
        "fmt/printf.ts",
        "mime/mod.ts",
        "mime/multipart.ts",
        "mime/test.ts",
        "uuid/mod.ts",
        "uuid/v1.ts",
        "uuid/v4.ts",
        "uuid/v5.ts",
        "version.ts",
        "ws/mod.ts",
        "ws/test.ts",
      ],
    },
    {
      name: "nest",
      author: "nestland",
      fullname: "Nest CLI",
      homepage: "https://nest.land/-/nest",
      contributors: ["oganexon", "maximousblk", "nestland"],
      src: "https://github.com/nestdotland/nest/raw/",
      versions: [
        {
          name: "0.1.3",
          deps: [{ author: "denoland", name: "std", version: "0.94.0" }],
          tdeps: [],
          tpdeps: [],
        },
        {
          name: "0.1.4",
          deps: [{ author: "denoland", name: "std", version: "0.95.0" }],
          tdeps: [],
          tpdeps: [],
        },
        {
          name: "0.1.5",
          deps: [{ author: "denoland", name: "std", version: "0.95.0" }],
          tdeps: [],
          tpdeps: [],
        },
        {
          name: "0.1.6",
          deps: [{ author: "denoland", name: "std", version: "0.96.0" }],
          tdeps: [],
          tpdeps: [],
        },
        {
          name: "0.1.7",
          deps: [{ author: "denoland", name: "std", version: "0.97.0" }],
          tdeps: [],
          tpdeps: [],
        },
        {
          name: "0.1.8",
          deps: [{ author: "denoland", name: "std", version: "0.99.0" }],
          tdeps: [],
          tpdeps: [],
        },
      ],
      tags: [
        {
          name: "latest",
          version: "0.1.8",
        },
        {
          name: "alpha",
          version: "0.1.8",
        },
      ],
      devConfig: {
        ignore: ["tests"],
      },
      publishConfig: {
        main: "mod.ts",
        bin: ["nest.ts"],
      },
      files: [
        "LICENSE",
        "README.md",
        "mod.ts",
        "nest.ts",
        "src/cli/commands/help.ts",
        "src/cli/commands/init.ts",
        "src/cli/commands/login.ts",
        "src/cli/commands/logout.ts",
        "src/cli/commands/publish.ts",
        "src/cli/commands/setup.ts",
        "src/cli/commands/switch.ts",
        "src/cli/commands/sync.ts",
        "src/cli/commands/upgrade.ts",
        "src/version.ts",
      ],
    },
    {
      name: "eggs",
      author: "nestland",
      fullname: "Eggs CLI",
      homepage: "https://nest.land/-/eggs",
      contributors: ["oganexon", "maximousblk", "nestland"],
      src: "https://github.com/nestdotland/eggs/raw/",
      versions: [
        {
          name: "0.2.3",
          deps: [{ author: "denoland", name: "std", version: "0.94.0" }],
          tdeps: [{ author: "nestland", name: "nest", version: "0.1.8", tag: "alpha" }],
          tpdeps: [],
        },
        {
          name: "0.2.4",
          deps: [{ author: "denoland", name: "std", version: "0.94.0" }],
          tdeps: [{ author: "nestland", name: "nest", version: "0.1.8", tag: "alpha" }],
          tpdeps: [],
        },
        {
          name: "0.2.5",
          deps: [{ author: "denoland", name: "std", version: "0.94.0" }],
          tdeps: [{ author: "nestland", name: "nest", version: "0.1.8", tag: "alpha" }],
          tpdeps: [],
        },
        {
          name: "0.3.1",
          deps: [{ author: "denoland", name: "std", version: "0.94.0" }],
          tdeps: [{ author: "nestland", name: "nest", version: "0.1.8", tag: "alpha" }],
          tpdeps: [],
        },
        {
          name: "0.3.2",
          deps: [{ author: "denoland", name: "std", version: "0.94.0" }],
          tdeps: [{ author: "nestland", name: "nest", version: "0.1.8", tag: "alpha" }],
          tpdeps: [],
        },
      ],
      tags: [
        {
          name: "latest",
          version: "0.3.2",
        },
        {
          name: "v0",
          version: "0.3.2",
        },
        {
          name: "v0.2",
          version: "0.2.5",
        },
      ],
      devConfig: {
        ignore: ["tests"],
      },
      publishConfig: {
        main: "mod.ts",
        bin: ["eggs.ts", "eggx.ts"],
      },
      files: [
        "README.md",
        "src/keyfile.ts",
        "src/utilities/environment.ts",
        "src/utilities/json.ts",
        "src/utilities/log.ts",
        "src/utilities/types.ts",
        "src/commands.ts",
        "src/commands/upgrade.ts",
        "src/commands/info.ts",
        "src/commands/link.ts",
        "src/commands/update.ts",
        "src/commands/publish.ts",
        "src/commands/init.ts",
        "src/commands/install.ts",
        "src/schema.json",
        "src/version.ts",
        "eggs.ts",
        "eggx.ts",
        "LICENSE",
        "deps.ts",
      ],
    },
    {
      name: "serve",
      author: "maximousblk",
      fullname: "Static File Server",
      homepage: "https://nest.land/x/maximousblk/serve",
      contributors: ["maximousblk", "oganexon"],
      src: "https://github.com/maximousblk/serve/raw/",
      versions: [
        {
          name: "1.0.0",
          deps: [{ author: "denoland", name: "std", version: "0.94.0" }],
          tdeps: [],
          tpdeps: [],
        },
        {
          name: "1.0.1",
          deps: [{ author: "denoland", name: "std", version: "0.94.0" }],
          tdeps: [],
          tpdeps: [],
        },
        {
          name: "1.0.2",
          deps: [{ author: "denoland", name: "std", version: "0.95.0" }],
          tdeps: [],
          tpdeps: [],
        },
        {
          name: "1.0.3",
          deps: [{ author: "denoland", name: "std", version: "0.96.0" }],
          tdeps: [],
          tpdeps: [],
        },
        {
          name: "1.0.5",
          deps: [{ author: "denoland", name: "std", version: "0.96.0" }],
          tdeps: [],
          tpdeps: [],
        },
      ],
      tags: [],
      devConfig: {
        ignore: [],
      },
      publishConfig: {
        bin: ["serve.ts"],
      },
      files: [
        "serve.ts",
        "deps.ts",
        "src/pages/dir.ts",
        "src/pages/err.ts",
        "src/utils/html.ts",
        "src/utils/server.ts",
        "src/utils/types.ts",
        "README.md",
        "LICENSE",
      ],
    },
    {
      name: "ghlog",
      author: "maximousblk",
      fullname: "GitHub Release Notes Generator",
      homepage: "https://deno.land/x/ghlog",
      contributors: ["maximousblk"],
      src: "https://deno.land/x/serve@",
      versions: [
        {
          name: "0.1.0",
          deps: [{ author: "denoland", name: "std", version: "0.94.0" }],
          tdeps: [],
          tpdeps: [{ host: "cdn.skypack.dev", path: "@octokit/core@^3.1.0" }],
        },
        {
          name: "0.1.1",
          deps: [{ author: "denoland", name: "std", version: "0.94.0" }],
          tdeps: [],
          tpdeps: [{ host: "cdn.skypack.dev", path: "@octokit/core@^3.1.0" }],
        },
        {
          name: "0.1.2",
          deps: [{ author: "denoland", name: "std", version: "0.95.0" }],
          tdeps: [],
          tpdeps: [{ host: "cdn.skypack.dev", path: "@octokit/core@^3.1.0" }],
        },
        {
          name: "0.1.3",
          deps: [{ author: "denoland", name: "std", version: "0.96.0" }],
          tdeps: [],
          tpdeps: [{ host: "cdn.skypack.dev", path: "@octokit/core@^3.1.1" }],
        },
        {
          name: "0.2.0",
          deps: [{ author: "denoland", name: "std", version: "0.96.0" }],
          tdeps: [],
          tpdeps: [{ host: "cdn.skypack.dev", path: "@octokit/core@^3.1.1" }],
        },
        {
          name: "0.2.1",
          deps: [{ author: "denoland", name: "std", version: "0.96.0" }],
          tdeps: [],
          tpdeps: [{ host: "cdn.skypack.dev", path: "@octokit/core@^3.2.0" }],
        },
        {
          name: "0.3.0",
          deps: [{ author: "denoland", name: "std", version: "0.97.0" }],
          tdeps: [],
          tpdeps: [{ host: "cdn.skypack.dev", path: "@octokit/core@^3.2.0" }],
        },
        {
          name: "0.3.1",
          deps: [{ author: "denoland", name: "std", version: "0.98.0" }],
          tdeps: [],
          tpdeps: [{ host: "cdn.skypack.dev", path: "@octokit/core@^3.2.0" }],
        },
        {
          name: "0.3.2",
          deps: [{ author: "denoland", name: "std", version: "0.98.0" }],
          tdeps: [],
          tpdeps: [{ host: "cdn.skypack.dev", path: "@octokit/core@^3.2.1" }],
        },
      ],
      tags: [],
      devConfig: {
        ignore: [],
      },
      publishConfig: {
        main: "mod.ts",
        bin: ["ghlog.ts"],
      },
      files: ["examples/basic.ts", "examples/deno.ts", "examples/yargs.ts", "ghlog.ts", "mod.ts", "src/deps.ts", "src/main.ts", "src/utils.ts"],
    },
  ];
  