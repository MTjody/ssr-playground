// @ts-check
import Head from "next/head";
import Link from "next/link";

import fs from "fs";
import path from "path";
// import matter from "gray-matter";

import Layout, { siteTitle } from "../components/layout";
import styles from "./index.module.css";
import utilStyles from "../styles/utils.module.css";
// import { getSortedPostsData } from "../lib/posts";
import Date from "../components/date";
import Topics from "../components/topics";
import { useState } from "react";

export default function Home({ posts }) {
  const [filtered, setFiltered] = useState([]);
  function filterCallback(arg) {
    if (arg) {
      setFiltered(posts.filter((post) => post.topics.includes(arg)));
    } else {
      setFiltered([]);
    }
  }

  function postMapper({ id, date, title, description, topics }) {
    console.log("postmapper", id, date, title, description, topics);
    return (
      <li key={id} className={`${styles.blogPost} ${utilStyles.listItem}`}>
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
          Software development lessons learned the hard way, so that you don't
          have to!
        </blockquote>
      </section>
      <section className={utilStyles.padding1px}>
        <h2 className={utilStyles.headingLg}>Blog Posts</h2>

        <ul className={`${styles.blogPosts} ${utilStyles.list}`}>
          {filtered.length === 0
            ? posts.map(postMapper)
            : filtered.map(postMapper)}
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
export const getStaticProps = async () => {
  // fetch posts
  const postDirectory = path.join(process.cwd(), "pages");

  const postFilenames = fs.readdirSync(postDirectory);
  console.log("post filenames", postFilenames);
  // postFilenames.map((p) => console.log(`pages/posts/${p}`));
  const postModules = await Promise.all(
    postFilenames
      .filter((n) => n.endsWith(".mdx"))
      .map(async (p) => {
        const filepath = `./${p}`;
        console.log("filepath", filepath);
        return import(filepath);
      })
  );
  console.log(postModules);
  // const postMetadata = postModules.map((m) => m.metadata);
  // return props
  return {
    props: {
      // posts: postMetadata,
      posts: [],
    },
  };
};
// export function getStaticProps() {
//   const postsDirectory = path.join(process.cwd(), "pages", "posts");

//   const fileNames = fs.readdirSync(postsDirectory);

//   console.log("filenames", fileNames);
//   const allPostsData = fileNames.map(async (fileName) => {
//     // console.log("filename", fileName);
//     // Remove ".md" from file name to get id
//     const id = fileName.replace(/\.mdx$/, "");
//     // console.log("id", id);

//     // const mod = await import(`./${fileName}`);
//     const mod = require(`./${fileName}`);
//     console.log("import mod", `./${fileName}`, mod);
//     // console.log(mod.metadata);
//     // const postModules = await Promise.all(
//     //   fileNames.map(async (p) => import(`./${p}`))
//     // );
//     // console.log("postmodules", postModules);

//     // const postMetadata = postModules.map((m) =>
//     //   m.metadata ? m.metadata : null
//     // );

//     // console.log("dynamic import of: ", postMetadata);

//     // Combine the data with the id
//     return {
//       id,
//       // ...matterResult.data,
//     };
//   });

//   // const posts = allPostsData.sort(
//   //   (a, b) => Number(new Date(b.date)) - Number(new Date(a.date))
//   // );

//   return { props: { posts: [] } };
// }
