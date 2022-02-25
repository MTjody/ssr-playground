// @ts-check
import { defineDocumentType, makeSource } from "contentlayer/source-files";
import readingTime from "reading-time";
import { remarkCodeHike } from "@code-hike/mdx";
// lol hack. Better way to load JSON?
import { theme } from "./styles/theme";

export const Post = defineDocumentType(() => ({
  name: "Post",
  filePathPattern: "*.mdx",
  contentType: "mdx",
  bodyType: "mdx",
  fields: {
    title: { type: "string", required: true },
    date: { type: "string", required: true },
    description: { type: "string", required: true },
    tldr: { type: "string", required: true },
    topics: { type: "string", required: true },
  },
  computedFields: {
    readingTime: { type: "json", resolve: (doc) => readingTime(doc.body.raw) },
    slug: {
      type: "string",
      resolve: (doc) => doc._raw.sourceFileName.replace(/\.mdx/, ""),
    },
  },
}));

export default makeSource({
  contentDirPath: "posts",
  documentTypes: [Post],
  mdx: {
    remarkPlugins: [[remarkCodeHike, { theme }]],
    rehypePlugins: [],
  },
});
