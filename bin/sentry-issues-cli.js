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

  const args = yargsConfig.argv;

  console.log(
    `Checking for unresolved issues in Sentry project ${args.project} in the last 24 hours...`
  );

  const sentryQueryUrl = `https://sentry.io/api/0/projects/${args.organization}/${args.project}/issues/?query=lastSeen%3A-1d+is%3Aunresolved&statsPeriod=`;

  const axiosResponse = await axios.default.get(sentryQueryUrl, {
    headers: {
      Authorization: `Bearer ${sentryToken}`,
    },
  });

  const issues = axiosResponse.data;

  // eslint-disable-next-line no-console
  // console.log(issues.data);
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
    // eslint-disable-next-line no-console
    console.error(e.message);
    process.exit(1);
  }
})();
