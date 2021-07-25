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
        "NEST_F3C4CD0E19685CB833AA6C7B3085C3AC20233D58F404DC0541198955E4118995",
        "NEST_41B08C008E9ADC453245C4C4A1E2266626AC630D0D6AD3A6B19F7AF823400BB5",
        "NEST_E131835BB911B15436B98B2B6A4F8F9CBBCE0B6CB27736E8B6F1EACFA2997F69",
      ],
    },
    {
      username: "oganexon",
      name: "Maël Acier",
      avatar: "https://github.com/oganexon.png",
      authTokens: [
        "NEST_7A833316A27B3CB5E841DEB40269FB74126D7507D0F46E559EAF879EB4433E78",
        "NEST_F9AC953D4939F1B16EE543DA3EEEA52610E63C8A12C9888B9A2C4DAE97D73AD2",
        "NEST_8598CAF1FA77D2EC0E6CC6A7BBF30044FA0730950F5D50E04173BFF527C03059",
      ],
    },
    {
      username: "nestland",
      name: "Nest Land",
      avatar: "https://github.com/nestdotland.png",
      bio: "The Nest Authors",
      authTokens: [
        "NEST_334A4A650B305188973C82742AD636F63AD2614DAA2A7955FBE50D233F2E1A07",
        "NEST_07F651ED038E8026910ABE91A841FF1984E228687543D705B8D5D1E256085967",
        "NEST_4CB7B308D8E7038C7218EE21BFD480187A7B6DE4F66BDAF5EF360D11D33E1439",
      ],
    },
    {
      username: "denoland",
      name: "Deno",
      avatar: "https://github.com/denoland.png",
      bio: "The Deno Authors",
      authTokens: [
        "NEST_14D1BA61F2DDF643126CAA3C470DA9B484AD33A57AFDFDE59A3400A588479814",
        "NEST_AB2148B2480D645440D0D38CC7667B2A35386C3B0C6966FAC33147BF1B258CA8",
        "NEST_C02BC19B60DD6B4AF6A6B2328845C4B459CF83A2315B6AF451D93CFD2D780E33",
      ],
    },
    {
      username: "ry",
      name: "Ryan Dahl",
      avatar: "https://github.com/ry.png",
      bio: "Creator of NodeJS and Deno. No big deal 😎",
      authTokens: [
        "NEST_E7C4C10F010DE5CCFB46E32C81483C36E766FF37630596FAFFA10143B04B0CCD",
        "NEST_06TH800F9LBC8VIIP6DNYKH4LQI1W5FC2HREQ1GMNHL75I2AMEQQ48D9SQLH558J",
        "NEST_1B85032447A0592DC46F964CD2EAC6231862B909035F0F5859234797BC9F6F28",
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
  