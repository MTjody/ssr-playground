---
title: "Github Actions - Developing Workflows before merge"
date: "2021-05-20"
description: "How to test your GH Actions Workflows before merging to your main branch."
tldr: "Commit a dummy workflow to main, develop and trigger manually from another branch"
topics: "Github Actions, CI/CD, Quick-Tips"
---

## Background

When I was developing a Github Actions Workflow I was confused as to how to test it and tweak it before creating a Pull Request and asking for a review. It isn't as straightforward as you could imagine but it turns out it's not that difficult. Our repository already had GH Actions workflows so when trying to select the one I pushed to a git branch it didn't show up.

![Workflow from branch is not listed](/images/no-action-workflow.png)

For this post, we'll be creating a Github Workflow which runs some NPM scripts, and make it possible to trigger it manually.

## Setup

In your repository, checkout your main branch and, if you don't already have one, create a workflows folder inside a `.github`-folder. `.github/workflows` will - you guessed it - contain your workflow yml files. This workflow file is basically a dummy file which we will commit and push directly to main (not for the faint of heart!). Let's open up the terminal and get going:

```bash
# Terminal
[~/my_project:(some_branch)] git checkout main
> Switched to branch 'main'
> Your branch is up to date with 'origin/main'.
# create folders recursively with '-p'
[~/my_project:(main)] mkdir -p .github/workflows
# create an empty workflow file
[~/my_project:(main)] touch .github/workflows/build.yml
```

The workflow below doesn't really do anything, but it will allow us to find it and trigger it manually from another git branch later. It is safe to commit to your main branch, just make sure you don't commit and push other unrelated code.

```yml
# .github/workflows/build.yml
name: Build the client
# Allow for manual trigger
on: workflow_dispatch
# A workflow run is made up of one or more jobs that can run sequentially or in parallel
jobs:
  # This workflow contains a single job called "build"
  build:
    # The type of runner that the job will run on
    runs-on: ubuntu-latest
    # Steps represent a sequence of tasks that will be executed as part of the job
    steps:
      # Checks-out your repository under $GITHUB_WORKSPACE, so your job can access it
      - uses: actions/checkout@v2
      # Runs a single command using the runners shell
      - name: Run a one-line script
        run: echo Hello, world!
```

Let's head back to the terminal and finish the setup.

```bash
# Terminal
[~/my_project:(main)] git add .github/workflows/build.yml
[~/my_project:(main)] git commit -m"Add dummy workflow"
[~/my_project:(main)] git push
```

## Get to work

Let's work on the new workflow in the feature-branch, create a Pull Request and try it out directly from Github before commiting it to your main branch.

```bash
# Terminal
[~/my_project:(main)] git checkout -b"infra/build_workflow"
> Switched to a new branch 'infra/build_workflow'
# ... now make your changes, and push the changes to try it out
[~/my_project:(infra/build_workflow)] git add .github/workflows/build.yml
[~/my_project:(infra/build_workflow)] git commit -m"Update workflow"
[~/my_project:(infra/build_workflow)] git push origin infra/build_workflow
```

You can now select the workflow from the list using the name provided in the .yml-file.

![Run workflow from working branch](/images/yes-action-workflow.png)

Once selected, choose what branch to run it from, and now you're ready to incrementally add steps and jobs to your workflow on your working branch! For more information on how to setup a Github Actions Workflow, please refer to the [documentation](https://docs.github.com/en/actions).

In [this post](/posts/github-actions-p2), we'll take a look at how to parallelise your build and make use of the Github Actions runner cache to speed up builds!
