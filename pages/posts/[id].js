import Head from "next/head";

import Layout from "../../components/layout";
import { getAllPostIds, getPostData } from "../../lib/posts";
import Date from "../../components/date";
import ReadTime from "../../components/readtime";
import utilStyles from "../../styles/utils.module.css";
import styles from "./posts.module.css"

export default function Post({ postData }) {
  return (
    <Layout>
      <Head>
        <title>{postData.title}</title>
      </Head>
      <article>
        <header className={styles.articleHeader}>
          <h1 className={`${utilStyles.headingXl} ${styles.title}`}>{postData.title}</h1>
          <Date dateString={postData.date} />
          <ReadTime rawText={postData.content} />
        </header>
        <blockquote className={styles.tldr}>TL;DR - {postData.tldr}</blockquote>
        <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
      </article>
    </Layout>
  );
}

export async function getStaticPaths() {
  const paths = getAllPostIds();
  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const postData = await getPostData(params.id);
  return {
    props: {
      postData,
    },
  };
}
