import Link from "next/link";
import React from "react";
import utilStyles from "../styles/utils.module.css";
import styles from "./layout.module.css";

const name = "@MTjody";
export const siteTitle = "@MTjody";

export default function Layout({ children, home }) {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        {home ? (
          <img
            src="/8bitprofile.svg"
            className={`${styles.headerHomeImage} ${utilStyles.borderCircle}`}
            alt={name}
          />
        ) : (
          <Link href="/">
            <a className={styles.headerImageContainer}>
              <img
                src="/8bitprofile.svg"
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
