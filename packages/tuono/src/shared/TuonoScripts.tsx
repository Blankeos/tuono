import { type JSX } from 'solid-js'

import { SERVER_PAYLOAD_VARIABLE_NAME } from '../constants'

import { DevResources } from './DevResources'
import { ProdResources } from './ProdResources'
import { useTuonoContextServerPayload } from './TuonoContext'

export function TuonoScripts(): JSX.Element {
  const serverPayload = useTuonoContextServerPayload()

  return (
    <>
      <script>{`window['${SERVER_PAYLOAD_VARIABLE_NAME}']=${JSON.stringify(serverPayload)}`}</script>
      {serverPayload().mode === 'Dev' && (
        <DevResources
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
          devServerConfig={(serverPayload() as any).devServerConfig}
        />
      )}
      {serverPayload().mode === 'Prod' && (
        <ProdResources
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
          jsBundles={(serverPayload() as any).jsBundles}
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
          cssBundles={(serverPayload() as any).cssBundles}
        />
      )}
    </>
  )
}
