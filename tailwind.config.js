/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Faithful to findworkhappiness.com palette, tuned to the book cover
        paper: '#f9f8f3',     // primary cream background
        paper2: '#f4f3eb',    // secondary cream
        ink: '#222324',       // near-black text
        sage: '#a5bab3',      // muted sage accent
        sage2: '#9ab5ac',     // deeper sage
        bone: '#b9b8b1',      // warm grey
        yellow: '#ffeb35',    // signature highlight
        forest: '#1f5c2e',    // deep green from the cover
        forest2: '#2f7d3f',   // mid green
      },
      fontFamily: {
        display: ['Oswald', 'Arial Narrow', 'sans-serif'],
        fat: ['Anton', 'Oswald', 'Arial Narrow', 'sans-serif'],
        sign: ['Sacramento', 'cursive'],
        body: ['"Hanken Grotesk"', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        eyebrow: '0.22em',
      },
      maxWidth: {
        edge: '1600px',
      },
      keyframes: {
        floaty: {
          '0%,100%': { transform: 'translateY(0) rotate(-1.5deg)' },
          '50%': { transform: 'translateY(-18px) rotate(1.5deg)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        floaty: 'floaty 7s ease-in-out infinite',
        marquee: 'marquee 28s linear infinite',
      },
    },
  },
  plugins: [],
}
