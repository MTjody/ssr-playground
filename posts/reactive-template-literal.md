---
title: "Reactive Template Literals Mistake"
date: "2021-09-17"
description: "When trying to setup a reactive template literal in a React component went wrong"
tldr: "Yeah I'm not spoiling this one"
topics: "React, Javascript"
---

## Background

During an interview process, I reviewed code and tested the client only to notice a subtle bug. Stripping the component to it's basics, it looked something like this:

```JavaScript
export default function App() {
  const words = ["World", "There", "You", "My homies", "Beautiful"];
  const [greeting, setGreeting] = useState("");

  function greetRandom() {
    const index = Math.floor(Math.random() * words.length)
    return words[index];
  }

  return (
    <button onClick={() => setGreeting()}>Generate greeting</button>

    // TODO HOW TO MAKE THIS EQUAL HIS FUCKUP?

    <div>
      {`Hello ${greetRandom()}!`}
    </div>
  )
}
```


## Proposed Solution

## The Fix - Lesson learned

