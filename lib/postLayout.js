import Head from "next/head";
import { useRef, useEffect } from "react";
import Layout from "../components/layout";
import Date from "../components/date";
import ReadTime from "../components/readtime";
import utilStyles from "../styles/utils.module.css";
import styles from "./posts.module.css";
import insertCommentSection from "./comments";

export default function Post({ metadata, children }) {
  const sectionElem = useRef();

  useEffect(() => {
    insertCommentSection(sectionElem);
  }, []);

  return (
    <Layout>
      <Head>
        <title>{metadata.title}</title>
        <meta property="og:description" content={metadata.description} />
        <meta
          property="og:image"
          content={`https://og-image.now.sh/${encodeURI(
            metadata.title
          )}.png?theme=dark&md=1&fontSize=100px&images=https%3A%2F%2Fassets.vercel.com%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fhyper-bw-logo.svg&images=https%3A%2F%2Fmtjody.now.sh%2F8bitprofile.svg&widths=250&widths=250&heights=250&heights=250`}
        />
        <meta property="og:title" content={metadata.title} />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <article>
        <header className={styles.articleHeader}>
          <h1 className={`${utilStyles.headingXl} ${styles.title}`}>
            {metadata.title}
          </h1>
          <Date dateString={metadata.date} />
          {/* <ReadTime rawText={metadata.content} /> */}
        </header>
        <blockquote className={styles.tldr}>TL;DR - {metadata.tldr}</blockquote>
        {children}
        {/* <div dangerouslySetInnerHTML={{ __html: metadata.contentHtml }} /> */}
      </article>
      <section ref={sectionElem}></section>
    </Layout>
  );
}

// export async function getStaticPaths() {
//   console.log("postlayout: get static paths");
//   const paths = getAllPostIds();
//   console.log("postlayout: get static paths", paths);
//   return {
//     paths,
//     fallback: false,
//   };
// }

// export async function getStaticProps({ params }) {
//   console.log("postlayout: get static props - params", params);

//   const postData = await getPostData(params.id);
//   console.log("postlayout: get static props - postData", postData);
//   return {
//     props: {
//       metadata: postData,
//     },
//   };
// }
