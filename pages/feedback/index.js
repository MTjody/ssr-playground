import Head from "next/head";
import { useEffect, useState } from "react";
import Layout from "../../components/layout";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, onValue, push } from "firebase/database";
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "mtjody-vercel-app.firebaseapp.com",
  projectId: "mtjody-vercel-app",
  databaseURL:
    "https://mtjody-vercel-app-default-rtdb.europe-west1.firebasedatabase.app/",
  storageBucket: "mtjody-vercel-app.appspot.com",
  messagingSenderId: "795359187531",
  appId: "1:795359187531:web:05dcc835054d6a424633ce",
};

export default function Feedback() {
  const [submitted, setSubmitted] = useState(false);
  const [db, setDb] = useState(null);
  const [feedback, setFeedback] = useState([]);

  useEffect(() => {
    const app = initializeApp(firebaseConfig);
    self.FIREBASE_APPCHECK_DEBUG_TOKEN =
      process.env.NEXT_PUBLIC_FIREBASE_APPCHECK_DEBUG_TOKEN;

    initializeAppCheck(app, {
      provider: new ReCaptchaV3Provider(process.env.NEXT_PUBLIC_RECAPTCHA_KEY),

      // Optional argument. If true, the SDK automatically refreshes App Check
      // tokens as needed.
      isTokenAutoRefreshEnabled: true,
    });

    const db = getDatabase();
    setDb(db);

    const feedbackRef = ref(db, "feedback");
    onValue(feedbackRef, (snapshot) => {
      const data = snapshot.val();
      const arr = Object.values(data).map((v) => v);
      setFeedback(arr);
    });
  }, []);

  function onKeyUp(e) {
    const codes = [e.charCode, e.keyCode, e.which];
    e.preventDefault();
    if ("Enter" === e.key || Boolean(codes.find((code) => code === 13))) {
      submit(e);
    }
  }

  function submit(e) {
    const feedbackRef = ref(db, "feedback");
    const newFeedbackRef = push(feedbackRef);
    set(newFeedbackRef, e.target.value);

    setSubmitted(true);
  }

  return (
    <Layout>
      <Head>
        <title>Feedback</title>
        <meta property="og:description" content="Submit Feedback page" />
        <meta
          property="og:image"
          content={`https://og-image.now.sh/${encodeURI(
            "Submit Feedback"
          )}.png?theme=dark&md=1&fontSize=100px&images=https%3A%2F%2Fassets.vercel.com%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fhyper-bw-logo.svg&images=https%3A%2F%2Fmtjody.now.sh%2F8bitprofile.svg&widths=250&widths=250&heights=250&heights=250`}
        />
        <meta property="og:title" content="Submit feedback" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <article>
        {submitted ? (
          <div>Thank you for your feedback!</div>
        ) : (
          <header>
            <h1>Give me some feedback, please!</h1>
            <input
              type="text"
              placeholder="Type your feedback here..."
              aria-label="Feedback"
              onKeyUp={onKeyUp}
            />
          </header>
        )}
        <div>
          {feedback?.map((val, i) => (
            <div key={val + i}>{val}</div>
          ))}
        </div>
      </article>
    </Layout>
  );
}
