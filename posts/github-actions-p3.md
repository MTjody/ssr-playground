---
title: "Github Actions - Reviewing Deployments"
date: "2021-08-31"
description: "Add reviewers for your critical Github Actions Deployments"
tldr: ""
topics: "Github Actions, CI/CD"
---

## Previous post

In [this previous post](/posts/github-actions-p2), we learned how to .... Now, let's look at how .... This enables ...

## Manual Deployments

When running your Github actions, you typically want to keep the critical deployment-related actions behind a couple of manual steps with guards. Why? In any given project I assume the team wants to have full control over when something deploys even though continuous deployment is a much sought after reality. The implication of automatically deploying your application could be e.g. the team not being properly staffed to handle a set-back related to the newest deployment. Imagine being a developer in your project having to hunt down team members to help with an outage. Oh the terror.

The first step is to create a brand new Action, which should be concerned with deploying your application. The workflow trigger should be set to `workflow_dispatch`, we wanted this to be manually invoked, right? Next up we would probably need to add environment variables. These differ greatly from project to project, but would typically be e.g. deployment keys. Finally the you specify the jobs. This is a personal opinion but I would rather run all the build- and test-related jobs again to make sure all checks pass before deployment. You could argue that all the code in your `main`-branch has been built and tested, and you would be right. But I sleep better this way!

```yml
# .github/workflows/build.yml
on:
  workflow_dispatch:
    inputs:
      versionType:
        description: "The new semver version type to publish, e.g. patch, minor, major"
        required: true
      message:
        description: "Git tag message"
        required: true

```

Each job runner needs to run on something, e.g. a predefined OS or container. A list of available runners can be found [here](https://docs.github.com/en/actions/using-github-hosted-runners/about-github-hosted-runners#supported-runners-and-hardware-resources). This is set by the `runs-on` keyword. If you want to mix parallel and sequential jobs, you can use the `needs` keyword. It specifies which jobs need to be completed before that job runs. In the example above, we see that the Setup job precedes the code quality related jobs, and the build needs all those to complete before triggering.

## The Setup Job

Ideally, we'll perform tasks here that can benefit upcoming jobs somehow. In our case, we want to install and cache our dependencies. This allows other jobs to re-use what's in the cache to increase the overall workflow speed. Let's have a look:

```yml
# .github/workflows/build.yml
# Omitted
jobs:
  Setup:
    runs-on: ubuntu-latest
    # The steps below are performed in sequential order
    steps:
      - name: Checkout the repository
        uses: actions/checkout@v2

      - name: Setup node
        uses: actions/setup-node@v1
        with:
          node-version: 14

      - name: Set yarn cache directory path
        id: yarn-cache-dir-path
        run: echo "::set-output name=dir::$(yarn cache dir)"

      - name: Retrieve Cache
        uses: actions/cache@v2
        id: yarn-cache
        with:
          path: |
            **/node_modules
            /home/runner/.cache/Cypress
            ${{ steps.yarn-cache-dir-path.outputs.dir }}

          key: ${{ runner.os }}-yarn-${{ hashFiles('**/yarn.lock') }}
          restore-keys: |
            ${{ runner.os }}-yarn

      - name: Install Dependencies
        run: yarn install --frozen-lockfile --prefer-offline
```

Each step in a job is an entry in the `steps` list. The name property will be shown in the Github Actions GUI. The GUI will show the action `uses` identifier if name is omitted. Since we're working on the repository with yarn commands, the runner must have access to the code, this is what the checkout step is for. The `setup-node` action with node version 14 has yarn enabled by default.

The next two steps are for the cache, and since we use yarn here we first set the yarn cache directory so that the `cache@v2` action can use it. The cache action has recently enabled multiple directories, and for this setup we'll add:

- the yarn cache directory - this is used so that yarn doesn't download packages from the web on each install, making installs a lot faster.
- `node_modules` - contains all dependencies and their binaries. This will take up quite a lot of space so make sure you're within the Github Actions cache limit.
- the Cypress cache - We're using Cypress for our E2E tests. Without this cached, this error was thrown:

> _The cypress npm package is installed, but the Cypress binary is missing._
> _We expected the binary to be installed here: /home/runner/.cache/Cypress/7.3.0/Cypress/Cypress_ 
> _Reasons it may be missing:_
> - _You're caching 'node_modules' but are not caching this path: /home/runner/.cache/Cypress_
> - _You ran 'npm install' at an earlier build step but did not persist: /home/runner/.cache/Cypress_
>
> _Properly caching the binary will fix this error and avoid downloading and unzipping Cypress._

## The other jobs

Now the Setup job has run, installed and cached the dependencies, so any upcoming installs will be quick work. In order for the other jobs to use the yarn dependencies cache, simply copy / paste the cache steps from before.

In the UnitTest job below, note a few things:

1. we specify that it's dependant on `Setup` job, this ensures that Setup must complete successfully before UnitTest starts.
2. we need to checkout the code, retrieve the cahce and perform an install again. We tell yarn to install from the local cache by passing the `--prefer-offline` argument.
3. If we were to omit the cache and install, the `yarn test` would likely trigger something like `jest`, which wouldn't exist in this Github actions runner, since each runner is a separate fresh instance.

```yml
# .github/workflows/build.yml
# Omitted
jobs:
  # Omitted
  StaticAnalysis:
    needs: Setup
    runs-on: ubuntu-latest
    steps:
      # omitted

  UnitTest:
    needs: Setup
    runs-on: ubuntu-latest
    steps:
      - name: Checkout the repository
        uses: actions/checkout@v2

      - name: Set yarn cache directory path
        id: yarn-cache-dir-path
        run: echo "::set-output name=dir::$(yarn cache dir)"

      - name: Retrieve Cache
        uses: actions/cache@v2
        id: yarn-cache
        with:
          path: |
            **/node_modules
            /home/runner/.cache/Cypress
            ${{ steps.yarn-cache-dir-path.outputs.dir }}

          key: ${{ runner.os }}-yarn-v3-${{ hashFiles('**/yarn.lock') }}
          restore-keys: |
            ${{ runner.os }}-yarn-v3

      - name: Install Dependencies
        run: yarn install --frozen-lockfile --prefer-offline

      - name: Unit test
        run: yarn test

  E2ETest:
    needs: Setup
    runs-on: ubuntu-latest
    steps:
      # omitted
```

## Run in parallell

Now, how do we get the jobs to run in parallel? Simply by declaring several jobs (as opposed to one almighty job), and specifying which job needs which in order to run, we get the runners to run in parallell. Note how `UnitTest`, `E2ETest`, and `StaticAnalysis` all declare a dependency on `Setup`, this ensures they will run independent from each other.

It is also possible for a job to not be referenced by other jobs, and not specify any needs. This type of job will also run in parallel but won't affect or depend on the others. It's clearly a separate island in the workflow depiction below:

![Github Actions Workflow Overview](/images/github-actions-p2.png)

Another benefit from this compared to a single huge job is that when one step fails, the whole workflow isn't cancelled. This means that e.g. if the static code analysis fails, we'll still know if the unit tests and E2E tests passed, as opposed to finding that out once the static analysis passes.

In my latest project, using the cache resulted in a drastic performance boost for the installation step. Without the cache, the installation took ~2min 30s. When adding the yarn.lock cache it went down to 1min. When caching both the yarn.lock and node_modules it only took 2s. **That's 75x faster**! The trade-off comes in the cache-retrieval though, which now takes ~30s, but that's still a massive improvement overall (5x). Also note that if your dependencies are updated, the yarn.lock will have been updated, leading to a new cache which results in a slower `Setup` job.

## What the future holds

In an upcoming post, we'll look into how to setup "job guards" which require manual approval in order to run, these can typically be used in a deployment scenario where you'd want some reviewer(s) to make sure everything is in order.
