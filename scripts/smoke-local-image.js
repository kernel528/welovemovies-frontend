const { execFileSync } = require("child_process");

const containerName = "welovemovies-frontend-smoke";
const image = "kernel528/welovemovies-frontend:local";
const paths = ["/health", "/", "/movies"];
const attempts = 15;

function runDocker(args, ignoreFailure = false) {
  try {
    execFileSync("docker", args, {
      stdio: ignoreFailure ? "ignore" : "inherit",
    });
  } catch (error) {
    if (!ignoreFailure) throw error;
  }
}

async function smokeTest() {
  runDocker(["rm", "--force", containerName], true);

  try {
    runDocker([
      "run",
      "--detach",
      "--name",
      containerName,
      image,
    ]);

    for (let attempt = 1; attempt <= attempts; attempt += 1) {
      try {
        for (const path of paths) {
          runDocker([
            "run",
            "--rm",
            "--network",
            `container:${containerName}`,
            "curlimages/curl:8.7.1",
            "--fail",
            `http://localhost${path}`,
          ]);
        }
        console.log(`Smoke test passed on attempt ${attempt}.`);
        return;
      } catch (error) {
        // Nginx has not started serving the static bundle yet.
      }

      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    throw new Error(`Smoke test failed after ${attempts} attempts.`);
  } finally {
    runDocker(["rm", "--force", containerName], true);
  }
}

smokeTest().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
