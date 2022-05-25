export default {
    // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
    ssr: false,

    // Target: https://go.nuxtjs.dev/config-target
    target: 'static',

    // Global page headers: https://go.nuxtjs.dev/config-head
    head: {
        title: '粘液科技小助手',
        htmlAttrs: {
            lang: 'zh-CN'
        },
        meta: [
            { charset: 'utf-8' },
            { name: 'viewport', content: 'width=device-width,initial-scale=1.0,minimum-scale=1.0,shrink-to-fit=no' },
            { hid: 'description', name: 'description', content: '粘液科技计算器' },
            { hid: 'author', name: 'author', content: 'ybw0014' },
            { name: 'format-detection', content: 'telephone=no' }
        ],
        link: [
            { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
            { rel: 'stylesheet', href: 'https://gzassets.cn/fonts/font-awesome/v5/css/all.min.css' },
            { rel: 'stylesheet', href: 'https://gzassets.cn/fonts/AlibabaPuHuiTi.css' }
        ]
    },

    // Global CSS: https://go.nuxtjs.dev/config-css
    css: [
        '@/assets/styles/sfcalc.scss'
    ],

    // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
    plugins: [
        '@/plugins/clipboard.js'
    ],

    // Auto import components: https://go.nuxtjs.dev/config-components
    components: true,

    // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
    buildModules: [
        // https://go.nuxtjs.dev/eslint
        '@nuxtjs/eslint-module',
        // https://go.nuxtjs.dev/tailwindcss
        '@nuxtjs/tailwindcss'
    ],

    // Modules: https://go.nuxtjs.dev/config-modules
    modules: [
        // https://go.nuxtjs.dev/axios
        '@nuxtjs/axios',
        // https://www.npmjs.com/package/vue-sweetalert2
        'vue-sweetalert2/nuxt'
    ],

    axios: {
        baseURL: '/' // Used as fallback if no runtime config is provided
    },

    // Build Configuration: https://go.nuxtjs.dev/config-build
    build: {
        babel: {
            compact: true
        }
    }
}
