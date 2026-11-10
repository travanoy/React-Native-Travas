import { useCallback, useEffect, useRef, useState } from "react";

interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useApi<T>(
  request: (signal: AbortSignal) => Promise<T>,
  deps: readonly unknown[] = [],
) {
  const requestRef = useRef(request);
  const controllerRef = useRef<AbortController | null>(null);
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    requestRef.current = request;
  }, [request]);

  const run = useCallback(async () => {
    controllerRef.current?.abort();

    const controller = new AbortController();
    controllerRef.current = controller;

    await Promise.resolve();

    if (controller.signal.aborted) {
      return;
    }

    setState((prev) => ({ data: prev.data, loading: true, error: null }));

    try {
      const data = await requestRef.current(controller.signal);

      if (!controller.signal.aborted) {
        setState({ data, loading: false, error: null });
      }
    } catch (error) {
      if (!controller.signal.aborted) {
        setState({
          data: null,
          loading: false,
          error: error instanceof Error ? error.message : "Request failed",
        });
      }
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void run();

    return () => controllerRef.current?.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { ...state, refetch: run };
}
