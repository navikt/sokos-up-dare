export type FetchState<T> =
	| { status: "idle" }
	| { status: "loading" }
	| { status: "error"; error: string }
	| { status: "success"; data: T };
