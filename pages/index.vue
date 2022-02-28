<template>
    <div class="page-main mt-4">
        <form @submit.prevent="onQuery">
            <form-input v-model="item" class="mt-2 mb-3" placeholder="在此输入物品名称或ID" autofocus />
            <div class="flex flex-col items-center">
                <a-button ref="submit" class="inline-block" :disabled="true" @click="onQuery">
                    查询
                    <fa-icon v-show="searching" type="duotone" icon="spinner-third" spinner />
                </a-button>
            </div>
        </form>
        <transition name="fade">
            <alert v-show="showAlert" ref="alert">
                {{ alertMessage }}
            </alert>
        </transition>
        <transition name="fade">
            <div v-if="searchResultSize > 0 && itemResult === null" class="text-base">
                <hr class="my-2">
                <p class="para-title">
                    搜索到以下物品
                </p>
                <ul>
                    <li v-for="result in searchResult" :key="result[0]" class="search-item">
                        <a href="javascript:void(0)" :title="result[1].name" @click="showItemInfo(result[0])">
                            {{ result[1].name }}
                        </a>
                    </li>
                </ul>
                <hr class="mt-2 mb-4">
            </div>
        </transition>
        <transition name="fade">
            <div v-if="itemResult !== null" class="text-base">
                <hr class="my-2">
                <a v-show="searchResultSize > 0" href="javascript:void(0)" @click="showSearchResult()">
                    <fa-icon type="solid" icon="arrow-left" />
                    返回搜索结果
                </a>
                <p class="para-title">
                    物品信息
                </p>
                <div>
                    <p>
                        {{ itemResult.name }}
                        <copy>{{ itemResult.name }}</copy>
                    </p>
                    <p>
                        <code>{{ itemResult.id }}</code>
                        <copy>{{ itemResult.id }}</copy>
                    </p>
                </div>

                <p class="para-title">
                    配方
                </p>
                <p class="mb-2">
                    该配方类型为 <span v-html="recipeTypeDisplay" />
                </p>
                <table class="table recipe-table">
                    <tr v-for="(row, rowKey) in recipeDisplay" :key="rowKey">
                        <td v-for="(col, colKey) in row" :key="colKey">
                            {{ col != null ? col : '&nbsp;' }}
                        </td>
                    </tr>
                </table>
                <div class="mt-2">
                    <p v-for="(recipeItem, key) in recipes" :key="key">
                        {{ String.fromCharCode('A'.charCodeAt(0) + key) }} =
                        <a v-if="recipeItem.searchable" href="javascript:void(0)" @click="searchItem(recipeItem.material, true)">
                            {{ recipeItem.name }}
                        </a>
                        <span v-else>{{ recipeItem.name }}</span>
                        <span v-if="recipeItem.amount !== undefined">
                            * {{ recipeItem.amount }}
                        </span>
                    </p>
                </div>

                <hr class="my-2">
                <p class="para-title">
                    材料计算
                </p>
                <hr class="mt-2 mb-4">
            </div>
        </transition>
    </div>
</template>

<script>
import _ from 'lodash'
export default {
    layout: 'main',
    data () {
        return {
            item: '',
            itemsLoaded: false,
            itemsJson: [],
            recipesJson: {},
            searching: false,
            showAlert: false,
            alertType: 'primary',
            alertMessage: '',
            searchResult: [],
            cachedResult: {},
            itemResult: null,
            recipeTypeDisplay: '',
            recipeDisplay: [],
            recipes: {}
        }
    },
    computed: {
        searchResultSize () {
            return _.size(this.searchResult)
        }
    },
    created () {
    },
    mounted () {
        window.addEventListener('popstate', this.routeChange)

        this.item = this.$route.query.item
        if (this.item === undefined) {
            this.item = ''
        }

        this.$axios.get('/recipeType.json').then((response) => {
            this.recipesJson = response.data
        }).catch((error) => {
            console.error('无法加载配方列表', error)
        })
        this.$axios.get('/items.json').then((response) => {
            this.itemsJson = response.data
            this.itemsLoaded = true
            this.$refs.submit.isDisabled = false

            if (this.item !== '') {
                this.onQuery()
            }
        }).catch((error) => {
            this.$refs.submit.isDisabled = true
            console.error('无法加载物品列表', error)
            this.alert('danger', '无法加载物品列表')
        })
    },
    methods: {
        onQuery () {
            if (!this.itemsLoaded || this.searching) {
                return
            }
            this.$refs.submit.isDisabled = true
            this.searching = true

            this.search()

            this.searching = false
            this.$refs.submit.isDisabled = false
        },
        searchItem (item, inRecipe) {
            this.item = item
            if (inRecipe) {
                this.updateRoute(item)
            }
            this.onQuery()
        },
        search () {
            this.alert()
            this.itemResult = null

            let search = this.item.trim()
            if (search === '') {
                this.alert('warning', '请输入物品名称或ID')
                return
            }

            let idMode = false

            let specialCases = ['GPS']
            // 是否为 ID
            if (search.match(/^[0-9a-zA-Z_]+$/) && !_.includes(specialCases, search)) {
                idMode = true
                search = search.toUpperCase()
            }

            let searchResult = []
            if (search in this.cachedResult) {
                searchResult = this.cachedResult[search]
            } else {
                _.forEach(this.itemsJson, (item, key) => {
                    // 禁用的搜索配方
                    if (this?.recipesJson[item.recipeType]?.disableInSearch) {
                        return true
                    }
                    if (idMode) {
                        if (item.id === search) {
                            searchResult.push([key, item])
                            return false
                        }
                    } else if (_.includes(item.name, search)) {
                        searchResult.push([key, item])
                    }
                })
            }
            this.searchResult = searchResult

            if (this.searchResultSize === 0) {
                this.alert('danger', '没有任何结果。如果你输入的是ID，请确保ID是完整的')
            } else if (this.searchResultSize === 1) {
                this.searchResult = null
                this.showItemInfo(searchResult[0][0])
            } else {
                this.showSearchResult()
            }
        },
        alert (type, message) {
            if (type === undefined) {
                this.showAlert = false
                return
            }
            this.showAlert = true
            this.$refs.alert.setType(type)
            this.alertMessage = message
        },
        showSearchResult () {
            this.itemResult = null
        },
        showItemInfo (key) {
            this.itemResult = this.itemsJson[key]
            this.displayRecipe()
        },
        displayRecipe () {
            // recipe type
            let recipeType = this.itemResult.recipeType
            if (!!this.recipesJson && recipeType in this.recipesJson) {
                let recipe = this.recipesJson[recipeType]
                let recipeLink = recipe.link
                if (!recipeLink) {
                    this.recipeTypeDisplay = `<span>${recipe.name}</span>`
                } else {
                    this.recipeTypeDisplay = `<a href="${recipeLink}" target="_blank">${recipe.name}</a>`
                }
            } else {
                this.recipeTypeDisplay = `<code>${recipeType}</code>`
            }

            // recipe
            let recipe = this.itemResult.recipe
            let recipeDisplay = []
            let size = Math.sqrt(recipe.length)
            for (let i = 0; i < recipe.length; i += size) {
                recipeDisplay.push(recipe.slice(i, i + size))
            }
            let recipeMaterials = []
            let index = 0
            for (let i = 0; i < size; i++) {
                for (let j = 0; j < size; j++) {
                    if (recipeDisplay[i][j] == null) {
                        continue
                    }
                    let find = _.findIndex(recipeMaterials, (recipeItem) => {
                        if (recipeItem.material !== recipeDisplay[i][j].material) {
                            return false
                        }
                        if (recipeItem.amount === undefined) {
                            return true
                        }
                        return recipeItem.amount === recipeDisplay[i][j].amount
                    })
                    if (find === -1) {
                        recipeDisplay[i][j].searchable = false
                        // 搜索该物品是否属于配方
                        _.forEach(this.itemsJson, (item) => {
                            // 禁用的搜索配方
                            if (this?.recipesJson[item.recipeType]?.disableInSearch) {
                                return true
                            }
                            if (item.id === recipeDisplay[i][j].material) {
                                recipeDisplay[i][j].searchable = true
                                return false
                            }
                        })

                        recipeMaterials.push(recipeDisplay[i][j])
                        recipeDisplay[i][j] = index++
                    } else {
                        recipeDisplay[i][j] = find
                    }
                }
            }

            // recipe display
            let baseKey = 'A'.charCodeAt(0)
            for (let i = 0; i < size; i++) {
                for (let j = 0; j < size; j++) {
                    if (recipeDisplay[i][j] != null) {
                        recipeDisplay[i][j] = String.fromCharCode(baseKey + recipeDisplay[i][j])
                    }
                }
            }

            this.recipeDisplay = recipeDisplay
            this.recipes = recipeMaterials
        },
        updateRoute (item) {
            this.$router.push({ query: { item } })
        },
        routeChange (e) {
            if (this.$route.query.item !== this.item) {
                this.searchItem(this.$route.query.item)
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.para-title{
    @apply text-lg my-3 font-bold;
}
.search-item{
    @apply px-1 w-full;

    &::before{
        content: "-";
        @apply pr-1;
    }
}
.table{
    @apply border w-full text-center;
    tr {
        td {
            @apply border;
        }
    }
}
.recipe-table{
    @apply table-fixed;
}
</style>
