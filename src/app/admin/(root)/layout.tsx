import { Sidebar } from '@/components/sidebar'
import React, { FC } from 'react'

interface Props {
    children: React.ReactNode
}

const AdminLayout: FC<Props> = ({children}) => {
  return (
    <div className="relative flex min-h-screen">
      <Sidebar />
      <div className="flex-1">
        <div className="border-b">
          <div className="flex h-16 items-center gap-4 px-4">
            <div className="flex-1">
              <h1 className="text-lg font-semibold">Admin Panel</h1>
            </div>
          </div>
        </div>
        <div className="p-8">{children}</div>
      </div>
    </div>
  )
}

export default AdminLayout