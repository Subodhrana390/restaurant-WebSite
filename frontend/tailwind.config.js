export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      animation: {
        "fade-in": "fadeIn 1s ease-in-out",
        "fade-in-up": "fadeInUp 1s ease-in-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
        fadeInUp: {
          "0%": { opacity: 0, transform: "translateY(20px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        extend: {
          backgroundImage: {
            'glass': 'linear-gradient(145deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
          },
          backdropBlur: {
            'xs': '2px',
          },
          boxShadow: {
            'glass': '0 4px 30px rgba(0, 0, 0, 0.1)',
          },
          borderColor: {
            'glass': 'rgba(255, 255, 255, 0.3)',
          },
        },
      },
    },
  },
  plugins: [],
};
