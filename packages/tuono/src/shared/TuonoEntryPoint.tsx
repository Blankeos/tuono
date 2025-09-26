import type { JSX } from 'solid-js'
import type { RouterInstanceType } from 'tuono-router'

import type { ServerPayload } from '../types'

import { RouterContextProviderWrapper } from './RouterContextProviderWrapper'
import { TuonoContextProvider } from './TuonoContext'

interface TuonoEntryPointProps {
  router: RouterInstanceType
  serverPayload?: ServerPayload
}

export function TuonoEntryPoint({
  router,
  serverPayload,
}: TuonoEntryPointProps): JSX.Element {
  return (
    <TuonoContextProvider serverPayload={serverPayload}>
      <RouterContextProviderWrapper
        router={router}
        mode={serverPayload?.mode}
      />
    </TuonoContextProvider>
  )
}
