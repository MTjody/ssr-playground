---
title: "The art of over-engineering"
date: "2021-02-21"
description: "A story about needlessly complicating things and missing the most obvious solution."
tldr: "Try the easiest things you can think of before looking to complicated solutions"
topics: "Problem solving, FaaS, Terraform, GCP"
---

## Bored beyond saving

Be me. Pandemic is raging and WFH has been my life since a year. Social interactions and training have completely come to a halt. Add to this a wife trying to put our toddler to sleep each night for hours, so no social interactions after work either. **Bored out of my mind** is to put it lightly. So I start to look for things to do. My issue with programming on my spare time has always been that I've been busy doing other stuff. But lately, my life has changed and programming has been a nice refuge when I'm bored. I stumbled upon some links, and finally a [list of open web APIs](https://mixedanalytics.com/blog/list-actually-free-open-no-auth-needed-apis/) one can use for own projects.

Lo and behold, an API for when you're bored is in that list. I [look at the documentation](https://www.boredapi.com/documentation) and start building a web application. My reasoning was that in building an application I'm curing myself from boredom, and might be able to save my fellow human beings once it's been launched. How awesome. I recently started working with [Svelte](https://svelte.dev/) at a work project and it's freaking awesome. Since the application itself just had to do some AJAX call and show the results, I didn't really need a framework at all, but the ease of getting started with Svelte and the resulting VanillaJS bundle made it a nice candidate for the app. If I were to build upon the app I'd easily be able to scale it up.

## Getting started

So I set Svelte up and boom, a web app is up and running. I add some code for the API call and present it in the UI, some bells and whistles and it's done. It's all in one component, but I'll chop it up for you for formatting reasons. Notice that the API call is wrapped in a promise, this was done to give the text animation proper time, and reduce jumpiness for the end-user. The API result will show in one second (or longer if the API misbehaves).

```JavaScript
async function getActivity() {
  // Wrap the ajax call in a promise to enforce one second loading
  const prom = new Promise(async (resolve, reject) => {
    let json;
    try {
      const res = await fetch(
        // Get a random activity
        "http://www.boredapi.com/api/activity/"
      );
      json = await res.json();
    } catch (error) {
      reject(error);
    }
    setTimeout(() => {
      resolve(json);
    }, 1000);
  });
  const res = await prom;

  const text = res["activity"];
  if (res) {
    return text;
  } else {
    throw new Error(text);
  }
}

getActivity();
```

Now for the markup. Notice how Svelte allows you to declare what is rendered in squiggly-brace blocks. We declare the loading state, await the value of the promise and handle errors all in a related block of code.

```HTML
<main>
  <h1>Bored today?</h1>
  <p>Fear not! I have a suggestion!</p>

  {#await promise}
    <!-- This shows during loading, at least one second -->
    <p class="typing text">Give me a second here...</p>
  {:then activity}
    <!-- When the promise is resoled -->
    <p class="text">{activity}</p>
  {:catch error}
    <!-- When the promise is rejected -->
    <p>Gosh dangit! {error}</p>
  {/await}
</main>

<style>
<!-- Omitted -->
</style>
```

## Release issues

Nice, now all I need is a server to host the static files for the wep application. [Github Pages](https://pages.github.com/) is a nice zero-effort candidate for that. Using [push-dir](https://www.npmjs.com/package/push-dir) I setup a deploy script which takes the files in the public folder and pushes it to a `gh-pages`-branch which Gihub Actons uses as a default branch from which the static web app is served. It's now visible at [mtjody.github.io/no-longer-bored/](https://mtjody.github.io/no-longer-bored/). But wait, gosh dang it! something went wrong.

![Error message, mixed content](/images/over-engineer-error.png)

What does this mean? Simply put, the web application is served over HTTPS, and it's blocked from doing unsecure HTTP API calls. The end-user should be certain that their entire session with a HTTPS web app is secure.

So this got me thinking. My initial thought was that one way of solving these types of issues is to setup a proxy server which I'm in control of, and it can make the unsecure API request for me instead. Next, I thought of some awesome [functions as a service](https://vimeo.com/189519556) resources I'd been watching in the previous weeks, and decided that it's the way to go. Since I already have experience with [GCP and Terraform](http://localhost:3000/posts/terraform-intro) I'd be up and running in no time. I just needed a function, and some Terraform configuration.

## Solution

In the Terraform configuration, notice the resources needed to get going. The bucket will contain the zip file, which contains the function itself. Next, some details about the function itself, and the IAM bindings needed for permissions to invoke the function. Note the name property of the archive resource, it is a solution for re-deploying your function on changes. If the contents were not hashed and added to the name, there would be no way for Terraform to know that the function needed to re-deploy.

```bash
resource "google_storage_bucket" "bucket" {
  name = var.bucket_name
}

data "archive_file" "http_trigger" {
  type        = "zip"
  output_path = format("%s/%s", path.root, var.bucket_archive_filepath)
  source {
    content  = file("./functions/bored-proxy/index.js")
    filename = "index.js"
  }
}

resource "google_storage_bucket_object" "archive" {
  name                = format("%s#%s", var.bucket_archive_filepath, data.archive_file.http_trigger.output_md5)
  bucket              = google_storage_bucket.bucket.name
  source              = data.archive_file.http_trigger.output_path
  content_disposition = "attachment"
  content_encoding    = "gzip"
  content_type        = "application/zip"
}

resource "google_cloudfunctions_function" "function" {
  name        = "bored-api-proxy"
  description = "A proxy function for GET requests to the Bored Api"
  runtime     = "nodejs14"

  available_memory_mb   = 128
  source_archive_bucket = google_storage_bucket.bucket.name
  source_archive_object = google_storage_bucket_object.archive.name
  trigger_http          = true
  entry_point           = "boredProxy"

  service_account_email = var.bored_service_account

  project = var.project_id
  region  = var.region
}

# IAM entry for all users to invoke the function
# https://stackoverflow.com/a/62525239/7469853
resource "google_cloudfunctions_function_iam_binding" "binding" {
  project        = google_cloudfunctions_function.function.project
  region         = google_cloudfunctions_function.function.region
  cloud_function = google_cloudfunctions_function.function.name

  role = "roles/cloudfunctions.invoker"
  members = [
    "allUsers",
  ]
}
```

The function itself was pretty simple, all it had to do was call the API for me and return the result. When implementing this, I made sure not to depend on any packages so that the function would be as simple as possible to reduce startup latency.

```JavaScript
const http = require("http");

exports.boredProxy = (req, res) => {
  // Set CORS headers
  res.set("Access-Control-Allow-Origin", "https://mtjody.github.io");
  switch (req.method) {
    case "OPTIONS": {
      // Omitted..
    }
    case "GET": {
      // The http module streams the result in chunks in a callback
      http.get("http://www.boredapi.com/api/activity/", (response) => {
        let chunks = "";
        // called when a data chunk is received.
        response.on("data", (chunk) => {
          chunks += chunk;
        });
        // called when the complete response is received.
        response.on("end", () => {
          res.json(JSON.parse(chunks));
        });
      })
      .on("error", (error) => {
        res.status(500).send("Error", error);
        console.error("Error: " + error.message);
      });
      break;
    }
    default:
      res.status(403).send("Forbidden!");
      break;
  }
};
```

I released this bad boy, and the app was up and running. Nice, right? Not really - A couple of days later I talked to a friend about the application and told him about the setup, and showed some of the documentation for the Bored API, for ideas on how to add functionality in the future. What do I see? The documentation showed the URL as `https://www.boredapi.com/api/activity/`. **HTTPS!!!** It was there all along. We had a good laugh and I went on with my life. Covid still reigns supreme though.

## Takeaways

There are some valuable lessons to be learned here:

1. The most simple and obvious solution for your current problem is probably right in front of you. Sometimes the spontaneous idea that leverages the cool new tech you recently learnt might be overkill.
2. Talking to somebody and walking them through your issue could help yourself realise other ways of attacking the problem. This is what is known as [rubber ducking](https://www.urbandictionary.com/define.php?term=Rubber%20ducking) and it's very valuable. The great thing about rubber-ducking is that you don't have to talk to a colleague, it could be a family-member or a friend. The important part is that you get to explain your problem and sometimes the answer could come to you. If it indeed were a colleague, they might have known about the easier solution as well.
