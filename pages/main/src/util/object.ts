import { isBoolean, isFunction } from 'lodash'

export interface IObjectHookRule {
    [key: string]: IObjectHookRuleInfo
}

export interface IObjectHookRuleInfo {
    get?: () => boolean | void | any
    set: () => boolean | void | any
}

export interface IObjectInfo {
    [key: string]: boolean | number | string | null | undefined | any
}

// 对象属性拦截器类
export class ObjectPropertyHook {
    object = {}
    ruleMap = new Map<string, IObjectHookRuleInfo>() // 拦截规则

    constructor(object: IObjectInfo, rules?: IObjectHookRule) {
        // console.log(`object.ts ObjectPropertyHook init`, object, rules)
        this.update(object, rules)
    }

    update(object: IObjectInfo, rules: IObjectHookRule) {
        this.updateObject(object)
        this.updateRule(rules)
    }

    updateObject(object: IObjectInfo) {
        this.setObject(object)
        this.observeObject()
    }

    updateRule(rules: IObjectHookRule, clear?: boolean) {
        if (clear) {
            this.clearMap()
        }
        this.updateRuleMap(rules)
    }

    clear() {
        this.clearMap()
    }

    private clearMap() {
        this.ruleMap.clear()
    }

    private updateRuleMap(rules: IObjectHookRule) {
        if (Object.prototype.toString.call(rules) !== '[object Object]') {
            return
        }
        Object.keys(rules).forEach((key) => {
            this.ruleMap.set(key, rules[key])
        })
    }

    private setObject(object) {
        this.object = object
    }

    private observeObject() {
        this.observe(this.object)
    }

    private observe(data, parentKey = '') {
        if (Object.prototype.toString.call(data) !== '[object Object]') {
            return
        }
        Object.keys(data).forEach((key) => {
            this.defineProperty(data, key, data[key], parentKey)
        })
    }

    private defineProperty(data, key, value, parentKey) {
        const path = `${parentKey ? `${parentKey}.` : ''}${key}`
        // console.log(`object.ts ObjectPropertyHook defineProperty path=${path}`)
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const self = this
        self.observe(value, path)
        try {
            Object.defineProperty(data, key, {
                set: (newVal) => {
                    const rule = self.ruleMap.get(path)
                    if (rule && isFunction(rule.set) && rule.set() !== undefined) {
                        const ruleValue = rule.set()
                        if (isBoolean(ruleValue) && !ruleValue) {
                            return
                        }
                        // eslint-disable-next-line no-param-reassign
                        value = ruleValue
                    }
                    // eslint-disable-next-line no-param-reassign
                    value = newVal
                },
                get: () => {
                    const rule = self.ruleMap.get(path)
                    if (rule && isFunction(rule.get) && rule.get() !== undefined) {
                        const ruleValue = rule.get()
                        return ruleValue
                    }
                    return value
                },
                enumerable: true,
                configurable: false,
            })
        } catch (err) {
            console.error(`object.ts ObjectPropertyHook defineProperty error`, err)
        }
    }
}
