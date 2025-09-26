import type { Component } from 'solid-js'
import type { TuonoRouteProps } from 'tuono'

interface IndexProps {
  subtitle: string
}

const IndexPage: Component<TuonoRouteProps<IndexProps>> = ({
  data,
  isLoading,
}) => {
  if (isLoading) {
    return <h1>Loading...</h1>
  }

  return (
    <>
      <header class="header">
        <a href="https://crates.io/crates/tuono" target="_blank">
          Crates
        </a>
        <a href="https://www.npmjs.com/package/tuono" target="_blank">
          Npm
        </a>
      </header>
      <div class="title-wrap">
        <h1 class="title">
          TU<span>O</span>NO
        </h1>
        <div class="logo">
          <img src="rust.svg" class="rust" />
          <img src="react.svg" class="react" />
        </div>
      </div>
      <div class="subtitle-wrap">
        <p class="subtitle">{data?.subtitle}</p>
        <a
          href="https://github.com/tuono-labs/tuono"
          target="_blank"
          class="button"
          type="button"
        >
          Github
        </a>
      </div>
    </>
  )
}

export default IndexPage
