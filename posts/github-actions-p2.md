---
title: "Github Actions - Parallelised builds with caching"
date: "2021-06-28"
description: "Leveraging parallelisation and caching for faster Github Actions Workflows"
tldr: "Define several jobs in a workflow, and use the cache action"
topics: "Github Actions, CI/CD"
---

## Previous post

In [this previous post](/posts/github-actions), we learned how to setup a Github Actions workflow and run it from a working branch while it was still under development. Now, let's look at how we can use parallel jobs with caching in order to separate and speed up our workflows. This enables specifying which parts of the workflow are critical and dependant, and which parts are optional.

## Parallel Builds

Let's jump right in to the build.yml file from before, and make some changes. We'll add the trigger to include push events from all branches, and under the jobs object, we'll add some properties. Congrats, your workflow is now parallelised.

```yml
# .github/workflows/build.yml
name: Build the client
# Controls when the action will run.
on:
  # Triggers the workflow on push to all branches.
  push:
    branches: ["**"]

  # Allows you to run this workflow manually from the Actions tab
  workflow_dispatch:

# A workflow run is made up of one or more jobs that can run sequentially or in parallel
jobs:
  # This workflow contains a single job called "build"
  Setup:
    runs-on: ubuntu-latest
    # Omitted
  StaticCodeAnalysis:
    needs: Setup
    # Omitted
  UnitTests:
    needs: Setup
    # Omitted
  E2ETests:
    needs: Setup
    # Omitted
  UnimportantStep:
    # Omitted
  Build:
    needs: [StaticCodeAnalysis, UnitTests, E2ETests]
```

Each job runner needs to run on something, e.g. a predefined OS or container. A list of available runners can be found here. This is set by the `runs-on` keyword. If you want to mix parallel and sequential jobs, you can use the `needs` keyword. It specifies which jobs need to be completed before that job runs. In the example above, we see that the Setup job precedes the code quality related jobs, and the build needs all those to complete before triggering.

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

> _The cypress npm package is installed, but the Cypress binary is missing._ > _We expected the binary to be installed here: /home/runner/.cache/Cypress/7.3.0/Cypress/Cypress_ > _Reasons it may be missing:_
>
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

## What the future holds

In an upcoming post, we'll look into how to setup "job guards" which require manual approval in order to run, these can typically be used in a deployment scenario where you'd want some reviewer(s) to make sure everything is in order.
