# update-docs

> a GitHub App built with [probot](https://github.com/probot/probot) that comments on newly opened Pull Requests that do not update either the README or a file in the `/docs` folder.

## Usage

1. Install the bot on the intended repositories. The plugin requires the following **Permissions and Events**:
- Pull requests: **Read & Write**
  - [x] check the box for **Pull Request** events
2. Add a `.github/config.yml` file that contains the contents you would like to reply within an `updateDocsComment`
3. Optionally, you can also add a `whiteList` that includes terms, that if found in the title, the bot will not comment on.
4. Optionally, you can also add `targetFiles` that includes the files or paths to consider documentation.
```yml
# Configuration for update-docs - https://github.com/zodvik/update-docs
updateDocsWhiteList:
  - bug
  - chore

updateDocsTargetFiles:
  - README
  - docs/
```

## Setup

```
# Install dependencies
npm install

# Run the bot
npm start
```

See [the probot deployment docs](https://github.com/probot/probot/blob/master/docs/deployment.md) if you would like to run your own instance of this plugin.
