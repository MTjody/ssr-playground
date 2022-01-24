export default function insertCommentSection(sectionElem) {
  let script = document.createElement("script");
  script.setAttribute("src", "https://utteranc.es/client.js");
  script.setAttribute("repo", "MTjody/ssr-playground");
  script.setAttribute("issue-term", "title");
  script.setAttribute("label", "blog-comment");
  script.setAttribute("theme", "dark-blue");
  script.setAttribute("crossorigin", "anonymous");
  script.setAttribute("async", "true");
  sectionElem.current.appendChild(script);
}
