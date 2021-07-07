import Topic from "./topic";

export default function Topics({ topics, filter }) {
  return topics
    .split(", ")
    .sort((a, b) => b.length - a.length)
    .map((topic, i) => (
      <Topic
        onClick={() => {
          console.log("topx", topic);
          filter(topic);
        }}
        key={`post-${topic}-${i}`}
        topic={topic}
      />
    ));
}
