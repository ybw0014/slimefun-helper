<template>
    <div :class="classes" role="alert">
        <FaIcon type="solid" :icon="icon" class="alert-icon" />
        <slot />
    </div>
</template>

<script>
export default {
    props: {
        type: {
            type: String,
            default: ''
        }
    },
    data () {
        return {
            alertType: ''
        }
    },
    computed: {
        classes () {
            return ['alert', 'alert-' + this.alertType]
        },
        icon () {
            return this.getIcon(this.alertType)
        }
    },
    created () {
        this.setType(this.type)
    },
    methods: {
        setType (type) {
            switch (type) {
            case 'primary':
            case 'secondary':
            case 'success':
            case 'danger':
            case 'warning':
            case 'indigo':
            case 'light':
            case 'dark':
                this.alertType = type
                break
            default:
                this.alertType = 'primary'
                break
            }
        },
        getIcon (type) {
            switch (type) {
            case 'primary':
                return 'info-circle'
            case 'secondary':
                return 'info'
            case 'success':
                return 'check-circle'
            case 'danger':
                return 'times-circle'
            case 'warning':
                return 'exclamation-circle'
            case 'indigo':
            case 'light':
            case 'dark':
                return 'info'
            default:
                return ''
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.alert{
    @apply rounded-lg py-3 px-6 my-3 text-sm inline-flex items-center w-full;

    .alert-icon{
        @apply w-4 h-4 mr-2 fill-current;
    }

    &.alert-primary{
        @apply bg-blue-100 text-blue-700;
        @apply dark:bg-blue-900 dark:text-blue-300;
    }
    &.alert-secondary{
        @apply bg-purple-100 text-purple-700;
        @apply dark:bg-green-900 dark:text-green-300;
    }
    &.alert-success{
        @apply bg-green-100 text-green-700;
        @apply dark:bg-green-900 dark:text-green-300;
    }
    &.alert-danger{
        @apply bg-red-100 text-red-700;
        @apply dark:bg-red-900 dark:text-red-300;
    }
    &.alert-warning{
        @apply bg-yellow-100 text-yellow-700;
        @apply dark:bg-yellow-900 dark:text-yellow-300;
    }
}
</style>
