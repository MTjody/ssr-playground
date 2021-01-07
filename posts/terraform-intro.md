---
title: "Introduction to Terraform"
date: "2020-09-23"
tldr: "Keeping your Infrastructure as code has several benefits!"
---

## Understanding

> Terraform is a tool for building, changing, and versioning infrastructure safely and efficiently”
> — Terraform intro, Hashicorp

[Terraform](https://www.terraform.io/) allows _you_ to **declare** what the **end-state** of your **infrastructure** is supposed to look like, and _TF_ figures out the rest. The term **Infrastructure as code** is used a lot and it means exactly that: you describe your infrastructure as code, and the dev workflow should be the same as when you write application code. **On changes** to your code, you run **Terraform commands** to format, validate and plan **your infrastructure changes**. You can then choose to **apply** your changes, and should you want it, you can **destroy** the resources you just added. This can come in handy for temporary example projects or **cloud dev-environments**.

Simply speaking, Terraform is a CLI tool wrapping the ‘administrator APIs’ of cloud platform providers. E.g. [Terraform Google Registry](https://registry.terraform.io/providers/hashicorp/google/latest/docs) uses the [Googles several REST APIs](https://cloud.google.com/run/docs/reference/rest) under the hood.

We’ll be looking into GCP for this particular blogpost.

## Configuring

When explaining Terraform, I mentioned that it allows you to declare the end-state of your infrastructure for cloud providers. The configuration files are **declarative** and use a language called [HCL](https://github.com/hashicorp/hcl) - Hashicorp Configuration Language. It’s like a mutated JSON / YAML beast with a lot of extras on top.

Let’s look at how we structured files and folders in a project.

<< SCREENSHOT OF FOLDERS >>
![Screenshot of folders](/images/terraform-folders.png)

We start with a `main.tf` file which is the entrypoint to our configuration. This file contains the meta of our infrastructure, such as which version of Terraform we’re using, and what cloud provider libraries we’re using. A provider is e.g. Amazon, GCP, or Azure. A module is a logical grouping of resources as defined by the provider. A resource is like a feature, e.g. Uptime checks is a feature within the Monitoring module.

<script src="https://gist.github.com/MTjody/4b3c67eb16425b6eb36d17b4ae91850d.js"></script>

Now let’s look into some configuration files.

main.tf
The Terraform block allows us to specify which version of TF we need. Backend is where the Terraform state is stored, it can be local or remote. We’ll get back to this later.

locals is a block of locally defined variables, in this case we define a credentials_file variable used for GCP credentials. The ‘file’-function lets us load a file and use the file contents in our config, in this case as credentials.

The provider block specifies that we’re using GCP. It requires a project id and credentials. The version specifies what version of the provider we’re using.

We’re also using a “monitoring” module, with a source path, and a variable. The ‘split’ function converts a string into a list using the provided separator. Here we used it to convert a string of comma-separated email addresses into a list.

combined.tf

I want to highlight a few powerful features of Terraform, let’s start from the top. This is not complete configuration though, a lot has been omitted for brevity. In this example, we have a hypothetical combined.tf file. All the files in the monitoring module will be combined by Terraform in the proper order when running commands. TF figures out any dependencies so that operations are performed in the required order.

In the first block, we are adding http uptime checks, and we have several microservices to check. Instead of repeating the block for each microservice, a variable paths is used here. The type is map, with objects as values for each key, plain json actually. We access the values with dot-notation e.g. each.value.name, and the resource will be created for each path provided, as indicated by the for_each keyword. We then set values such as display name and hostname.

In the next resource block, we’re adding notification channels, based on the notification recipients string I mentioned earlier. For the display name, we combine functions trimspace and split for each email, and access the first value of the result.

The third block is where Terraform really shines. We’re creating alert policies for the uptime checks from earlier, and we’ll also use the notification channels previously created. So we iterate the same paths again and reference previous resources with the ${..} syntax in the display_name prop. And then we also add the recently created notification channels for each alert. This time we use the for..in syntax, this is a way for us to extract an output value in the for-loop. the syntax is [for <ITEM> in <LIST> : <OUTPUT>].

// förklaring
When a resource has the for_each argument set, the resource itself becomes a map of instance objects rather than a single object, and attributes of instances must be specified by key, or can be accessed using a for expression.

TINKER
So how does a developer get started with this? Install the Terraform CLI and run Terraform commands in the terminal!
init - initializes and sets up the configured backend state, defaults to using a local state e.g. on the machine from which the command was run
validate - checks if you managed to write correct HCL
plan - dry-runs the configuration against your backend. the output is a ‘git-diff’ like (wall of) text showing what is to be added, changed, and deleted.
apply - creates the resources according to the plan. In the GCP case, it runs a series of POST requests and follows up and outputs the results.
destroy - optional, destroys the configured resources. Should not be used in production unless you love adrenalin :)

The workflow for a developer is basically running these commands until you have your desired infrastructure, or your demo-project has served its purpose.

COLLABORATE
For collaborating with infrastructure as code, we have the same workflow but with some modifications.
We don’t want your backend state to differ from a colleagues backend state, so it should be remote - just like source control. The backend can be setup as a remote backend in e.g. Google Cloud Storage with strict rules on access/modify and with versioning enabled. This prevents developers from creating conflicts and messing with the projects infrastructure.
The commands shouldn’t run on a developers machine, rather they should be run from a CI/CD server. In our case, we use Azure Devops as a CI/CD server and ‘gate pipelines’ are setup to run Terraform plan on each PR. The developers can see during code reviews if there are any changes to the infrastructure. A separate release pipeline is setup as well, so that the ‘apply’ command is not run without an authorized dev explicitly running the pipeline. The staging and production environments are separated as well, adding an extra layer of security.
Lastly, provider specific linting is available as well, but it’s not something we use due to lack of support for GCP.

DEMONSTRATE
