import Link from 'next/link'
import Image from 'next/image'

export default function LogoButton() {
  return (
    <div className="relative flex h-10 w-10 flex-col items-center justify-center overflow-clip rounded-xl bg-white hover:bg-white/60">
      <Link href={'/'}>
        <Image
          className=""
          src={'/eppl.svg'}
          alt={'Excel Printers Private Limited Logo'}
          style={{ objectFit: 'contain' }}
          fill
        ></Image>
      </Link>
    </div>
  )
}
