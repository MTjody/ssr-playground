//@ts-check
import React from "react";
import { useMDXComponent } from "next-contentlayer/hooks";
import { allPosts } from ".contentlayer/generated";

import Head from "next/head";
import { useRef, useEffect } from "react";
import Layout from "../../components/layout";
import Date from "../../components/date";
import utilStyles from "../../styles/utils.module.css";
import styles from "./posts.module.css";
import insertCommentSection from "../../lib/comments";

export default function Post({ post }) {
  const Component = useMDXComponent(post.body.code);

  return (
    <PostLayout {...post}>
      <Component />
    </PostLayout>
  );
}

function PostLayout({ children, title, description, date, readingTime, tldr }) {
  const sectionElem = useRef();
  console.log(readingTime);
  useEffect(() => {
    insertCommentSection(sectionElem);
  }, []);

  return (
    <Layout>
      <Head>
        <title>{title}</title>
        <meta property="og:description" content={description} />
        <meta
          property="og:image"
          content={`https://og-image.now.sh/${encodeURI(
            title
          )}.png?theme=dark&md=1&fontSize=100px&images=https%3A%2F%2Fassets.vercel.com%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fhyper-bw-logo.svg&images=https%3A%2F%2Fmtjody.now.sh%2F8bitprofile.svg&widths=250&widths=250&heights=250&heights=250`}
        />
        <meta property="og:title" content={title} />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <article>
        <header className={styles.articleHeader}>
          <h1 className={`${utilStyles.headingXl} ${styles.title}`}>{title}</h1>
          <Date dateString={date} />
          <div>{readingTime.text}</div>
        </header>
        <blockquote className={styles.tldr}>TL;DR - {tldr}</blockquote>
        {/* Post content */}
        {children}
      </article>
      <section ref={sectionElem}></section>
    </Layout>
  );
}
/*
export async function getStaticPaths() {
  const paths = allPosts.map((post) => {
    console.log(post);
    return post._id;
  });
  console.log("paths", paths);
  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const post = allPosts.find((post) => post._raw.flattenedPath === params.slug);
  console.log("post", post);
  return {
    props: {
      post,
    },
  };
}*/

export async function getStaticPaths() {
  return {
    paths: allPosts.map((blog) => ({ params: { slug: blog.slug } })),
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const post = allPosts.find((blog) => blog.slug === params.slug);
  return { props: { post } };
}
