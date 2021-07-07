import styles from "./topic.module.css";

export default function Topic({ topic, onClick }) {
  return (
    <span onClick={onClick} className={styles.topic}>
      {topic}
    </span>
  );
}
