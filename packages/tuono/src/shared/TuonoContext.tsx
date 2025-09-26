import {
  createContext,
  createMemo,
  useContext,
  type Accessor,
  type JSX,
} from 'solid-js'

import { SERVER_PAYLOAD_VARIABLE_NAME } from '../constants'
import type { ServerPayload } from '../types'

const isServerSide = typeof window === 'undefined'

interface TuonoContextValue {
  serverPayload: Accessor<ServerPayload>
}

const TuonoContext = createContext({} as TuonoContextValue)

interface TuonoContextProviderProps {
  serverPayload?: ServerPayload

  children: JSX.Element
}

/**
 * @warning THIS SHOULD NOT BE EXPOSED TO USERLAND
 *
 * @see https://github.com/tuono-labs/tuono/issues/410
 */
export function TuonoContextProvider({
  serverPayload,
  children,
}: TuonoContextProviderProps): JSX.Element {
  const _serverPayload = createMemo(() => {
    const __serverPayload = (
      isServerSide ? serverPayload : window[SERVER_PAYLOAD_VARIABLE_NAME]
    ) as ServerPayload

    return __serverPayload
  })

  return (
    <TuonoContext.Provider
      value={{
        serverPayload: _serverPayload,
      }}
    >
      {children}
    </TuonoContext.Provider>
  )
}

/**
 * @warning THIS SHOULD NOT BE EXPOSED TO USERLAND
 */
export function useTuonoContextServerPayload(): TuonoContextValue['serverPayload'] {
  return useContext(TuonoContext).serverPayload
}
