import Layout from '../components/Layout'
import WelcomeCard from '../components/home/WelcomeCard'
import FeatureGrid from '../components/home/FeatureGrid'
import { FC } from 'react'

const Home: FC = () => {
  return (
    <Layout>
      <div className="space-y-8">
        <WelcomeCard />
        <FeatureGrid />
      </div>
    </Layout>
  )
}

export default Home
