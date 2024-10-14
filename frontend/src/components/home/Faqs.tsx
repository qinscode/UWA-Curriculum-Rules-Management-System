import Image from 'next/image'

import { Container } from '@/components/home/Container'

const faqs = [
  [
    {
      question: 'How do I sign up for an account?',
      answer:
        'To sign up, click on the "Sign Up" button on the login page, fill in your email, password, and username, and submit the form.',
    },
    {
      question: 'How can I know my access rights?',
      answer:
        'You can check your access rights by visiting the profile page and looking at the role section. We have two types of access: Admin and Normal User. Admins can edit the standard rules, while normal users can only view the standard rules but have the right to edit user-defined rules.',
    },
    {
      question: 'Can I change my username or email??',
      answer:
        'Yes, you can edit your username and email from your profile. Changing the email will update your login credentials.',
    },
  ],
  [
    {
      question: 'What are the course types supported for rule editing??',
      answer:
        'Currently, the system supports Postgraduate Coursework rules for editing and updating.',
    },
    {
      question: 'How do I add a new rule to a course?',
      answer:
        'You can click the "Add Requirement" button to create a new rule and use the "+" button for sub-rules.',
    },
    {
      question: 'Can I reorder the rules?',
      answer: 'Yes, you can drag and drop rules to reorder them using the drag tool.',
    },
  ],
  [
    {
      question: 'What numbering styles are available for rules?',
      answer: 'The system offers Numeric, Alphabetic, and Roman numbering styles.',
    },
    {
      question: 'How can I delete a rule?',
      answer:
        'Click the delete button next to the rule. Deleting a Level 1 rule will also delete its sub-rules.',
    },
    {
      question: 'How do I generate course documents?',
      answer:
        'Go to the "Generate Documentation" tab, select the course and version, and click "Generate" to create and download a PDF file or HTML file',
    },
  ],
]

export function Faqs() {
  return (
    <section
      id="faq"
      aria-labelledby="faq-title"
      className="relative overflow-hidden bg-slate-50 py-10 sm:py-32"
    >
      <Container className="relative">
        <div className="mx-auto max-w-2xl lg:mx-0">
          <h2
            id="faq-title"
            className="font-display text-4xl font-bold tracking-tight text-slate-900 sm:text-4xl"
          >
            Frequently asked questions (FAQ)
          </h2>
          <p className="mt-4 text-lg tracking-tight text-slate-700"></p>
        </div>
        {/* eslint-disable-next-line jsx-a11y/no-redundant-roles */}
        <ul
          role="list"
          className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:max-w-none lg:grid-cols-3"
        >
          {faqs.map((column, columnIndex) => (
            <li key={columnIndex}>
              {/* eslint-disable-next-line jsx-a11y/no-redundant-roles */}
              <ul role="list" className="flex flex-col gap-y-8">
                {column.map((faq, faqIndex) => (
                  <li key={faqIndex}>
                    <h3 className="font-display text-lg font-bold leading-7 text-slate-900">
                      {faq.question}
                    </h3>
                    <p className="mt-4 text-sm text-slate-700">{faq.answer}</p>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}
