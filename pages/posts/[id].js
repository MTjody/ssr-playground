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
        <meta
          name="description"
          content={postData.description}
        />
        <meta
          property="og:image"
          content={`https://og-image.now.sh/${
            encodeURI(postData.title)
          }.png?theme=dark&md=1&fontSize=100px&images=https%3A%2F%2Fassets.vercel.com%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fhyper-bw-logo.svg&images=https%3A%2F%2Fmtjody.now.sh%2F8bitprofile.svg&widths=250&widths=250&heights=250&heights=250`}
        />
        <meta name="og:title" content={siteTitle} />
        <meta name="twitter:card" content="summary_large_image" />
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
