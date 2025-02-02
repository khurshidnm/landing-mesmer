"use client"

import { Sidebar } from '@/components/sidebar'
import { useSession } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import React, { FC, useEffect, useState } from 'react'
import PageLoading from './loading';

interface Props {
    children: React.ReactNode
}

const AdminLayout: FC<Props> = ({children}) => {
  const [authenticated, setAuthenticated] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const session = useSession();
  console.log(session)

  useEffect(() => {
    if (session.status === "unauthenticated") {
        console.log("unauthenticated")
      router.push("/admin/login");
    } else if (session.status === "authenticated") setAuthenticated(true);
  }, [pathname, session]);
  return authenticated ? (
    <div className="relative flex min-h-screen">
      <Sidebar />
      <div className="ml-[181px] flex-1">
        <div className="border-b">
          <div className="flex h-16 items-center gap-4 px-4">
            <div className="flex-1">
              <h1 className="text-lg font-semibold">Admin Panel</h1>
            </div>
          </div>
        </div>
        <div className=" p-8">{children}</div>
      </div>
    </div>
  ): (
    <PageLoading />
  )
}

export default AdminLayout