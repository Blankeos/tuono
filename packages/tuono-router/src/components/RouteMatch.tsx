import type { JSX } from 'solid-js'
import { Show, Suspense, createMemo } from 'solid-js'

import { Dynamic } from 'solid-js/web'

import type { Route } from '../route'
import type { Mode } from '../types'

import { useServerPayloadData } from '../hooks/useServerPayloadData'

import { CriticalCss } from './CriticalCss'
import { useRouterContext } from './RouterContext'

interface RouteMatchProps<TServerPayloadData = unknown> {
  route: Route
  // User defined server side props
  serverInitialData: TServerPayloadData
  mode?: Mode
}

/**
 * Returns the route match with the root element if exists
 *
 * It handles the fetch of the client side resources
 */
export const RouteMatch = (props: RouteMatchProps): JSX.Element => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = useServerPayloadData<() => any>(
    props.route,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
    props.serverInitialData as any,
  )
  const { isTransitioning } = useRouterContext()

  const routes = createMemo(() => loadParentComponents(props.route))

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const routeData = () => (isTransitioning() ? null : data)

  return (
    <TraverseRootComponents
      routes={routes()}
      data={routeData()}
      isLoading={isTransitioning()}
      mode={props.mode}
    >
      <Suspense>
        <CriticalCss routeFilePath={props.route.filePath} mode={props.mode} />
        <Dynamic
          component={props.route.component}
          data={routeData()}
          isLoading={isTransitioning()}
        />
      </Suspense>
    </TraverseRootComponents>
  )
}

interface TraverseRootComponentsProps<TData = unknown> {
  routes: Array<Route>
  data: TData
  isLoading: boolean
  children?: JSX.Element
  index?: number
  mode?: Mode
}

/**
 * This component traverses and renders all components
 * that wrap the selected route (__layout).
 */
const TraverseRootComponents = (
  props: TraverseRootComponentsProps,
): JSX.Element => {
  return (
    <Show
      when={props.routes.length > (props.index || 0)}
      fallback={<>{props.children}</>}
    >
      {/*@ts-expect-error this is fine*/}
      {() => {
        const route = props.routes[props.index || 0] as Route
        const Parent = route.component

        // Fallback to the route id if the filePath is not defined
        // as is the case for the root route
        const routeFilePath = route.filePath || route.id

        return (
          <Dynamic
            component={Parent}
            data={props.data}
            isLoading={props.isLoading}
          >
            <CriticalCss routeFilePath={routeFilePath} mode={props.mode} />
            <TraverseRootComponents
              routes={props.routes}
              data={props.data}
              isLoading={props.isLoading}
              index={(props.index || 0) + 1}
              mode={props.mode}
            >
              {props.children}
            </TraverseRootComponents>
          </Dynamic>
        )
      }}
    </Show>
  )
}

const loadParentComponents = (
  route: Route,
  loader: Array<Route> = [],
): Array<Route> => {
  const parentComponent = route.options.getParentRoute?.() as Route

  loader.push(parentComponent)

  if (!parentComponent.isRoot) {
    return loadParentComponents(parentComponent, loader)
  }

  return loader.reverse()
}
