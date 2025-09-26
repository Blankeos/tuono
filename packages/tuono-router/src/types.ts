import type { Component, JSX } from 'solid-js'

export type Mode = 'Dev' | 'Prod'

export interface Segment {
  type: 'pathname' | 'param' | 'wildcard'
  value: string
}

/**
 * Provided by the rust server and used in the ssr env
 * @see tuono {@link ServerPayloadLocation}
 */
export interface ServerInitialLocation {
  href: string
  pathname: string
  searchStr: string
}

export interface RouteProps<TData = unknown> {
  data: TData

  isLoading: boolean

  children?: JSX.Element
}

export type RouteComponent = Component<RouteProps> & {
  preload: () => void
}
