---
title: "Navigating an assignment"
date: "2020-12-01"
tldr: "Identify stakeholders and requirements; ask a lot of questions!"
topics: "project management"
---

Taking on a new assignment can be a daunting task. There is the social aspect of it, the technical, and the unknown - spooky! Hopefully this post will help prepare for the next time you start anew. Some points are from personal experience, some from discussions with colleagues, and some where I've observed more experienced colleagues.

## Before starting

Take the time needed to **read up on the assignment**, every detail communicated, and expectations expressed. When you're done, do it again the next day. It really enables you to hit the ground running. Write any questions that you might have, and ask the following as well: _what is the vision for the project/assignment? 3 years from now? 5 years from now?_ This should help you make informed decisions that can scale with the assignment.

If there is an existing setup, **try out the application**/project/domain to get a feel for it, and try to understand the positives and the limitations.

![Research the assignment](/images/new-project-before-starting.svg)

Feeling sneaky? You can win the hearts of your colleagues / stakeholders by making background checks on co-workers. If you can, identify the key stakeholders. E.g. check out their personal profile in the company portal, or see if you can find their LinkedIn. This might give you a feeling of familiarity and can help in **building a great relationship** from the start.

## First meeting

These meetings are usually a _Meet and Greet_ where you get to present yourselves and get to know the others. Were your background checks correct with regards to your stakeholders? If not, update them for your reference.

When appropriate, **ask your prepared questions** to get a clearer view of what's expected, make sure to document the answers for yourself. Find out what the next steps are, and get your accounts and accesses setup. Now get to working!

## Managing stakeholders and prioritizing

When identifying stakeholders, ask yourself: _Who is giving you the assignment?_ This should be your primary stakeholder. There might be others involved, especially if the client is a huge company. You should know before-hand that there might be **workplace politics** involved. Maybe you need to do a bit of politics, where people-skills are a huge benefit. Otherwise a good solution is getting all the stakeholders in the same forum will result in you getting to rest while the others duke it out.

If you feel uncomfortable doing this, or you feel like it's not your job, maybe the _Product Owner_ & _Scrum Master_ can help. Scrum is among other things designed to lift the weight of prioritizing off the developers shoulders. The sprints will specify what the devs deliver, and the only way to get to the devs and the backlog is via the PO / Scrum Master.

## Preparations for coming meeting(s)

### Abstractions to scenarios

In order to keep the ball rolling, you need to **break down** the abstractions and fancy project description **into real scenarios**. This can help in identifying the needs which you're about to cater to.

![Abstractions to scenarios](/images/new-project-abstract-to-scenario.svg)

You can create [user-stories](https://en.wikipedia.org/wiki/User_story) and convert these stories into diagrams. The different actors and (moving) parts of the system should be clear. Consider these points at this stage:

- Identify clear distinguished responsibilities of the services involved. How are these services connected? Are there any contracts/APIs etc? E.g. _"Our app has an admin portal. Users can upload images and communicate with each other."_ There should be a clear distinction between these two features.
- Which assumptions can be made at this point? E.g. _"Given that users communication is a core feature, we can assume that a chat should be a high priority?"_ Make sure to validate your assumptions with the stakeholders.

### Possible future scenarios

Earlier, I mentioned asking for a three- to five-year plan. Usually, the client has a vision in mind for their project. Was there a communicated vision for this project? If so, how does your model scale with this in mind?

Also, based on the created models, will the assignment **naturally evolve** into something foreseeable? E.g. if you're building a way for users to communicate, and your assumption of the chat was correct, you could foresee the features which will be requested in order to make the app feel like a fully-fledged chat application. The expectations on a chat application today are huge considering the giants of today in Slack and Teams. Will your models scale with the expected feature-set in mind as well?
