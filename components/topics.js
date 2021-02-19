import Topic from "./topic";

export default function Topics({topics}) {
  return (
    topics
      .split(", ")
      .sort((a, b) => b.length - a.length)
      .map((topic, i) => (<Topic key={`post-${topic}-${i}`} topic={topic} />))
  );
}
