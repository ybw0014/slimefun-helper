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

    &.alert-danger{
        @apply bg-red-100 text-red-700;
    }
}
</style>
