import React, { FC } from 'react'

type PageHeaderProps = {
  title: string
}

const PageHeader: FC<PageHeaderProps> = ({ title }) => {
  return <h2 className="mb-4 text-2xl font-bold">{title}</h2>
}

export default PageHeader
