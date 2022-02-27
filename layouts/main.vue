<template>
    <div class="page-wrapper">
        <div class="app-box">
            <card>
                <AppHeader />
                <nuxt />
                <AppFooter />
            </card>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.app-box{
    @apply w-full mx-auto py-4;
    max-width: 400px;
}
</style>
