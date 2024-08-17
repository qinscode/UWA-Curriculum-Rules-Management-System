import Layout from '@/components/Layout'
import { FC } from 'react'
import Example from '@/components/header'
import Footer from '@/components/Footer'
import Split from '@/components/home/Split'
import TimeLine from '@/components/home/Timeline'

const Home: FC = () => {
  return (
    <>
      <Layout>
        <div className="space-y-8">
          <Example />
        </div>
      </Layout>
      <Split />
      <TimeLine />
      <Footer />
    </>
  )
}

export default Home
