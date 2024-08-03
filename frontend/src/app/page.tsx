import Layout from '../components/Layout';
import { WelcomeCard } from '../components/home/WelcomeCard';
import { FeatureGrid } from '../components/home/FeatureGrid';

export default function Home() {
  return (
    <Layout>
      <WelcomeCard />
      <FeatureGrid />
    </Layout>
  );
}