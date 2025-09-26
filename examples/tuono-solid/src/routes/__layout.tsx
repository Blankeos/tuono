import type { JSX } from 'solid-js'
import type { TuonoLayoutProps } from 'tuono'
import { TuonoScripts } from 'tuono'

import '../styles/global.css'

export default function RootLayout({
  children,
}: TuonoLayoutProps): JSX.Element {
  return (
    <html>
      <body>
        <main>{children}</main>
        <TuonoScripts />
      </body>
    </html>
  )
}
