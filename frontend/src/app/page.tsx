// app/page.tsx
import Layout from '../components/Layout';

export default function Home() {
  return (
    <Layout>
      <h2 className="text-2xl font-bold mb-4">Welcome to the Course Rules Management System (Demo)</h2>
      <p className="text-lg">
        This centralized platform allows you to manage and update course rules efficiently. Use the navigation menu
        to access different features.
      </p>
    </Layout>
  );
}