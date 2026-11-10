import type { PagedResult } from "@/types/anime-types";
import { useCallback, useEffect, useRef, useState } from "react";

interface PaginationState<T> {
  items: T[];
  loading: boolean;
  loadingMore: boolean;
  refreshing: boolean;
  error: string | null;
  hasNext: boolean;
  page: number;
}

/**
 * Универсальный infinite-scroll: грузит первую страницу, дальше — по onEndReached.
 * При смене `deps` список сбрасывается и грузится заново.
 */
export function usePagination<T>(
  fetcher: (page: number, signal: AbortSignal) => Promise<PagedResult<T>>,
  deps: readonly unknown[] = [],
  enabled = true,
) {
  const fetcherRef = useRef(fetcher);
  const controllerRef = useRef<AbortController | null>(null);
  const [state, setState] = useState<PaginationState<T>>({
    items: [],
    loading: true,
    loadingMore: false,
    refreshing: false,
    error: null,
    hasNext: false,
    page: 0,
  });
  const stateRef = useRef(state);
  stateRef.current = state;

  useEffect(() => {
    fetcherRef.current = fetcher;
  }, [fetcher]);

  const loadFirstPage = useCallback(async () => {
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;

    const current = stateRef.current;
    setState({
      ...current,
      loading: current.items.length === 0,
      refreshing: current.items.length > 0,
      loadingMore: false,
      error: null,
    });

    try {
      const result = await fetcherRef.current(1, controller.signal);

      if (!controller.signal.aborted) {
        setState({
          items: result.items,
          loading: false,
          loadingMore: false,
          refreshing: false,
          error: null,
          hasNext: result.hasNext,
          page: result.page,
        });
      }
    } catch (error) {
      if (!controller.signal.aborted) {
        setState((prev) => ({
          ...prev,
          loading: false,
          loadingMore: false,
          refreshing: false,
          error: error instanceof Error ? error.message : "Request failed",
        }));
      }
    }
  }, []);

  const loadMore = useCallback(async () => {
    const current = stateRef.current;

    if (current.loading || current.loadingMore || !current.hasNext) {
      return;
    }

    setState((prev) => ({ ...prev, loadingMore: true }));

    try {
      const result = await fetcherRef.current(
        current.page + 1,
        controllerRef.current?.signal as AbortSignal,
      );

      setState((prev) => ({
        ...prev,
        items: [...prev.items, ...result.items],
        page: result.page,
        hasNext: result.hasNext,
        loadingMore: false,
        error: null,
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        loadingMore: false,
        error: error instanceof Error ? error.message : "Request failed",
      }));
    }
  }, []);

  useEffect(() => {
    if (!enabled) {
      controllerRef.current?.abort();
      setState({
        items: [],
        loading: false,
        loadingMore: false,
        refreshing: false,
        error: null,
        hasNext: false,
        page: 0,
      });
      return;
    }

    void loadFirstPage();
    return () => controllerRef.current?.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, enabled]);

  return { ...state, refetch: loadFirstPage, loadMore };
}
