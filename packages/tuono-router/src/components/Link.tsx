import type { JSX } from 'solid-js'
import {
  createSignal,
  mergeProps,
  onCleanup,
  onMount,
  splitProps,
} from 'solid-js'

import { useRouter } from '../hooks/useRouter'

interface TuonoLinkProps extends JSX.AnchorHTMLAttributes<HTMLAnchorElement> {
  /**
   * If "true" the route gets loaded when the link enters the viewport.
   * @default true
   */
  preload?: boolean

  /**
   * If "false" the scroll offset will be kept across page navigation.
   * @default true
   */
  scroll?: boolean

  /**
   * If "true" the history entry will be replaced instead of pushed.
   * @default false
   */
  replace?: boolean
}

function isEventModifierKeyActiveAndTargetDifferentFromSelf(
  event: MouseEvent & { currentTarget: HTMLAnchorElement },
): boolean {
  const target = event.currentTarget.getAttribute('target')
  return (
    (target && target !== '_self') ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey // triggers resource download
  )
}

export function Link(rawProps: TuonoLinkProps): JSX.Element {
  const [ref, setRef] = createSignal<HTMLAnchorElement>()
  const [hasBeenInView, setHasBeenInView] = createSignal(false)

  // const {
  //   preload = true,
  //   scroll = true,
  //   children,
  //   href,
  //   replace,
  //   onClick,
  //   ...rest
  // } = rawProps

  const props = mergeProps({ preload: true, scroll: true }, rawProps)
  const [local, rest] = splitProps(props, [
    'preload',
    'scroll',
    'children',
    'href',
    'replace',
    'onClick',
  ])

  const router = useRouter()
  // const route = useRoute(local.href)

  onMount(() => {
    if (!local.preload) return

    const element = ref()
    if (!element) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasBeenInView()) {
            setHasBeenInView(true)
            // route?.component.preload
            observer.disconnect()
          }
        })
      },
      { threshold: 0 },
    )

    observer.observe(element)

    onCleanup(() => {
      observer.disconnect()
    })
  })

  const handleTransition: JSX.EventHandler<HTMLAnchorElement, MouseEvent> = (
    event,
  ) => {
    // @ts-expect-error valid reason dont worry
    local.onClick?.(event)

    if (
      local.href?.startsWith('#') ||
      // If the user is pressing a modifier key or using the target attribute,
      // we fall back to default behaviour of `a` tag
      isEventModifierKeyActiveAndTargetDifferentFromSelf(event)
    ) {
      return
    }

    event.preventDefault()

    const method = local.replace ? 'replace' : 'push'

    router[method](local.href || '', { scroll: local.scroll })
  }

  return (
    <a {...rest} href={local.href} ref={setRef} onClick={handleTransition}>
      {local.children}
    </a>
  )
}
