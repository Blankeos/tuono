import { lazy, type Component, type ComponentProps } from 'solid-js'

// Assuming RouteComponent is a SolidJS component type
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type RouteComponent = Component<any>
type ImportFn = () => Promise<{ default: RouteComponent }>

export const RouteLazyLoading = (
  factory: ImportFn,
): RouteComponent & { preload: () => Promise<void> } => {
  let LoadedComponent: RouteComponent | undefined
  const LazyComponent = lazy<RouteComponent>(factory)

  const loadComponent = (): Promise<void> =>
    factory().then((module) => {
      LoadedComponent = module.default
    })

  const _Component: RouteComponent = (
    props: ComponentProps<RouteComponent>,
  ) => {
    const ComponentToRender = LoadedComponent || LazyComponent
    return ComponentToRender(props)
  }

  // Add preload method to the component
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
  ;(_Component as any).preload = loadComponent

  return _Component as RouteComponent & { preload: () => Promise<void> }
}
