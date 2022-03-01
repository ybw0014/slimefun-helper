<template>
    <div class="page-main mt-4">
        <form @submit.prevent="onQuery">
            <form-input v-model="item" class="mt-2 mb-3" placeholder="在此输入物品名称或ID" autofocus />
            <div class="flex flex-col items-center">
                <a-button ref="search" class="inline-block" :disabled="true" @click="onQuery">
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
                        <a href="javascript:void(0)" :title="result[1].name" @click="searchItem(result[1].id, true)">
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
                <a href="javascript:history.go(-1)">
                    <fa-icon type="solid" icon="arrow-left" />
                    返回上一页
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
                <form @submit.prevent="onCalc">
                    <p>在下方输入计算数量:</p>
                    <form-input v-model="amount" type="number" min="1" class="mt-2 mb-3" placeholder="计算数量" />
                    <div class="flex flex-col items-center">
                        <a-button ref="submit" class="inline-block" :disabled="calculating" @click="onCalc">
                            计算
                            <fa-icon v-show="calculating" type="duotone" icon="spinner-third" spinner />
                        </a-button>
                    </div>
                </form>
                <div v-if="calcDisplay !== null">
                    <p class="para-title">
                        所需材料
                    </p>
                    <table class="table calc-table">
                        <tr v-for="(recipeItem, key) in calcDisplay" :key="key">
                            <td>
                                <a v-if="recipeItem.id !== undefined" href="javascript:void(0)" @click="searchItem(recipeItem.id, true)">
                                    {{ recipeItem.name }}
                                </a>
                                <span v-else>
                                    {{ recipeItem.name }}
                                </span>
                            </td>
                            <td>
                                {{ recipeItem.amount }}
                            </td>
                        </tr>
                    </table>
                </div>
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
            itemSettingsJson: {},
            searching: false,
            showAlert: false,
            alertType: 'primary',
            alertMessage: '',
            searchResult: [],
            cachedResult: {},
            itemResult: null,
            recipeTypeDisplay: '',
            recipeDisplay: [],
            recipes: {},
            //
            amount: 1,
            calculating: false,
            calcResult: {},
            calcDict: {},
            calcDisplay: null
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

        /* eslint-disable no-console */
        this.$axios.get('/recipeType.json').then((response) => {
            this.recipesJson = response.data
        }).catch((error) => {
            console.error('无法加载配方列表', error)
        })

        this.$axios.get('/itemSettings.json').then((response) => {
            this.itemSettingsJson = response.data
        }).catch((error) => {
            console.error('无法加载物品设置列表', error)
        })

        this.$axios.get('/items.json').then((response) => {
            this.itemsJson = response.data
            this.itemsLoaded = true
            this.$refs.search.isDisabled = false
        }).catch((error) => {
            this.$refs.search.isDisabled = true
            console.error('无法加载物品列表', error)
            this.alert('danger', '无法加载物品列表')
        }).then(() => {
            if (!_.isEmpty(this.item)) {
                this.onQuery()
            }
        })
        /* eslint-enable no-console */
    },
    methods: {
        searchItem (item, inRecipe) {
            this.item = item
            this.onQuery(inRecipe)
        },
        onQuery (updateRoute) {
            if (!this.itemsLoaded || this.searching) {
                return
            }
            this.$refs.search.isDisabled = true
            this.searching = true

            if (updateRoute) {
                this.updateRoute(this.item)
            }

            this.search()
            this.calcDisplay = null

            this.searching = false
            this.$refs.search.isDisabled = false
        },
        search () {
            this.alert()
            this.itemResult = null

            let search = this.item?.trim()
            if (_.isEmpty(search)) {
                this.alert('warning', '请输入物品名称或ID')
                return
            }

            let idMode = false

            let specialCases = ['GPS', 'UU']
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
                    // 禁用的物品
                    if (this?.itemSettingsJson[item.id]?.disable) {
                        return true
                    }
                    // 禁用的物品前缀
                    let prefixs = this?.itemSettingsJson?.settings?.disabledItemPrefix
                    for (const i in prefixs) {
                        if (item.id.startsWith(prefixs[i])) {
                            return true
                        }
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
                this.alert('danger', '没有任何结果。物品可能不存在或已被列入黑名单中。如果你输入的是ID，请确保ID是完整的。')
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
        },
        onCalc () {
            // limit
            if (this.amount < 1) {
                this.amount = 1
            }

            this.calculating = true
            this.calc().then(() => {
                this.calculating = false
                console.log('Done')
            })
        },
        calc () {
            return new Promise(() => {
                // calc
                this.calcResult = {}

                if (!(this.itemResult.id in this.calcDict)) {
                    this.calcDict[this.itemResult.id] = this.itemResult.name
                }
                this.addToCalcResult(this.itemResult.id)

                let nextItem
                while (true) {
                    nextItem = this.findNextItem()
                    if (nextItem == null) {
                        break
                    }

                    let amount = this.calcResult[nextItem.id]
                    this.addToCalcResult(nextItem.id, -amount)
                    _.forEach(nextItem.recipe, (recipeItem) => {
                        if (recipeItem == null) {
                            return true
                        }
                        if (!(recipeItem.material in this.calcDict)) {
                            this.calcDict[recipeItem.material] = recipeItem.name
                        }
                        let recipeAmount = recipeItem.amount
                        if (recipeAmount === undefined) {
                            recipeAmount = 1
                        }
                        this.addToCalcResult(recipeItem.material, recipeAmount * amount)
                    })
                }

                // filter result
                this.calcResult = _.omitBy(this.calcResult, (n) => { return n === 0 })

                this.calcDisplay = []

                _.forEach(this.calcResult, (amount, recipeItem) => {
                    let currItem = null
                    _.forEach(this.itemsJson, (item) => {
                        if (item.id === recipeItem) {
                            currItem = item
                            return false
                        }
                    })
                    if (currItem === null) {
                        this.calcDisplay.push({
                            name: this.calcDict[recipeItem],
                            amount: amount * this.amount
                        })
                    } else {
                        this.calcDisplay.push({
                            name: currItem.name,
                            id: currItem.id,
                            amount: amount * this.amount
                        })
                    }
                })

                this.calculating = false
            })
        },
        findNextItem () {
            let result = null
            _.forEach(this.calcResult, (recipeAmount, recipeItem) => {
                _.forEach(this.itemsJson, (item) => {
                    if (item.id === recipeItem &&
                        recipeAmount > 0 &&
                        !(this?.recipesJson[item.recipeType]?.disableInCalc) &&
                        !(this?.itemSettingsJson[item.id]?.disableInCalc)
                    ) {
                        result = item
                        return false
                    }
                })
                if (result !== null) {
                    return false
                }
            })
            return result
        },
        addToCalcResult (key, amount) {
            if (amount === undefined) {
                amount = 1
            }
            if (key in this.calcResult) {
                this.calcResult[key] += amount
            } else {
                this.calcResult[key] = amount
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
