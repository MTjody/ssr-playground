import styles from "./topic.module.css";

export default function Topic({ topic, onClick, selected }) {

  return (
    <span onClick={onClick} className={styles.topic} style={{backgroundColor: selected ? 'var(--color-primary)': ''}}>
      {topic}
    </span>
  );
}
