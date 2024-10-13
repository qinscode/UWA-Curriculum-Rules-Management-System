'use client'
import { Container } from '@/components/home/Container'
import { CIcon } from '@coreui/icons-react'
import { cibNextJs, cibReact, cibMysql, cibTypescript, cibJenkins, cibDocker } from '@coreui/icons'
import { SiJenkins, SiNestjs, SiPuppeteer, SiShadcnui } from 'react-icons/si'
import { RiTailwindCssFill } from 'react-icons/ri'
import { GrOracle } from 'react-icons/gr'
import { FaCloudflare } from 'react-icons/fa'

const tech = [
  { name: 'Next.js (Frontend)', icon: cibNextJs },
  { name: 'React.js (Frontend)', icon: cibReact },
  { name: 'NestJS (Backend)', Icon: SiNestjs },
  { name: 'Tailwind (Frontend)', Icon: RiTailwindCssFill },
  { name: 'Shadcn (Frontend)', Icon: SiShadcnui },
  { name: 'MySQL (Database)', icon: cibMysql },
  { name: 'TypeScript', icon: cibTypescript },
  { name: 'Docker (CI/CD)', icon: cibDocker },
  { name: 'Jenkins (CI/CD)', icon: cibJenkins },
  { name: 'Puppeteer (Testing)', Icon: SiPuppeteer },
  { name: 'Oracle Cloud', Icon: GrOracle },
  { name: 'Cloudflare ( Hosting)', Icon: FaCloudflare },
]

export function Tech() {
  return (
    <section id="tech-stack" aria-label="Tech Stack" className="py-20 sm:py-32">
      <Container>
        <h2 className="font-display mx-auto max-w-2xl text-center text-4xl font-medium tracking-tighter text-blue-900 sm:text-5xl">
          Our Technology Stack
        </h2>
        <div className="mx-auto mt-20 grid max-w-max grid-cols-1 place-content-center gap-x-32 gap-y-16 sm:grid-cols-2 md:gap-x-24 lg:grid-cols-4 lg:gap-x-40">
          {tech.map(({ name, icon, Icon }) => (
            <div key={name} className="flex flex-col items-center justify-center">
              {icon ? (
                <div className="h-20 w-20">
                  <CIcon icon={icon} className="h-full w-full text-blue-500" />
                </div>
              ) : Icon ? (
                <Icon size={80} className="text-black" />
              ) : null}
              <span className="mt-6 text-lg font-medium text-gray-600">{name}</span>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}
