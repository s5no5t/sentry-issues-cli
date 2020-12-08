const axios = require("axios");
const dotenv = require("dotenv");
const yargs = require("yargs");

async function main() {
  dotenv.config();

  const sentryToken = process.env.SENTRY_TOKEN;
  if (!sentryToken) throw new Error("SENTRY_TOKEN not found");

  const yargsConfig = yargs.option("project", {
    type: "string",
    demandOption: true,
    description: "Project name in Sentry",
  });

  yargsConfig.option("organization", {
    type: "string",
    demandOption: true,
    description: "Organization name in Sentry",
  });

  yargsConfig.option("lastSeen", {
    type: "string",
    demandOption: false,
    choices: ["1d", "7d"],
    description:
      "Time interval in which issues were last seen (see https://docs.sentry.io/product/sentry-basics/search for details)",
  });

  const args = yargsConfig.argv;

  console.log(
    `Checking for unresolved issues in Sentry project ${args.project}`
  );

  const lastSeenParam = args.lastSeen
    ? `lastSeen%3A${args.lastSeen === "1d" ? "-1d" : "-7d"}`
    : undefined;
  const sentryQueryUrl = `https://sentry.io/api/0/projects/${args.organization}/${args.project}/issues/?query=${lastSeenParam}+is%3Aunresolved&statsPeriod=`;

  const axiosResponse = await axios.default.get(sentryQueryUrl, {
    headers: {
      Authorization: `Bearer ${sentryToken}`,
    },
  });

  const issues = axiosResponse.data;

  if (issues.length > 0) {
    console.log(
      issues.length === 1
        ? `😓 Found ${issues.length} unresolved issue:`
        : `😓 Found ${issues.length} unresolved issues:`
    );
    for (const issue of issues) {
      console.log(`* "${issue.title}" (${issue.permalink})`);
    }
    process.exit(1);
  } else {
    console.log("🎉 Yay! There are no unresolved issues.");
  }
}

void (async function () {
  try {
    await main();
  } catch (e) {
    console.error(e.message);
    console.error(e);
    process.exit(1);
  }
})();
