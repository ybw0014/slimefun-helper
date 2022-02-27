module.exports = {
    content: [
        './components/**/*.{vue,js}',
        './pages/**/*.vue',
        './plugins/**/*.{js,ts}',
        './nuxt.config.{js,ts}'
    ],
    // darkMode: 'class', // default: 'media'
    theme: {
        extend: {
            textColor: {
                inherit: 'inherit'
            }
        }
    },
    variants: {
        extend: {}
    },
    plugins: [
        require('@tailwindcss/forms')
    ]
}
