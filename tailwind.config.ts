import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ['DM Sans', 'system-ui', '-apple-system', 'sans-serif'],
        'dm-sans': ['DM Sans', 'sans-serif'],
      },
      fontSize: {
        'xs': 'var(--font-size-xs)',
        'sm': 'var(--font-size-sm)',
        'base': 'var(--font-size-base)',
        'lg': 'var(--font-size-lg)',
        'xl': 'var(--font-size-xl)',
        '2xl': 'var(--font-size-2xl)',
        '3xl': 'var(--font-size-3xl)',
        '4xl': 'var(--font-size-4xl)',
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        table: {
          felt: "hsl(var(--table-felt))",
          "felt-dark": "hsl(var(--table-felt-dark))",
          edge: "hsl(var(--table-edge))",
        },
        chip: {
          gold: "hsl(var(--chip-gold))",
          red: "hsl(var(--chip-red))",
          blue: "hsl(var(--chip-blue))",
          green: "hsl(var(--chip-green))",
          black: "hsl(var(--chip-black))",
          purple: "hsl(var(--chip-purple))",
          white: "hsl(var(--chip-white))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "card-deal": {
          "0%": { transform: "translateY(-100px) scale(0.8) rotate(-5deg)", opacity: "0" },
          "60%": { opacity: "1" },
          "100%": { transform: "translateY(0) scale(1) rotate(0)", opacity: "1" },
        },
        "card-flip": {
          "0%": { transform: "rotateY(180deg)" },
          "100%": { transform: "rotateY(0deg)" },
        },
        "card-reveal": {
          "0%": { transform: "rotateY(0deg)" },
          "100%": { transform: "rotateY(180deg)" },
        },
        "chip-slide": {
          "0%": { transform: "translateX(0) translateY(0) scale(1)", opacity: "1" },
          "50%": { transform: "translateX(calc(var(--tx) * 0.5)) translateY(calc(var(--ty) * 0.5)) scale(0.9)" },
          "100%": { transform: "translateX(var(--tx)) translateY(var(--ty)) scale(0.8)", opacity: "0.8" },
        },
        "chip-collect": {
          "0%": { transform: "scale(0.8) translateX(var(--from-x, 0)) translateY(var(--from-y, 0))", opacity: "0.8" },
          "100%": { transform: "scale(1) translateX(0) translateY(0)", opacity: "1" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 8px hsl(var(--primary) / 0.5)", borderColor: "hsl(var(--primary))" },
          "50%": { boxShadow: "0 0 25px hsl(var(--primary) / 0.8)", borderColor: "hsl(var(--primary) / 0.8)" },
        },
        "winner-celebration": {
          "0%": { transform: "scale(1)", boxShadow: "0 0 0 hsl(var(--chip-gold) / 0)" },
          "25%": { transform: "scale(1.15) rotate(3deg)", boxShadow: "0 0 30px hsl(var(--chip-gold) / 0.6)" },
          "50%": { transform: "scale(1.1)", boxShadow: "0 0 40px hsl(var(--chip-gold) / 0.8)" },
          "75%": { transform: "scale(1.15) rotate(-3deg)", boxShadow: "0 0 30px hsl(var(--chip-gold) / 0.6)" },
          "100%": { transform: "scale(1)", boxShadow: "0 0 20px hsl(var(--chip-gold) / 0.4)" },
        },
        "slide-in-bottom": {
          "0%": { transform: "translateY(100%)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "dealer-button-move": {
          "0%": { transform: "translateX(var(--from-x, 0)) translateY(var(--from-y, 0))" },
          "100%": { transform: "translateX(0) translateY(0)" },
        },
        "burn-card": {
          "0%": { transform: "translateY(0) scale(1)", opacity: "1" },
          "100%": { transform: "translateY(20px) translateX(-100px) scale(0.6) rotate(-15deg)", opacity: "0.3" },
        },
        "sparkle": {
          "0%, 100%": { opacity: "0", transform: "scale(0) rotate(0deg)" },
          "50%": { opacity: "1", transform: "scale(1) rotate(180deg)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "card-deal": "card-deal 0.6s ease-out forwards",
        "card-flip": "card-flip 0.6s ease-in-out forwards",
        "card-reveal": "card-reveal 0.6s ease-in-out forwards",
        "chip-slide": "chip-slide 0.8s cubic-bezier(0.4, 0.0, 0.2, 1) forwards",
        "chip-collect": "chip-collect 1s cubic-bezier(0.4, 0.0, 0.2, 1) forwards",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "winner-celebration": "winner-celebration 1.2s ease-in-out 3",
        "slide-in-bottom": "slide-in-bottom 0.3s ease-out",
        "dealer-button-move": "dealer-button-move 0.5s ease-in-out forwards",
        "burn-card": "burn-card 0.4s ease-in forwards",
        "sparkle": "sparkle 1s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
