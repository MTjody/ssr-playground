---
title: "Oops - what went wrong? Pt. 1"
date: "2021-01-15"
tldr: "Tips and tricks for when things go south!"
---

## Ground work

Before we can start talking about how to find what went wrong, we should start with a few habits and best practices:

### Frequent [version control](https://en.wikibooks.org/wiki/Programming_Fundamentals/Version_Control) commits

I cannot stress this enough: use a version control of your choice and whenever in your process of development you feel that you've added something, and it all works, create a commit. For example, you're developing a new feature "search box" in a dedicated feature branch. You add some markup, some styling and some JS to tie it all together. Then you realize that in order for this to work, you need to install a package. But you started importing a file-type which was not supported by your bundler, so you install a plugin. Now you get cryptic error messages so you start `cmd + z` your way through history. You think you found the issue, fix it and the issue persists. Now moving back or forth in time becomes a hassle, you don't know anymore when your code actually worked. So you grab a cup of coffee and let out a sigh, and then you realize that you have a team meeting with a planned demo of your feature in five minutes. Sounds fun? Nope. It's not. If you'd added a bunch of commits along the way, especially before adding a new package or changing config, you could easily temporarily check-out a previous commit and ace your demo.

**Pro-tip:** Give your bread-crumb commits descriptive titles such as '_wip_ search box input' 'search now working', 'search box styling added', or 'search calls back-end instead of mock'. _wip: Work In Progress_

**Pro-tip 2:** Mark not working app/environment in commit title. If you're in the habit of moving back and forward between commits, it's nice to know if something is broken in a certain commit.

![Screenshot of frequent commits](/images/what-went-wrong-frequent-commits.png)

### Limit your [scope](https://en.wikipedia.org/wiki/Scope_creep)

If you just started with implementing the above mentioned search box, there should be a clear end-goal with the feature. If you find yourself patching other unrelated code along the way, or adding a new dependency, you should ask yourself whether it really is related to the search box. Imagine not only the troubles described above, but maybe the search box needs to be reverted and the code thrown away for some reason down the line. You'd then have to manually lift out unrelated but vital parts from that feature, which is just more work than if that had been in a separate Pull Request. It also helps to keep your focus and deliver on time if you're not sidetracked all the time.

So solve one issue at a time, and divide larger tasks into smaller bits, which can be committed separately as described above.

## Tools of the trade

Now that we've got some solid ground to stand on, let's look into some useful tools when facing unresolved issues.

### Searching effectively

Let's face it, we all lookup our errors on the web using our favorite search provider hoping someone already had our looming headache. So which sources are to be checked, in which order? Here's my take:

1. First of all: [RTFM](https://en.wikipedia.org/wiki/RTFM). If your issue lies with one of your dependencies, chances are they have at least decent documentation with examples. I've found that in recent years the quality of documentation has increased greatly. If you can't find your answer in official docs, or official Q&A sections...
2. Search in [Stackoverflow](https://stackoverflow.com/) or Github/other VCS related issues list. 99% of the errors I've been able to solve have been with the help of searching these forums. Just make sure to check the following: are the users having the **same error, with a similar setup**? i.e. is it related to your issue? Otherwise you might spend hours yanking up the wrong tree, and that's seldom fun.

![Screenshot of suggested solution - jackpot](/images/what-went-wrong-jackpot.png)

### Divide and Conquer

Consider a scenario where nothing seems to be working anymore, e.g. your web app does not render anymore. Instead of debugging and printing a bunch of logs you could try to narrow down the issue by removing your code incrementally. Start by removing the latest bits of code that you added, e.g. parts of your new component. Does it work now? No? Keep removing from witihin your component, and up the DOM hierarchy until the app renders. Now, start adding small increments of your code again, to see if you can figure out exactly what the issue is.

If you've done this and can't figure out what's wrong, you might be tempted to ask colleagues or the community. In this scenario, you'd help other help you by creating a shareable sandbox of your issue. How much or how little code can you have to recreate the issue? When you've got the error environment all setup, there are multiple environments you can use for demonstrating your minimal faulty application, such as [Code Sandbox](https://codesandbox.io/s) or [JSFiddle](https://jsfiddle.net/).

## When all else fails

You've tried all the above, and there is no light at the end of the tunnel. You start by questioning why you even bothered to become a developer in the first place, and then wondering if you wouldn't be doing everybody a favor if you moved to a cottage in the woods alone. Well, don't give up just yet! Flip the steak, can you try other tactics? Step outside your comfort zone and ask yourself: _Is there another equal solution? Is there a way we could solve this by thinking outside the box?_ Ask a colleague, mentor or try explaining your situation to somebody outside programming. They often have completely different views of the world and it just might be what you need.

Wrapping up this first part now, here's a look into what's upcoming.
