export default [
  {
    id: "art-of-over-engineering",
    title: "The art of over-engineering",
    date: "2021-02-21",
    description:
      "A story about needlessly complicating things and missing the most obvious solution.",
    tldr: "Try the easiest things you can think of before looking to complicated solutions",
    topics: "Problem solving, FaaS, Terraform, GCP",
  },
  {
    id: "automated-testing-nestjs",
    title: "Automated Testing with NestJS",
    date: "2020-06-26",
    description:
      "Hands-on look into structuring your tests and mocking dependencies.",
    tldr: "Use abstraction layers in your code, mock your dependencies.",
    topics: "Testing, NestJS, Jest",
  },
  {
    id: "commandments-of-leadership",
    title: "Eight commandments of great leadership",
    date: "2021-04-06",
    description:
      "Introspection of what I'd like to see from a leader, and what I strive to accomplish as a leader.",
    tldr: "Lead by example, be passionate and understanding, set goals and trust your colleagues!",
    topics: "Leadership, Interpersonal skills",
  },
  {
    id: "e2e-playwright",
    title: "E2E w/ Playwright - getting started",
    date: "2022-02-14",
    description:
      "Key takeaways from my latest E2E test suite setup using Playwright - part 1",
    tldr: "Setting up Playwright and writing initial tests were straightforward, except for some problems along the way",
    topics: "Testing, Playwright",
  },
  {
    id: "github-actions-p2",
    title: "Github Actions - Parallelised builds with caching",
    date: "2021-06-28",
    description:
      "Leveraging parallelisation and caching for faster Github Actions Workflows",
    tldr: "Define several jobs in a workflow, and use the cache action",
    topics: "Github Actions, CI/CD",
  },
  {
    id: "github-actions-p3",
    title: "Github Actions - Reviewing Deployments",
    date: "2021-08-31",
    description: "Add reviewers for your critical Github Actions Deployments",
    tldr: "Refer to protected environments in your workflow to add deployment guards",
    topics: "Github Actions, CI/CD",
  },
  {
    id: "github-actions",
    title: "Github Actions - Developing Workflows before merge",
    date: "2021-05-20",
    description:
      "How to test your GH Actions Workflows before merging to your main branch.",
    tldr: "Commit a dummy workflow to main, develop and trigger manually from another branch",
    topics: "Github Actions, CI/CD, Quick-Tips",
  },
  {
    id: "introduction-to-terraform",
    title: "Introduction to Terraform",
    date: "2020-09-23",
    description:
      "Get started with Terraform by setting up monitoring with uptime checks, alert policies and more in GCP.",
    tldr: "Terraform describes your infrastructure as code.",
    topics: "IaC, Terraform, GCP, Monitoring",
  },
  {
    id: "mui-unit-tests-p1",
    title: "Material UI unit tests - getting started",
    date: "2021-10-13",
    description:
      "Let's explore writing unit tests for the front-end using MUI, React and Testing Library",
    tldr: "Testing-library is a great tool for component-based UI tests!",
    topics: "Testing, Jest, React",
  },
  {
    id: "mui-unit-tests-p2",
    title: "Material UI unit tests - hands on",
    date: "2022-02-08",
    description:
      "No more fluff, let's write unit tests for the front-end using MUI, React and Testing Library",
    tldr: "Scenarios -> Setup -> Interact -> Verify",
    topics: "Testing, Jest, React",
  },
  {
    id: "navigating-an-assignment",
    title: "Navigating an assignment",
    date: "2020-12-01",
    description:
      "Brief guide to starting an assignment and coming out on top, based on observations and own experiences.",
    tldr: "Identify stakeholders and requirements; ask questions!",
    topics: "Project management, Interpersonal skills",
  },
  {
    id: "oops-what-went-wrong",
    title: "Oops - what went wrong?",
    date: "2021-01-15",
    description:
      "Give yourself a head-start in the battle against errors, and what to do when things go south!",
    tldr: "Break down your issue, find the root cause.",
    topics: "Tooling, Debugging, Git",
  },
  {
    id: "passwords-schmasswords",
    title: "Passwords schmasswords",
    date: "2020-05-05",
    description:
      "How to setup a password manager for multiple devices and accounts.",
    tldr: "Use a password manager!",
    topics: "Security, Password Manager, KeePass",
  },
  {
    id: "reactive-template-literal",
    title: "Reactive Template Literals Mistake",
    date: "2021-09-17",
    description:
      "When trying to setup a reactive template literal in a React component went wrong",
    tldr: "Yeah I'm not spoiling this one",
    topics: "React, Javascript, Front-end",
  },
  {
    id: "tree-shaking-ts",
    title: "Class Accessors in TS break tree-shaking!",
    date: "2021-03-15",
    description:
      "TypeScript compiles your code to JS, but do you know what that code looks like, and what implications it might have?",
    tldr: "Accessor properties in TS result in Object.defineProperty, which bundlers deem too side-effectful to tree-shake.",
    topics: "Tree-shaking, TypeScript, Yak-shaving",
  },
];
