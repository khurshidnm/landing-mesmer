import { FC } from "react"

interface Props {
    children: React.ReactNode
}

const RootLayout: FC<Props> = ({ children }) => {
  return (
    <>
      <main>{children}</main>
    </>
  )
}

export default RootLayout