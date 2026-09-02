'use client';

import { useRouter } from 'next/navigation';
import type { AnchorHTMLAttributes, MouseEvent, ReactNode } from 'react';

type TransitionLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
  href: string;
  children: ReactNode;
};

export default function TransitionLink({ href, children, onClick, ...props }: TransitionLinkProps) {
  const router = useRouter();

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      props.target === '_blank' ||
      !href.startsWith('/')
    ) return;

    event.preventDefault();
    const curtain = document.querySelector<HTMLElement>('.route-curtain');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!curtain || reduced) {
      router.push(href);
      return;
    }

    curtain.dataset.state = 'covering';
    window.setTimeout(() => router.push(href), 520);
  };

  return (
    <a href={href} onClick={handleClick} {...props}>
      {children}
    </a>
  );
}
