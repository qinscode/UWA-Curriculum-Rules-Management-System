import Layout from '@/components/Layout'
import { FC } from 'react'
import Example from '@/components/header'
import Footer from '@/components/Footer'
import Split from '@/components/home/Split'
import TimeLine from '@/components/home/Timeline'
import { SecondaryFeatures } from '@/components/home/Features'
import { Faqs } from '@/components/home/Faqs'
import { Tech } from '@/components/home/Tech'

const Home: FC = () => {
  return (
    <>
      <Layout>
        <div className="space-y-8">
          <Example />
        </div>
      </Layout>
      <Split />
      <SecondaryFeatures />
      <TimeLine />
      <Tech />
      <Faqs />
      <Footer />
    </>
  )
}

export default Home
