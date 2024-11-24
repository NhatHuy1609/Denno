import { Root, Image as AvatarImage, Fallback as AvatarFallback } from '@radix-ui/react-avatar'
import Image from 'next/image'
import './style.css'

type Null<T> = T | null

interface IAvatarProps {
  size?: 'sm' | 'base' | 'lg'
  src: Null<string>
  name: Null<string>
  fallback?: any
}

function Avatar({ src, name, size = 'base', fallback = '' }: IAvatarProps) {
  return (
    <Root className={`avatar-root size-${size} shrink-0`}>
      <AvatarImage className='avatar-image' src={src || ''} alt={name || ''} title={name || ''} />
      <AvatarFallback title={name || ''} className='avatar-fallback' delayMs={600}>
        {fallback && <Image src={fallback} alt='default-image' />}
        {!fallback && <div>{name?.slice(0, 2)}</div>}
      </AvatarFallback>
    </Root>
  )
}

export default Avatar
