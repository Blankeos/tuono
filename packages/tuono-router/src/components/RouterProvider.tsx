import type { JSX } from 'solid-js'

import type { Router } from '../router'
import type { Mode, ServerInitialLocation } from '../types'

import { Matches } from './Matches'
import { RouterContextProvider } from './RouterContext'

interface RouterProviderProps {
  router: Router
  serverInitialLocation: ServerInitialLocation
  serverInitialData: unknown
  mode?: Mode
}

export function RouterProvider({
  router,
  serverInitialLocation,
  serverInitialData,
  mode,
}: RouterProviderProps): JSX.Element {
  return (
    <RouterContextProvider
      router={router}
      serverInitialLocation={serverInitialLocation}
    >
      <Matches serverInitialData={serverInitialData} mode={mode} />
    </RouterContextProvider>
  )
}
