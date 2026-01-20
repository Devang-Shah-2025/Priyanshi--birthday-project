import './globals.css'

export const metadata = {
  title: 'For Priyanshi ✨',
  description: 'A journey through the stars',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Cormorant Garamond - Elegant serif for emotional text */}
        {/* Montserrat - Clean sans-serif for UI elements */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400;1,500&family=Montserrat:wght@300;400;500;600&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
