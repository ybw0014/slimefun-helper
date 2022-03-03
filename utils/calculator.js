/**
 * 算法来自SFCalc-Online
 * https://github.com/Seggan/SFCalc-Online
 */

import _ from 'lodash'

let items, recipes, itemSettings

export default {
    init (itemsJson, recipesJson, itemSettingsJson) {
        items = itemsJson
        recipes = recipesJson
        itemSettings = itemSettingsJson
    },
    calc (item) {
        return new Promise((resolve, reject) => {
            // calc
            let calcResult = {}
            let calcDict = {}

            calcDict[item.id] = item.name
            calcResult[item.id] = 1

            let nextItem
            while (true) {
                nextItem = this.findNextItem(calcResult)
                if (nextItem == null) {
                    break
                }

                let amount = calcResult[nextItem.id]
                calcResult[nextItem.id] -= amount
                _.forEach(nextItem.recipe, (recipeItem) => {
                    if (recipeItem == null) {
                        return true
                    }
                    if (!(recipeItem.material in calcDict)) {
                        calcDict[recipeItem.material] = recipeItem.name
                    }
                    let recipeAmount = _.defaultTo(recipeItem.amount, 1) * amount

                    if (recipeItem.material in calcResult) {
                        calcResult[recipeItem.material] += recipeAmount
                    } else {
                        calcResult[recipeItem.material] = recipeAmount
                    }
                })
            }

            // filter result
            calcResult = _.omitBy(calcResult, (n) => { return n === 0 })
            resolve({ calcResult, calcDict })
        })
    },
    findNextItem (calcResult) {
        let result = null
        _.forEach(calcResult, (recipeAmount, recipeItem) => {
            _.forEach(items, (item) => {
                if (item.id === recipeItem &&
                    recipeAmount > 0 &&
                    !(recipes[item.recipeType]?.disableInCalc) &&
                    !(itemSettings[item.id]?.disableInCalc)
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
    }
}
