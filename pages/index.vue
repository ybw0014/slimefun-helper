<template>
    <div class="page-main mt-4">
        <form @submit.prevent="onQuery">
            <FormInput v-model="item" class="mt-2 mb-3" placeholder="在此输入物品名称或ID" />
            <div class="flex flex-col items-center">
                <AButton ref="submit" class="inline-block" @click="onQuery">
                    查询
                </AButton>
            </div>
        </form>
        <transition name="fade">
            <Alert ref="alert" v-show="showAlert">
                {{ alertMessage }}
            </Alert>
        </transition>
            <div v-show="searching">
                正在搜索
            </div>
    </div>
</template>

<script>
export default {
    layout: 'main',
    data () {
        return {
            item: '',
            itemsLoaded: false,
            itemsJson: [],
            searching: false,
            showAlert: false,
            alertType: 'primary',
            alertMessage: ''
        }
    },
    mounted () {
        this.$axios.get('/items.json').then((response) => {
            this.itemsJson = JSON.parse(response.data)
            this.itemsLoaded = true
        }).catch(() => {
            this.$refs.submit.isDisabled = true
            this.alert('danger', '无法加载物品列表')
        })
    },
    methods: {
        onQuery () {
            if (this.searching) {
                return
            }
            this.$refs.submit.isDisabled = true
            this.search()
            this.$refs.submit.isDisabled = false
        },
        search () {
            this.searching = true
        },
        alert (type, message) {
            this.showAlert = true
            this.$refs.alert.setType(type)
            this.alertMessage = message
        }
    }
}
</script>
