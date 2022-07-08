
export interface IAction<T = {}, S = undefined> {
	type: string
	payLoad: T
	other: S
}

export interface IRootState {
    test: string
	cacheRoute: Map<string, any>
}