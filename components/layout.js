import styles from "./layout.module.css";
import utilStyles from "../styles/utils.module.css";
import Link from "next/link";
import React from "react";

const name = "@MTJody";
export const siteTitle = "@MTJody";

export default function Layout({ children, home }) {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        {home ? (
          <img
            src="/images/profile.jpg"
            className={`${styles.headerHomeImage} ${utilStyles.borderCircle}`}
            alt={name}
          />
        ) : (
          <Link href="/">
            <a className={styles.headerImageContainer}>
              <img
                src="/images/profile.jpg"
                className={`${styles.headerImage} ${utilStyles.borderCircle}`}
                alt={name}
              />
            </a>
          </Link>
        )}
      </header>
      <div className={styles.contentContainer}>
        <main className={styles.contentBackground}>{children}</main>
        {!home && (
          <div className={styles.backToHome}>
            <Link href="/">
              <a>← Back to home</a>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
