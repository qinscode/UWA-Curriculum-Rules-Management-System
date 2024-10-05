import React, { FC } from 'react'
import { BookOpenIcon } from '@heroicons/react/24/solid'

interface HandbookGeneratorProps {
  course: string | null // 传入的课程代码
  disabled: boolean // 新增的参数来控制按钮是否禁用
}

const HandbookGenerator: FC<HandbookGeneratorProps> = ({ course, disabled }) => {
  const handbookUrl = `https://handbooks.uwa.edu.au/coursedetails?code=${course}#rules`

  return (
    <div className="rounded-lg border border-gray-200 p-6 shadow-lg">
      <div className="border-b border-gray-900/10 pb-12">
        <h3 className="text-base font-semibold leading-7 text-gray-900">
          Full Handbook Generation
        </h3>
        <p className="mt-1 text-sm leading-6 text-gray-600">
          Generate a complete handbook containing all course information.
        </p>
        <div className="mt-6">
          <a
            href={handbookUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex w-full items-center justify-center rounded-md bg-blue-800 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${
              disabled ? 'pointer-events-none opacity-50' : ''
            }`}
            onClick={(e) => disabled && e.preventDefault()} // 阻止跳转
          >
            <BookOpenIcon className="mr-2 h-5 w-5" />
            Link to Full Handbook
          </a>
        </div>
      </div>
    </div>
  )
}

export default HandbookGenerator
