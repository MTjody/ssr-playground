import { useState } from "react";
import Topic from "./topic";

export default function Topics({ topics, filter }) {

  const [selected, setSelected] = useState("");

  function handleClick(topic) {
    if (selected === topic) {
      setSelected("");
      filter("");
    } else {
      setSelected(topic);
      filter(topic);
    }
  }

  return topics
    .split(", ")
    .sort((a, b) => b.length - a.length)
    .map((topic, i) => (
      <Topic
        onClick={() => handleClick(topic)}
        key={`post-${topic}-${i}`}
        topic={topic}
        selected={selected === topic}
      />
    ));
}
