---
title: "Github Actions - Reviewing Deployments"
date: "2021-08-31"
description: "Add reviewers for your critical Github Actions Deployments"
tldr: "Refer to protected environments in your workflow to add deployment guards"
topics: "Github Actions, CI/CD"
---

## Previous post

In [this previous post](/posts/github-actions-p2), we learned how to use the [cache-action](https://github.com/actions/cache), and run parallel jobs to speed up our workflows. Now, let's look at how we can enable manual reviews of deployment workflows. This gives a team the possibility to run deployments with an approval guard, i.e. it would typically go through the team-lead or tech project manager as an extra security measure.

## Separate deployment workflow

When running your Github actions, you typically want to keep the critical deployment-related actions behind a couple of manual steps with guards. Why? In any given project I assume the team wants to have full control over when something deploys even though continuous deployment is a much sought after reality. The implication of automatically deploying your application could be e.g. the team not being properly staffed to handle a set-back related to the newest deployment. Imagine being a developer in your project having to hunt down team members to help with an outage. Oh the terror.

The first step is to create a brand new Action, which should be concerned with deploying your application. The workflow trigger should be set to `workflow_dispatch`, we wanted this to be manually invoked, right? Remember that you can use the inputs object here to add input controls when deploying. These could be variables that are cross-checked in your scripts, a deployment message etc.

Next up we would probably need to add environment variables. These differ greatly from project to project, but would typically be e.g. deployment keys. Finally the you specify the jobs. This is a personal opinion but I would rather run all the build- and test-related jobs again to make sure all checks pass before deployment. You could argue that all the code in your `main`-branch has been built and tested, and you would be right. But I sleep better this way! 

_The workflow below has a lot of steps omitted, please refer to the older posts for an in depth look at what they might look like._

```yml
# .github/workflows/deploy.yml
on:
  workflow_dispatch:
    inputs:
      publishMessage:
        description: "A message to be shown when the project is published."
        required: true
      optionalInformation:
        description: "Some optional information, note the 'required' property which is set to false."
        required: false

env:
  SOME_TOKEN: ${{ secrets.SOME_TOKEN }}
  SOME_API_KEY: ${{ secrets.SOME_API_KEY }}

jobs:
  Setup:
    # ...
  UnitTest:
    # ...
  E2ETest:
    # ...
  Build:
    # ...
  Publish:
    # ...
```

## Protected environment

Now that we have a deployment workflow we need to add a protected environment. Go to your repository settings, and under environments you add a new environment. Once you've given it a name you'll get to set it up. It's easy to setup; you can add reviewers and also branch protection rules for your deployments. You could for example enforce that the production environment is always deployed from your `main` branch.

![protected environment setup screen](/images/github-actions-p3-configure.png)

We just need to reference this bad boy from our workflow and then we're done. See the deployment file under the `Publish` job, we set the name and Github does the rest. 

**PRO TIP 1:** let's use the [Github deployments action](https://github.com/bobheadxi/deployments#github-deployments-) to get a nice activity log when navigating to the environment in Github. If used in a build workflow you'll also get informative entries in the Pull Request overview with links to the deployment. It's very simple to use, you just place the start step before your deployment, and the finish step afterwards. The `env` needs to match the environment name.

```yml
# .github/workflows/deploy.yml

# omitted

jobs:
  # omitted
  Publish:
    environment:
      name: "protected-environment"
    steps:
      - name: Track our deployment and update the activity logs
        uses: bobheadxi/deployments@v0.6.0
        id: project-name-deployment
        with:
          env: "protected-environment"
          step: start
          token: ${{ secrets.GITHUB_TOKEN }}
          ref: ${{ github.head_ref }}

      # Add whatever steps a deployment entails here. E.g:
      - name: Publish your app
        run: npm publish

      - name: Update deployment status
        uses: bobheadxi/deployments@v0.6.0
        if: always()
        with:
          step: finish
          token: ${{ secrets.GITHUB_TOKEN }}
          status: ${{ job.status }}
          deployment_id: ${{ steps.project-name-deployment.outputs.deployment_id }}
          env_url: https://example.org/your/environment/url
          desc: Description for the deployment
```

**PRO TIP 2:** we can name our deployments dynamically if we want temporary environments. This is useful if you build and deploy on a per-branch basis. When the PR is merged and the branch is deleted you just need to run the [deactivate](https://github.com/bobheadxi/deployments#step-deactivate-env) step. This is best done in a separate Github Actions Workflow which is triggered on `[PR closed](https://docs.github.com/en/actions/reference/events-that-trigger-workflows#pull_request)` events.

```yml
# .github/workflows/build.yml

# omitted

jobs:
  # omitted
  Publish-Dev:
    steps:
      - name: Track our deployment and update the activity logs
        uses: bobheadxi/deployments@v0.6.0
        id: project-name-dev-deployment
        with:
          # Make sure to set e.g. a branch name env property before using it
          env: "dev-build-${{env.BRANCH_NAME}}"
          step: start
          token: ${{ secrets.GITHUB_TOKEN }}
          ref: ${{ github.head_ref }}

      # Add whatever steps a deployment entails here. E.g:
      - name: Publish your app
        run: npm publish

      - name: Update deployment status
        uses: bobheadxi/deployments@v0.6.0
        if: always()
        with:
          step: finish
          token: ${{ secrets.GITHUB_TOKEN }}
          status: ${{ job.status }}
          deployment_id: ${{ steps.project-name-deployment.outputs.deployment_id }}
          env_url: https://example.org/your/environment/${{env.BRANCH_NAME}}/url
          desc: Description for the deployment
```

*Note!* You should probably delete your branch dev environment on your hosting provider as well, since the deactivation below only concerns the Github Deployment. Nobody likes pollution in the cloud 🤓


```yml
# .github/workflows/deactivate-env.yml

# omitted

jobs:
  # omitted
  Deactivate-Env:
    steps:
      - name: Delete dev environment on hosting provider
        # Depending on hosting provider, you'll probably use their CLI and run some delete command here

      - name: Deactivate the environment
        uses: bobheadxi/deployments@v0.4.3
        with:
          step: deactivate-env
          token: ${{ secrets.GITHUB_TOKEN }}
          env: ${{env.BRANCH_NAME}}
          desc: Environment deactivated

```

This concludes our three-part series about Github Actions Workflows. Hope you found it useful! Stay tuned as I have a post planned which describes how to set up a simple and customized changelog structure for your projects with no dependencies on any other actions.
