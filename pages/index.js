import Head from "next/head";
import Link from "next/link";

import Layout, { siteTitle } from "../components/layout";
import styles from "./index.module.css";
import utilStyles from "../styles/utils.module.css";
import { getSortedPostsData } from "../lib/posts";
import Date from "../components/date";
import Topics from "../components/topics";
import { useState } from "react";

export default function Home({ allPosts }) {
  const [filtered, setFiltered] = useState([]);

  function filterCallback(arg) {
    if (arg) {
      setFiltered(
        allPosts.filter(post => post.topics.includes(arg))
      );
    } else {
      setFiltered([])
    }
  }


  function postMapper({ id, date, title, description, topics }) {
    return (
      <li
        key={id}
        className={`${styles.blogPost} ${utilStyles.listItem}`}
      >
        <Link href="/posts/[id]" as={`/posts/${id}`}>
          <a className={styles.title}>{title}</a>
        </Link>

        <small className={styles.description}>{description}</small>
        <small className={styles.date}>
          <Date dateString={date} />
        </small>
        <div className={styles.topics}>
          <Topics topics={topics} filter={filterCallback} />
        </div>
      </li>
    );
  }

  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
        <meta property="og:description" content="Software Dev blog - Home" />
        <meta
          property="og:image"
          content={
            "https://og-image.now.sh/.png?theme=dark&md=1&fontSize=25px&images=https%3A%2F%2Fassets.vercel.com%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fhyper-bw-logo.svg&images=https%3A%2F%2Fmtjody.now.sh%2F8bitprofile.svg&widths=350&widths=350&heights=350&heights=350"
          }
        />
        <meta property="og:title" content={siteTitle} />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <section className={utilStyles.headingSm}>
        <blockquote className={utilStyles.presentation}>
          Hi! 👋 I'm a software developer in Sweden writing about whatever comes
          to mind. Give my blog a read will you?
        </blockquote>
      </section>
      <section className={utilStyles.padding1px}>
        <h2 className={utilStyles.headingLg}>Blog Posts</h2>

        <ul className={`${styles.blogPosts} ${utilStyles.list}`}>
          {filtered.length === 0 ? 
            allPosts.map(postMapper) : 
            filtered.map(postMapper)
          }
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
  const allPosts = getSortedPostsData();
  return {
    props: {
      allPosts,
    },
  };
}
