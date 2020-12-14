# sentry-issues-cli

Display unresolved issues from [Sentry](https://sentry.io).

With the `--fail` parameter set to `true`, `sentry-issues-cli` returns a non-zero code when there is at least one unresolved issue. This can be used to break a CI pipeline.

## Installation

Use `npm install -g sentry-issues-cli` to install.

## Usage

Run `sentry-issues-cli` see available options.

Available options:

```
Options:
  --help          Show help                                            [boolean]
  --version       Show version number                                  [boolean]
  --project       Project name in Sentry                     [string] [required]
  --organization  Organization name in Sentry                [string] [required]
  --sentryToken   Sentry authentication token                [string] [required]
  --level         Sentry issue level
                     [string] [choices: "warning", "error"] [default: "warning"]
  --lastSeen      Time interval in which issues were last seen (see
                  https://docs.sentry.io/product/sentry-basics/search for
                  details)                        [string] [choices: "1d", "7d"]
  --fail          Return non-zero code when there is at least one unresolved
                  issue in Sentry                     [boolean] [default: false]
```
