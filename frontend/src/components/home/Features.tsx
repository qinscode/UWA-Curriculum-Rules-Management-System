import React from 'react'

import { Container } from '@/components/home/Container'
import { ListTree, ListOrdered, FileEdit, BookOpen, FileOutput, ShieldCheck } from 'lucide-react'

const features = [
  {
    name: 'Automatic Sorted Rule Management',
    description:
      'A standout feature of this Course Rules Management System is its Automatic Sorted Rule Management. This innovative functionality intelligently organizes and structures course rules with minimal user input.',
    icon: ListTree,
  },
  {
    name: 'Auto numbering styles',
    description:
      "The system's Auto numbering styles feature intelligently applies appropriate numbering formats (numeric, alphabetic, Roman numerals) to rules based on their hierarchical level. Users don't need to manually decide how to number each rule or sub-rule, reducing the mental effort required in managing complex rule structures.",
    icon: ListOrdered,
  },
  {
    name: 'Manage Standard Rules',
    description:
      'Admins can easily navigate and edit courses using the search function and filters by course type. They can manage standard rules and adjust numbering through a simple drag-and-drop interface',
    icon: FileEdit,
  },
  {
    name: 'Manage Course',
    description:
      'Automate rule generation using predefined parameters to minimize manual input. Allow both normal users and admins to view and modify user-defined rules.',
    icon: BookOpen,
  },
  {
    name: 'PDF & HTML Generation',
    description:
      'Users can generate outputs in both HTML and PDF formats, with the ability to review edits live before finalizing.',
    icon: FileOutput,
  },
  {
    name: 'Access control',
    description:
      'The system provides role-based access control, only allowing authorized users to view and edit the standard rules.',
    icon: ShieldCheck,
  },
]

export function SecondaryFeatures() {
  return (
    <section
      id="secondary-features"
      aria-label="Features for building a portfolio"
      className="py-20 sm:py-32"
    >
      <Container>
        <div className="mx-auto max-w-2xl sm:text-center">
          <h2 className="text-5xl font-bold tracking-tight text-gray-900"> Key Features</h2>
          <p className="mt-2 text-lg text-gray-600">
            Our platform offers a comprehensive solution for managing course rules and user
            profiles, designed to streamline administrative tasks and enhance the user experience.
          </p>
        </div>
        <ul className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-6 text-sm sm:mt-20 sm:grid-cols-2 md:gap-y-10 lg:max-w-none lg:grid-cols-3">
          {features.map((feature) => (
            <li key={feature.name} className="rounded-2xl border border-gray-200 p-8">
              <feature.icon className="h-8 w-8" />
              <h3 className="mt-6 font-semibold text-gray-900">{feature.name}</h3>
              <p className="mt-2 text-gray-700">{feature.description}</p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}
