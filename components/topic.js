import styles from "./topic.module.css";

export default function Topic({topic}) {
  return (
    <span className={styles.topic}>{topic}</span>
  );
}
