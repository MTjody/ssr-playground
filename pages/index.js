import Head from "next/head";
import Link from "next/link";

import Layout, { siteTitle } from "../components/layout";
import utilStyles from "../styles/utils.module.css";
import { getSortedPostsData } from "../lib/posts";
import Date from "../components/date";
import Topic from "../components/topic";

// API Calls are a good example for forms.
/*async function submitForm(e) {
  console.info("form event", e);
  e.preventDefault();
  try {
    const res = await fetch("/api/crapi");
    console.info("res", res);
    const data = await res.json();
    console.info(data);
  } catch (e) {
    console.error(e);
  }
}*/

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
        <ul className={utilStyles.list}>
          {allPostsData.map(({ id, date, title, tldr, topics }) => (
            <li className={utilStyles.listItem} key={id}>
              <Link href="/posts/[id]" as={`/posts/${id}`}>
                <a>{title}</a>
              </Link>
              <br />
              <small className={utilStyles.lightText}>
                {tldr}
                <br />

                <Date dateString={date} />
                {topics.split(", ").map((topic, i) => (<Topic key={`index-${topic}-${i}`} topic={topic} />))}
              </small>
            </li>
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
