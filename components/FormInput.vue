<template>
    <input ref="input" v-model="inputVal" :type="type" class="form-input">
</template>

<script>
export default {
    props: {
        type: {
            type: String,
            default: 'text'
        },
        value: {
            type: [String, Number],
            default: ''
        }
    },
    computed: {
        inputVal: {
            get () {
                return this.value
            },
            set (val) {
                this.$emit('input', val)
            }
        }
    }
}
</script>

<style lang="scss">
.form-input{
    @apply block w-full px-0.5 border-0 border-b-2 border-gray-200 outline-0 bg-transparent;
    @apply focus:ring-0 focus:border-gray-800 hover:border-gray-400;
    @apply dark:border-gray-700 dark:hover:border-gray-600 dark:focus:border-gray-400;
}
</style>
