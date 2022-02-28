<template>
    <span class="fa-icon" :class="iconClass" />
</template>
<script>
export default {
    name: 'FaIcon',
    props: {
        type: {
            type: String,
            default: 'regular'
        },
        icon: {
            type: String,
            default: ''
        },
        spinner: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        iconClass () {
            let classes = ['fa-' + this.icon]
            switch (this.type) {
            case 'solid':
                classes.push('fas')
                break
            case 'regular':
                classes.push('far')
                break
            case 'light':
                classes.push('fal')
                break
            case 'duotone':
                classes.push('fad')
                break
            case 'brands':
                classes.push('fab')
                break
            default:
                break
            }
            if (this.spinner) {
                classes.push('fa-spin')
            }
            return classes // _.join(classes, ' ')
        }
    }
}
</script>
