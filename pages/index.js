import Head from "next/head";
import Link from "next/link";

import Layout, { siteTitle } from "../components/layout";
import styles from "./index.module.css";
import utilStyles from "../styles/utils.module.css";
import { getSortedPostsData } from "../lib/posts";
import Date from "../components/date";
import Topics from "../components/topics";

export default function Home({ allPostsData }) {
  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section className={utilStyles.headingSm}>
        <blockquote className={utilStyles.presentation}>
          Software Developer occasionally writing about... software development
          stuff!
        </blockquote>
      </section>
      <section className={utilStyles.padding1px}>
        <h2 className={utilStyles.headingLg}>Blog Posts</h2>
        <ul className={`${styles.blogPosts} ${utilStyles.list}`}>
          {allPostsData.map(({ id, date, title, description, topics }) => (
            <Link key={id} href="/posts/[id]" as={`/posts/${id}`}>
              <li className={`${styles.blogPost} ${utilStyles.listItem}`} >
                  <a className={styles.title}>{title}</a>
                <small className={styles.description}>
                  {description}
                </small>
                <small className={styles.date}>
                  <Date dateString={date} />  
                </small>
                <div className={styles.topics}>
                  <Topics topics={topics}/>
                </div>
              </li>
            </Link>

          ))}
        </ul>
      </section>
    </Layout>
  );
}

/*
  Runs only on the server-side. It will never be run on the client-side. 
  It won’t even be included in the JS bundle for the browser.
  Runs at build time in prod!
 */
export async function getStaticProps() {
  const allPostsData = getSortedPostsData();
  return {
    props: {
      allPostsData,
    },
  };
}
