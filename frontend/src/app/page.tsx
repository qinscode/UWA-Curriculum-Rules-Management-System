import Layout from '../components/Layout'
import WelcomeCard from '../components/home/WelcomeCard'
import FeatureGrid from '../components/home/FeatureGrid'

export default function Home(): JSX.Element {
  return (
    <Layout>
      <div className="space-y-8">
        <WelcomeCard />
        <FeatureGrid />
      </div>
    </Layout>
  )
}
