---
title: "Reactive Template Literals Mistake"
date: "2021-09-17"
description: "When trying to setup a reactive template literal in a React component went wrong"
tldr: "Yeah I'm not spoiling this one"
topics: "React, Javascript, Front-end"
---

## Background

At my current employer, we developers conduct technical interviews. The goals of these interviews are mainly to get to know the candidate on a personal and technical level. As a part of the evaluation, we ask the candidates to solve a basic problem using their web technology of choice. On submission, we review their code and test their client locally, and during the interview we ask them to take us through the solution. We've found that most candidates tend to explain their solution and line of thought with great enthusiasm and pride. 


During a recent interview process, I reviewed code and tested the client only to notice a subtle bug. Stripping the component to it's basics, it looked something like this:

```JavaScript
import { useState } from "react";

export default function App() {
  const words = ["World", "There", "You", "My homies", "Beautiful"];

  function greetRandom() {
    const index = Math.floor(Math.random() * words.length)
    return words[index];
  }

  return (
    <Greeter greeting={`Hello ${greetRandom()}!`} />
  )
}
// Third party component - implementation irrelevant
function Greeter({greeting}) {
  const [showGreeting, setShowGreeting] = useState(false);

  return (
    <>
      <button onClick={() => setShowGreeting(!showGreeting)}>Greet random</button>
      <p>{showGreeting && greeting}</p>
    </>
  );
}
```

## Analysis

Their intent was to show and hide a random greeting phrase on each click of the button. To do this, they passed a template literal to the `Greeter` component, with a function call within the string. The idea was that each time the message appears on the screen, a new ending to the 'Hello..' statement would be printed. But this was not the case, and when asked, they couldn't solve the bug. So they quickly called it a feature, we laughed and went on with the interview.

Before we went on however, us interviewers quickly thought of a solution. How did we solve it?

## Proposed Solution

The problem is that a template literal using a function call to get it's value will only be evaluated once unless we use a mechanism to force an update. This results in the same string being printed over and over again each time the message is shown.

We can use the [`useState` hook](https://reactjs.org/docs/hooks-state.html) to set a variable which is included in the template literal instead. This way, React will trigger a re-render on each state change, which in turn updates the template literal. 

Given that the `<Greeter />`-component was a third party component and we were not able to change it's API, we could wrap it in a `<div>` with a click listener which updates the greeting string. If we had control over the `<Greeter />`-component, an alternative solution would be to expose the `onClick`-method as a property of the `<Greeter />`-component. This way a parent wouldn't have to wrap the component in another HTML element on order to register a click listener.

```JavaScript
export default function App() {
  const words = ["World", "There", "You", "My homies", "Beautiful"];
  const [greeting, setGreeting] = useState(words[0]);

  function greetRandom() {
    const index = Math.floor(Math.random() * words.length)
    return words[index];
  }

  return (
    <div onClick={() => setGreeting(greetRandom())}>
      <Greeter greeting={`Hello ${greeting}!`} />
    </div>
  )
}

// Greeter unchanged, omitted
```

Unfortunately, social skills will only get you so far. This was just one of many flaws in their technical interview. We ended up parting ways, and provided them with some material they could use to improve their skills. They'd applied for a medior / senior role, but couldn't explain what happened inside the template literal, partly because they didn't know what a template literal was - despite using one in their code submission. 
