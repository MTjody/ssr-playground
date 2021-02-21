---
title: "Introduction to Terraform"
date: "2020-09-23"
description: "Get started with Terraform by setting up monitoring with uptime checks, alert policies and more in GCP."
tldr: "Terraform describes your infrastructure as code."
topics: "IaC, Terraform, GCP, Monitoring"
---

## Understanding

> Terraform is a tool for building, changing, and versioning infrastructure safely and efficiently”
> — Terraform intro, Hashicorp

[Terraform](https://www.terraform.io/) allows _you_ to **declare** what the **end-state** of your **infrastructure** is supposed to look like, and _TF_ figures out the rest. The term **Infrastructure as code** is used a lot and it means exactly that: you describe your infrastructure as code, and the dev workflow should be the same as when you write application code. **On changes** to your code, you run **Terraform commands** to format, validate and plan **your infrastructure changes**. You can then choose to **apply** your changes, and should you want it, you can **destroy** the resources you just added. This can come in handy for temporary example projects or **cloud dev-environments**.

Simply speaking, Terraform is a CLI tool wrapping the ‘administrator APIs’ of cloud platform providers. E.g. [Terraform Google Registry](https://registry.terraform.io/providers/hashicorp/google/latest/docs) uses the [Googles several REST APIs](https://cloud.google.com/run/docs/reference/rest) under the hood.

We’ll be looking into GCP for this particular blogpost.

## Configuring

When explaining Terraform, I mentioned that it allows you to declare the end-state of your infrastructure for cloud providers. The configuration files are **declarative** and use a language called [HCL](https://github.com/hashicorp/hcl) - Hashicorp Configuration Language. It’s like a mutated JSON / YAML beast with a lot of extras on top.

All of your infrastructure state needs to be stored somehow, in order for TF to check for differences between the current configuration and any changes made. This state is referred to as the [backend](https://www.terraform.io/docs/backends/index.html). For testing purposes as a solo developer, you could have the state on your local machine (which is the default anyway). But for collaboration, consider setting up a shared backend. More on that in [collaborating](#collaborating).

Let’s look at how we structured files and folders in a project.

![Screenshot of folders](/images/terraform-folders.png)

`main.tf` is the entrypoint to our configuration. This file contains the meta of our infrastructure, such as which version of Terraform we’re using, and what cloud provider libraries we’re using. A **provider** is e.g. Amazon, GCP, or Azure. A **module** is a **logical grouping of resources** as defined by the provider. A **resource** is like a provider feature, e.g. _Uptime checks_ is a feature within the Monitoring module.

For each module a folder is created, and that folder contains all the resources and data for that module. Each module will also have it's `main.tf` file, which specifies what configuration is needed and returned when the module runs.

Now let’s look into some configuration files.

### `main.tf`

The Terraform block allows us to specify which version of TF we need. _Backend_ is where the _Terraform state_ is stored, it can be local or remote. We’ll get back to this later.

```bash
terraform {
  required_version = ">= 0.13"
  backend "gcs" {
    # Leaving this empty will trigger a prompt from CLI.
  }
}
```

**locals** is a block of locally defined variables, in this case we define a `credentials_file` variable used for GCP credentials. The `file`-function lets us load a file and use the file contents in our config.

```bash
locals {
  credentials_file = file(var.keyfile_path)
}
```

The **provider** block specifies that we’re using GCP. It requires a project id and credentials. The version specifies what version of the provider we’re using.

```bash
provider "google" {
  project     = var.project_id
  credentials = local.credentials_file
  version     = "~> 3.36.0"
  region      = var.region
}
```

We also list the modules we've defined in folders, with a source path, and a variable. Terraform will look for a `main.tf`-file in the provided directory. Note the use of variables. We use variables to enable multiple environments and decreasing risk of committing project secrets. The variables can be injected in a multitude of ways; they can e.g. be stored in files, or added as CI/CD build secrets.

The ‘split’ function converts a string into a list using the provided separator. Here we used it to convert a string of comma-separated email addresses into a list.

```bash
module "monitoring" {
  source = "./monitoring"
  notification_recipients        = split(",", var.notification_recipients)
}

module "cloud-storage" {
  # Omitted ...
}

# Other modules omitted...
```

Input variables can be defined as well, with support for type checking and default values.

```bash
variable "keyfile_path" {
  type    = string
  default = "some value"
}
```

### Case Study: Microservice Monitoring

I want to highlight a few powerful features of Terraform by first explaining what we're after. For our GCP project we want to

1. add http **uptime checks** for several microservices
2. add **notification channels** should something go down
3. create **alert policies** for our uptime checks, alerting our newly created notification channels

Let’s start from the top. This is not complete configuration though, a lot has been omitted for brevity. All the files in any given module will be combined by Terraform in the proper order when running commands. TF figures out any dependencies so that operations are performed in the required order.

In the first block, we are adding _http uptime checks_, and we have several microservices to check. Instead of repeating the block for each microservice, a variable `paths` is used here. The variable type is `map`, with `objects` as values for each `key`, plain json actually. We access the values with dot-notation e.g. `each.value.name`, and the resource will be created for each path provided, as indicated by the `for_each` keyword. We then set values such as `display name` and `hostname`.

```bash
# UPTIME CHECKS
resource "google_monitoring_uptime_check_config" "http" {
  for_each = var.paths
  display_name = each.value.name

  http_check {
    path           = each.key
  }

  monitored_resource {
    type = "uptime_url"
    labels = {
      project_id = var.project_id
      host       = each.value.host
    }
  }
}

```

In the next resource block, we’re adding notification channels, based on the `notification recipients` string I mentioned earlier. For the display name, we combine functions `trimspace` and `split` for each email, and access the first value of the result.

```bash
# NOTIFICATION CHANNELS
resource "google_monitoring_notification_channel" "basic" {
  for_each = var.notification_recipients

  display_name = trimspace(split("@", each.key)[0])
  type         = "email"
  labels = {
    email_address = trimspace(each.key)
  }
}
```

The third block is where Terraform really shines. We’re creating alert policies for the uptime checks from earlier, and we’ll also use the notification channels previously created. So we iterate the same paths again and **reference previous resources** with the `${..}`-syntax in the `display_name` prop. And then we also add the recently created notification channels for each alert. This time we use the for..in syntax, this is a way for us to extract an output value into our array. The syntax is `[for <ITEM> in <LIST> : <OUTPUT>]`.

```bash
# ALERTS FOR UPTIME CHECKS
resource "google_monitoring_alert_policy" "alert_policy" {
  for_each = var.paths

  display_name = "Uptime failed: ${google_monitoring_uptime_check_config.http[each.key].display_name}"
  conditions {
    display_name = "Failure of uptime check_id ${google_monitoring_uptime_check_config.http[each.key].uptime_check_id}"
    condition_threshold {
      # omitted
    }
  }

  notification_channels = [
    for instance in google_monitoring_notification_channel.basic :
    instance.name
  ]
}

```

## Tinkering

So how does a developer get started with this? [Install the Terraform CLI](https://learn.hashicorp.com/tutorials/terraform/install-cli) and start running Terraform commands in the terminal!

```bash
# initializes configured backend state
# defaults to local state e.g. on your machine
[~/my_project] terraform init

# checks if you managed to write correct HCL
[~/my_project] terraform validate

# dry-runs the configuration. The output is a ‘git-diff’ like
# (wall of) text showing what is to be added, changed, and deleted.
[~/my_project] terraform plan

# creates the resources according to the plan. In the GCP case
# it runs a series of POST requests and follows up and outputs the results.
[~/my_project] terraform apply

# optional, destroys the configured resources.
# Should not be used in production unless you love adrenalin :)
[~/my_project] terraform destroy
```

The workflow for a developer is basically running these commands until you have your desired infrastructure, or your demo-project has served its purpose.

## Collaborating

For collaborating with infrastructure as code, we have the same workflow but with some modifications.

We don’t want _your backend state_ to differ from a colleagues backend state, so it **should be remote** - just like source control. The backend can be setup as a remote backend in e.g. Google Cloud Storage with strict rules on access/modify and with versioning enabled. This prevents developers from creating conflicts and messing with the projects infrastructure.

The _commands shouldn’t run on a developers machine_, rather they should be **run from a CI/CD server**. In our case, we used Azure Devops as a CI/CD server and ‘gate pipelines’ were setup to run `Terraform plan` on each PR. The developers could see during code reviews if there were any changes to the infrastructure. A separate release pipeline was setup as well, so that the ‘apply’ command did not run without an authorized dev explicitly running the pipeline. The _staging_ and _production environments_ were separated as well, adding an extra layer of security.
