# Custom Setup Notes

## Setup Forked Repo
- Upstream:  https://github.com/Thinkful-Ed/starter-movie-front-end
- Current repo:  https://github.com/kernel528/welovemovies-frontend

## Install Locally
- Due to some errors and compatibility issues with node `18.20.4+` the following was executed to resolve:
```bash
: npm start

> starter-movie-front-end@0.1.0 start
> react-scripts start

node:internal/modules/cjs/loader:597
      throw e;
      ^

Error [ERR_PACKAGE_PATH_NOT_EXPORTED]: Package subpath './lib/tokenize' is not defined by "exports" in /home/joe/github/kernel528/Chegg-Skills/starters/starter-movie-front-end/node_modules/postcss-safe-parser/node_modules/postcss/package.json
    at new NodeError (node:internal/errors:405:5)
    at exportsNotFound (node:internal/modules/esm/resolve:366:10)
    at packageExportsResolve (node:internal/modules/esm/resolve:713:9)
    at resolveExports (node:internal/modules/cjs/loader:590:36)
    at Module._findPath (node:internal/modules/cjs/loader:664:31)
    at Module._resolveFilename (node:internal/modules/cjs/loader:1126:27)
    at Module._load (node:internal/modules/cjs/loader:981:27)
    at Module.require (node:internal/modules/cjs/loader:1231:19)
    at require (node:internal/modules/helpers:177:18)
    at Object.<anonymous> (/home/joe/github/kernel528/Chegg-Skills/starters/starter-movie-front-end/node_modules/postcss-safe-parser/lib/safe-parser.js:1:17) {
  code: 'ERR_PACKAGE_PATH_NOT_EXPORTED'
}
```
- Followed some guidance from ChatGPT searching...
```bash
npm install --legacy-peer-deps
npm update
```
- When initially running `npm start` after this, resulted in this error:
```bash
Starting the development server...

/home/joe/github/kernel528/Chegg-Skills/starters/starter-movie-front-end/node_modules/react-scripts/scripts/start.js:19
  throw err;
  ^

Error: error:0308010C:digital envelope routines::unsupported
    at new Hash (node:internal/crypto/hash:69:19)
    at Object.createHash (node:crypto:133:10)
    at module.exports (/home/joe/github/kernel528/Chegg-Skills/starters/starter-movie-front-end/node_modules/webpack/lib/util/createHash.js:135:53)
    at NormalModule._initBuildHash (/home/joe/github/kernel528/Chegg-Skills/starters/starter-movie-front-end/node_modules/webpack/lib/NormalModule.js:417:16)
    at /home/joe/github/kernel528/Chegg-Skills/starters/starter-movie-front-end/node_modules/webpack/lib/NormalModule.js:452:10
    at /home/joe/github/kernel528/Chegg-Skills/starters/starter-movie-front-end/node_modules/webpack/lib/NormalModule.js:323:13
    at /home/joe/github/kernel528/Chegg-Skills/starters/starter-movie-front-end/node_modules/loader-runner/lib/LoaderRunner.js:367:11
    at /home/joe/github/kernel528/Chegg-Skills/starters/starter-movie-front-end/node_modules/loader-runner/lib/LoaderRunner.js:233:18
    at context.callback (/home/joe/github/kernel528/Chegg-Skills/starters/starter-movie-front-end/node_modules/loader-runner/lib/LoaderRunner.js:111:13)
    at /home/joe/github/kernel528/Chegg-Skills/starters/starter-movie-front-end/node_modules/babel-loader/lib/index.js:59:103 {
  opensslErrorStack: [ 'error:03000086:digital envelope routines::initialization error' ],
  library: 'digital envelope routines',
  reason: 'unsupported',
  code: 'ERR_OSSL_EVP_UNSUPPORTED'
}

Node.js v18.20.4
```
- Ran with this option: `: NODE_OPTIONS=--openssl-legacy-provider npm start`
- Frontend UI is now functional (albeit with broken backend at this point.) [Initial Frontend](../images/Screenshot_Inital_Frontend.png)
- Updated the `package.json` scripts section with:  `"start-legacy": "NODE_OPTIONS=--openssl-legacy-provider react-scripts start",`
