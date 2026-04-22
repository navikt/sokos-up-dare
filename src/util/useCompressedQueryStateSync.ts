// src/util/useCompressedQueryStateSync.ts
import { compressToEncodedURIComponent } from "lz-string";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";

type Options = {
	key?: string;
	debounceMs?: number;
};

export function useCompressedQueryStateSync<T>(
	value: T,
	options: Options = {},
) {
	const { key = "state", debounceMs = 300 } = options;
	const location = useLocation();
	const navigate = useNavigate();

	useEffect(() => {
		const timeout = setTimeout(() => {
			try {
				const json = JSON.stringify(value);
				const compressed = compressToEncodedURIComponent(json);
				const params = new URLSearchParams(location.search);
				params.set(key, compressed);
				navigate({ search: params.toString() }, { replace: true });
			} catch {
				// ignore invalid/unserializable state
			}
		}, debounceMs);

		return () => clearTimeout(timeout);
	}, [value, key, debounceMs, location.search, navigate]);
}
