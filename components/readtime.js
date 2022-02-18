import { getPostData } from "../lib/posts";

//@ts-check
const avgWordsPerMinute = 225;

export function ReadTime({ rawText }) {
  const readTime = approximateReadTime(rawText);
  return (
    <div>
      {readTime.mins}m {readTime.seconds}s read
    </div>
  );
}

function approximateReadTime(rawText) {
  let totalSeconds;
  try {
    totalSeconds = (rawText.split(" ").length / avgWordsPerMinute) * 60;
  } catch (e) {
    console.info(e);
  }

  let mins = Math.floor(totalSeconds / 60);
  let remainingSeconds = Math.floor(totalSeconds % 60);

  return { mins, seconds: remainingSeconds };
}

export const getStaticProps = async (context) => {
  console.log(context);
  getPostData();
  return {
    props: {
      rawText: "rawText",
    },
  };
};
