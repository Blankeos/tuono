/**
 * This component is heavily inspired by Next.js dynamic function
 * Link: https://github.com/vercel/next.js/blob/1df81bcea62800198884438a2bb27ba14c9d506a/packages/next/src/shared/lib/dynamic.tsx
 */
import {
  Suspense,
  lazy,
  type Component,
  type FlowProps,
  type JSX,
} from 'solid-js'

const isServerSide = typeof window === 'undefined'

interface ComponentModule<T> {
  default: Component<T>
}

interface DynamicOptions {
  ssr?: boolean
  loading?: Component<unknown> | null
}

type Loader<T = object> = () => Promise<Component<T> | ComponentModule<T>>

interface LoadableOptions<T> extends DynamicOptions {
  loader: Loader<T>
}

type LoadableFn = <T = object>(options: LoadableOptions<T>) => Component<T>

const defaultLoaderOptions: LoadableOptions<object> = {
  ssr: true,
  loading: null,
  loader: () => Promise.resolve(() => null),
}

function noSSR<T = object>(
  LoadableInitializer: LoadableFn,
  loadableOptions: LoadableOptions<T>,
): Component<T> {
  if (!isServerSide) {
    return LoadableInitializer(loadableOptions)
  }

  if (!loadableOptions.loading) return () => null

  const Loading = loadableOptions.loading
  // This will only be rendered on the server side
  function NoSSRLoading(): JSX.Element {
    return <Loading />
  }
  return NoSSRLoading
}

function Loadable<T = object>(options: LoadableOptions<T>): Component<T> {
  const opts = { ...defaultLoaderOptions, ...options }
  const Lazy = lazy(() => opts.loader().then())
  const Loading = opts.loading

  function LoadableComponent(props: T): JSX.Element {
    const fallbackElement = Loading ? <Loading /> : null

    const Wrap = Loading
      ? // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
        (_props: FlowProps) => <Suspense>{_props.children}</Suspense>
      : // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
        (_props: FlowProps) => <>{_props.children}</>

    const wrapProps = Loading ? { fallback: fallbackElement } : {}

    // TODO: In case ssr = false handle also the assets preloading
    return (
      <Wrap {...wrapProps}>
        <Lazy {...props} />
      </Wrap>
    )
  }
  LoadableComponent.displayName = 'LoadableComponent'

  return LoadableComponent
}

/**
 * This function lets you dynamically import a component.
 * It uses [React.lazy()](https://react.dev/reference/react/lazy) with [Suspense](https://react.dev/reference/react/Suspense) under the hood.
 */
export function dynamic<T = object>(
  importFn: Loader<T>,
  opts?: DynamicOptions,
): Component<T> {
  if (typeof opts?.ssr === 'boolean' && !opts.ssr) {
    return noSSR<T>(Loadable, { ...opts, loader: importFn })
  }
  return Loadable<T>({ ...opts, loader: importFn })
}
