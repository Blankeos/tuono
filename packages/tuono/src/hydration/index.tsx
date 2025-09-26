import { hydrate as hydrateRoot } from 'solid-js/web'
import type { createRoute } from 'tuono-router'
import { createRouter } from 'tuono-router'

import { TuonoEntryPoint } from '../shared/TuonoEntryPoint'

type RouteTree = ReturnType<typeof createRoute>

export function hydrate(routeTree: RouteTree): void {
  console.log('I AM HYDRATING - BEFORE ROUTER CREATION')
  // Create a new router instance
  const router = createRouter({ routeTree })
  console.log('I AM HYDRATING - ROUTER CREATED')

  hydrateRoot(() => <TuonoEntryPoint router={router} />, document)
}
