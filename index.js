module.exports = app => {
  const default_config = {
    "updateDocsWhiteList": ["bug", "chore"],
    "updateDocsTargetFiles": ["README", "docs/"]
  }

  app.on(['pull_request.opened', 'pull_request.edited'], async context => {
    const files = await context.github.pullRequests.getFiles(context.issue())
    let config = await context.config('config.yml')
    if (!config) {
      config = default_config
    }
    const docs = files.data.find(function (file) {
      let targetFile

      if (config.updateDocsTargetFiles) {
        targetFile = config.updateDocsTargetFiles.find(function (item) {
          if (file.filename.startsWith(item) || file.filename.includes(item)) {
            return item
          }
        })
        return targetFile
      } else {
        if (file.filename.startsWith('README') || file.filename.includes('docs/')) {
          return file
        }
      }
    })

    let mergeable = false
    let message = "Error in processing"

    if (!docs) {
      // Get config.yml and comment that on the PR
      try {
        const title = context.payload.pull_request.title
        let whiteList
        if (config.updateDocsWhiteList) {
          whiteList = config.updateDocsWhiteList.find(function (item) {
            if (title.toLowerCase().includes(item.toLowerCase())) {
              return item
            }
          })
        }
        // Check to make sure it's not whitelisted (ie bug or chore)
        if (whiteList) {
          mergeable = true
          message = "Whitelist in title"
        } else {
          message = "Documentation not updated"
        }
      } catch (err) {
        if (err.code !== 404) {
          throw err
        }
      }
    } else {
      mergeable = true
      message = "Doc updated"
    }
    setStatus(context, mergeable, message)
  })
}

function setStatus(context, mergeable, message) {
  const {github} = context;

  const status =
    mergeable
      ? {
          state: 'success',
          description: message,
        }
      : {
          state: 'failure',
          description: message,
        };

  return github.repos.createStatus(
    context.repo({
      ...status,
      sha: context.payload.pull_request.head.sha,
      context: 'update-docs',
    }),
  );
}
