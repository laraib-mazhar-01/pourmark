import { Children, Fragment, isValidElement, type ReactNode } from 'react'
import { Reveal } from './Reveal'
import { useInView } from '../../hooks/useInView'

interface Props {
  eyebrow: string
  title: ReactNode
  intro?: ReactNode
  align?: 'center' | 'left'
  id?: string
  dark?: boolean
}

/** Splits a title (strings and inline elements) into individually animated words. */
function splitWords(node: ReactNode, counter: { i: number }): ReactNode[] {
  const out: ReactNode[] = []
  Children.forEach(node, (child) => {
    if (typeof child === 'string') {
      child.split(/(\s+)/).forEach((part) => {
        if (!part) return
        if (/^\s+$/.test(part)) {
          out.push(' ')
          return
        }
        const i = counter.i++
        out.push(
          <span key={`w${i}`} className="word">
            <span style={{ ['--i' as string]: i }}>{part}</span>
          </span>,
        )
      })
    } else if (isValidElement<{ children?: ReactNode; className?: string }>(child)) {
      if (child.type === 'br') {
        out.push(child)
        return
      }
      // Fragments or inline spans: recurse and keep the wrapper's styling
      const inner = splitWords(child.props.children, counter)
      if (child.type === Fragment) {
        out.push(...inner)
      } else {
        out.push(
          <span key={`e${counter.i}`} className={child.props.className}>
            {inner}
          </span>,
        )
      }
    } else if (child != null) {
      out.push(child)
    }
  })
  return out
}

export function SectionHeading({ eyebrow, title, intro, align = 'center', id, dark }: Props) {
  const center = align === 'center'
  const { ref, inView } = useInView<HTMLHeadingElement>()
  const words = splitWords(title, { i: 0 })
  return (
    <div className={`${center ? 'mx-auto text-center' : ''} max-w-2xl`}>
      <Reveal>
        <span className={`eyebrow ${dark ? 'text-aqua-300' : ''}`}>
          <span className={`h-px w-6 ${dark ? 'bg-aqua-300' : 'bg-aqua-500'}`} aria-hidden />
          {eyebrow}
        </span>
      </Reveal>
      <h2
        ref={ref}
        id={id}
        className={`word-reveal h-display mt-4 text-4xl leading-[1.05] sm:text-5xl lg:text-[3.5rem] ${dark ? 'text-white' : ''} ${inView ? 'is-visible' : ''}`}
      >
        {words}
      </h2>
      {intro && (
        <Reveal delay={200}>
          <p className={`mt-5 text-lg leading-relaxed ${dark ? 'text-white/70' : 'text-ink-soft'}`}>{intro}</p>
        </Reveal>
      )}
    </div>
  )
}
