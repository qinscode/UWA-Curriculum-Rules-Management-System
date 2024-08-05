import Layout from '../components/Layout'
import WelcomeCard from '../components/home/WelcomeCard'
import FeatureGrid from '../components/home/FeatureGrid'
import { FC } from 'react'
import Example from '@/components/header'
import Footer from '@/components/Footer'
import Split from '@/components/Split'
import TimeLine from '@/components/Timeline'
import CodePanel from '@/components/CodePanel'

const Home: FC = () => {
  return (
    <>
      <Layout>
        <div className="space-y-8">
          <Example />
        </div>
      </Layout>
      <Split />
      <CodePanel />

      <TimeLine />
      <Footer />
    </>
  )
}

export default Home
