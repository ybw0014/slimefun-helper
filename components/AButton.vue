<template>
    <a
        :href="href"
        class="button"
        :class="classes"
        role="button"
        v-bind="$attrs"
        @click="onClick($event)"
    >
        <slot />
    </a>
</template>

<script>
export default {
    name: 'AButton',
    props: {
        disabled: {
            type: Boolean,
            default: false
        },
        href: {
            type: String,
            default: 'javascript:void(0)'
        },
        variant: {
            type: String,
            default: 'primary'
        },
        center: {
            type: Boolean,
            default: false
        }
    },
    data () {
        return {
            isDisabled: false
        }
    },
    computed: {
        classes () {
            return {
                disabled: this.isDisabled,
                'button-primary': this.variant === 'primary',
                center: this.center
            }
        }
    },
    created () {
        this.isDisabled = this.disabled
    },
    methods: {
        onClick (event) {
            if (this.isDisabled) {
                event.preventDefault()
            }
            this.$emit('click', event)
        }
    }
}
</script>

<style lang="scss" scoped>
.button{
    @apply px-6 py-2.5 m-2 font-medium text-xs leading-tight rounded shadow-md select-none;
    @apply transition duration-150 ease-in-out;

    &:not(.disabled){
        @apply hover:shadow-lg focus:shadow-lg active:shadow-lg;
    }
    &.disabled{
        @apply opacity-60 cursor-not-allowed;
    }
}
.button-primary{
    @apply bg-blue-500 text-white;

    &:not(.disabled){
        @apply hover:bg-blue-600 focus:bg-blue-600 active:bg-blue-700;
    }
}
</style>
