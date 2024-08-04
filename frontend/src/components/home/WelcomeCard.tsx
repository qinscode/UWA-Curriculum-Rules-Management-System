import { FC } from 'react'

const WelcomeCard: FC = () => {
  return (
    <div className="overflow-hidden rounded-lg bg-white shadow">
      <div className="px-4 py-5 sm:p-6">
        <h2 className="mb-4 text-2xl font-bold text-gray-900">
          Welcome to the Course Rules Management System (Demo)
        </h2>
        <p className="text-lg text-gray-700">
          This centralized platform allows you to manage and update course rules efficiently. Use
          the navigation menu to access different features.
        </p>
      </div>
    </div>
  )
}

export default WelcomeCard
