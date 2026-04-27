'use client'

import Image from 'next/image'

/**
 * AdminLogo — displayed in the Payload CMS admin sidebar.
 * Uses the brand logo from the public directory.
 */
export function AdminLogo() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '4px 0',
      }}
    >
      <Image
        src="/logo.jpeg"
        alt="Ça Crée Voyage"
        width={36}
        height={36}
        style={{
          borderRadius: '50%',
          objectFit: 'cover',
          border: '1.5px solid #D4AF37',
        }}
      />
      <span
        style={{
          fontFamily: 'Georgia, serif',
          fontSize: '15px',
          fontWeight: 500,
          color: '#D4AF37',
          letterSpacing: '0.04em',
          whiteSpace: 'nowrap',
        }}
      >
        Ça Crée Voyage
      </span>
    </div>
  )
}

/**
 * AdminIcon — small icon for collapsed sidebar state.
 */
export function AdminIcon() {
  return (
    <Image
      src="/logo.jpeg"
      alt="ÇCV"
      width={28}
      height={28}
      style={{
        borderRadius: '50%',
        objectFit: 'cover',
        border: '1.5px solid #D4AF37',
      }}
    />
  )
}
