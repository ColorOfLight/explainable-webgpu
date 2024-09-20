import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import Heading from "@theme/Heading";

import styles from "./index.module.css";

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header>
      <Heading as="h1" className="hero__title text-4xl">
        {siteConfig.title}
      </Heading>
    </header>
  );
}

export default function Home(): JSX.Element {
  return (
    <Layout>
      <div className="container p-8">
        <HomepageHeader />
        <ul>
          <li>
            <a href="/introduction/introduction">Introduction</a>, a brief
            explanation of the project.
          </li>
          <li>
            <a href="/content/first-scene">Content</a>, a detailed exploration
            of the project.
          </li>
        </ul>
      </div>
    </Layout>
  );
}
