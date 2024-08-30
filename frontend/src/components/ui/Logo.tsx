import Image from 'next/image'

export function Logo(props: React.ComponentPropsWithoutRef<'svg'>) {
  return <Image src="/uwa-logo.svg" alt="Logo" width={180} height={59} />
}
