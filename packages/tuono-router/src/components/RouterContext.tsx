import type { JSX } from 'solid-js'
import {
  createContext,
  createSignal,
  onCleanup,
  onMount,
  useContext,
} from 'solid-js'

import type { Router } from '../router'
import type { ServerInitialLocation } from '../types'

const isServerSide = typeof window === 'undefined'

export interface ParsedLocation {
  href: string
  pathname: string
  search: Record<string, string>
  searchStr: string
  hash: string
}

interface RouterContextValue {
  router: Router
  location: () => ParsedLocation
  isTransitioning: () => boolean
  updateLocation: (loc: ParsedLocation) => void
  stopTransitioning: () => void
}

const RouterContext = createContext<RouterContextValue>()

function getInitialLocation(
  serverPayloadLocation: ServerInitialLocation,
): ParsedLocation {
  if (isServerSide) {
    return {
      pathname: serverPayloadLocation.pathname || '',
      hash: '',
      href: serverPayloadLocation.href || '',
      searchStr: serverPayloadLocation.searchStr || '',
      search: Object.fromEntries(
        new URLSearchParams(serverPayloadLocation.searchStr),
      ),
    }
  }

  const { pathname, hash, href, search } = window.location
  return {
    pathname,
    hash,
    href,
    searchStr: search,
    search: Object.fromEntries(new URLSearchParams(search)),
  }
}

interface RouterContextProviderProps {
  router: Router
  serverInitialLocation: ServerInitialLocation
  children: JSX.Element
}

export function RouterContextProvider(
  props: RouterContextProviderProps,
): JSX.Element {
  // Allow the router to update options on the router instance
  props.router.update({ ...props.router.options } as Parameters<
    typeof props.router.update
  >[0])

  const [location, setLocation] = createSignal<ParsedLocation>(
    getInitialLocation(props.serverInitialLocation),
  )
  // Global state to track whether a page transition is in progress.
  // Set to `false` once the page is fully loaded, including server-side data.
  const [isTransitioning, setIsTransitioning] = createSignal<boolean>(false)

  /**
   * Listen browser navigation events
   */
  onMount(() => {
    const updateLocationOnPopStateChange = ({
      target,
    }: PopStateEvent): void => {
      const { location: targetLocation } = target as typeof window
      const { pathname, hash, href, search } = targetLocation

      setLocation({
        pathname,
        hash,
        href,
        searchStr: search,
        search: Object.fromEntries(new URLSearchParams(search)),
      })
    }

    window.addEventListener('popstate', updateLocationOnPopStateChange)

    onCleanup(() => {
      window.removeEventListener('popstate', updateLocationOnPopStateChange)
    })
  })

  const updateLocation = (newLocation: ParsedLocation): void => {
    setIsTransitioning(true)
    setLocation(newLocation)
  }

  const stopTransitioning = (): void => {
    setIsTransitioning(false)
  }

  const contextValue: RouterContextValue = {
    get router() {
      return props.router
    },
    get location() {
      return location
    },
    get isTransitioning() {
      return isTransitioning
    },
    get updateLocation() {
      return updateLocation
    },
    get stopTransitioning() {
      return stopTransitioning
    },
  }

  return (
    <RouterContext.Provider value={contextValue}>
      {props.children}
    </RouterContext.Provider>
  )
}

/**
 * @warning THIS SHOULD NOT BE EXPOSED TO USERLAND
 */
export function useRouterContext(): RouterContextValue {
  const context = useContext(RouterContext)
  if (!context) {
    throw new Error(
      'useRouterContext must be used within a RouterContextProvider',
    )
  }
  return context
}
