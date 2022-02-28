<template>
    <div class="copy-box" @click="copy">
        <fa-icon type="solid" icon="clone" class="copy" />
        <div class="hidden">
            <slot ref="content" class="copy-content" />
        </div>
    </div>
</template>

<script>
import Swal from 'sweetalert2'
export default {
    mounted () {
        this.$alert = Swal.mixin({
            toast: true,
            position: 'top',
            showConfirmButton: false,
            timer: 1500,
            timerProgressBar: true
        })
    },
    methods: {
        copy () {
            let content = this.$slots.default[0].text
            this.$copyText(content).then(() => {
                this.$alert.fire('内容已复制')
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.copy-box{
    @apply cursor-pointer inline-block text-gray-400;
    @apply dark:text-gray-600;
    font-size: 75%;
}
</style>
