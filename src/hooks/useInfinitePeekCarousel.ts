import { useCallback, useEffect, useMemo, useRef, useState } from "react";

/** Defer state updates so eslint react-hooks/set-state-in-effect allows layout reads. */
function scheduleCarouselState(update: () => void): void {
  requestAnimationFrame(update);
}

function positionToRealIndex(position: number, itemCount: number): number {
  if (position === 0) {
    return itemCount - 1;
  }
  if (position === itemCount + 1) {
    return 0;
  }
  return position - 1;
}

type UseInfinitePeekCarouselOptions = {
  activeIndex?: number;
  onActiveIndexChange?: (index: number) => void;
};

export function useInfinitePeekCarousel<T>(
  items: T[],
  options?: UseInfinitePeekCarouselOptions
) {
  const trackRef = useRef<HTMLDivElement>(null);
  const lastReportedIndexRef = useRef(-1);
  const positionRef = useRef(0);
  const activeIndexRef = useRef(options?.activeIndex);

  const [position, setPosition] = useState(0);
  const [slideStepPx, setSlideStepPx] = useState(0);
  const [enableTransition, setEnableTransition] = useState(true);

  const itemCount = items.length;
  const useInfiniteLoop = itemCount >= 2;

  const loopItems = useMemo(() => {
    if (!useInfiniteLoop) {
      return items;
    }
    const last = items[itemCount - 1]!;
    const first = items[0]!;
    return [last, ...items, first];
  }, [items, itemCount, useInfiniteLoop]);

  const reportIndex = useCallback(
    (index: number): void => {
      if (!options?.onActiveIndexChange) {
        return;
      }
      if (lastReportedIndexRef.current === index) {
        return;
      }
      lastReportedIndexRef.current = index;
      options.onActiveIndexChange(index);
    },
    [options]
  );

  const updateSlideStep = useCallback((): void => {
    const track = trackRef.current;
    if (!track || !useInfiniteLoop || track.children.length < 3) {
      setSlideStepPx(0);
      return;
    }

    const firstReal = track.children[1] as HTMLElement;
    const secondReal = track.children[2] as HTMLElement;
    setSlideStepPx(secondReal.offsetLeft - firstReal.offsetLeft);
  }, [useInfiniteLoop]);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      updateSlideStep();
    });
    window.addEventListener("resize", updateSlideStep);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", updateSlideStep);
    };
  }, [updateSlideStep, loopItems]);

  useEffect(() => {
    activeIndexRef.current = options?.activeIndex;
  }, [options?.activeIndex]);

  useEffect(() => {
    const startIndex =
      activeIndexRef.current != null
        ? Math.min(activeIndexRef.current, Math.max(itemCount - 1, 0))
        : 0;
    scheduleCarouselState(() => {
      setEnableTransition(true);
      lastReportedIndexRef.current = startIndex;
      setPosition(useInfiniteLoop ? startIndex + 1 : 0);
    });
  }, [items, itemCount, useInfiniteLoop]);

  useEffect(() => {
    positionRef.current = position;
  }, [position]);

  useEffect(() => {
    if (!useInfiniteLoop || options?.activeIndex == null) {
      return;
    }
    const targetIndex = Math.min(options.activeIndex, itemCount - 1);
    if (targetIndex === lastReportedIndexRef.current) {
      return;
    }
    lastReportedIndexRef.current = targetIndex;
    scheduleCarouselState(() => {
      setEnableTransition(false);
      setPosition(targetIndex + 1);
    });
  }, [options?.activeIndex, itemCount, useInfiniteLoop]);

  useEffect(() => {
    if (enableTransition) {
      return;
    }
    const frame = requestAnimationFrame(() => {
      requestAnimationFrame(() => setEnableTransition(true));
    });
    return () => cancelAnimationFrame(frame);
  }, [enableTransition, position]);

  const handleTransitionEnd = useCallback((): void => {
    if (!useInfiniteLoop) {
      return;
    }

    const current = positionRef.current;
    if (current === 0) {
      setEnableTransition(false);
      setPosition(itemCount);
      reportIndex(itemCount - 1);
      return;
    }
    if (current === itemCount + 1) {
      setEnableTransition(false);
      setPosition(1);
      reportIndex(0);
      return;
    }
    reportIndex(positionToRealIndex(current, itemCount));
  }, [itemCount, reportIndex, useInfiniteLoop]);

  const nextSlide = useCallback((): void => {
    setEnableTransition(true);
    setPosition((prev) => prev + 1);
  }, []);

  const prevSlide = useCallback((): void => {
    setEnableTransition(true);
    setPosition((prev) => prev - 1);
  }, []);

  const goToIndex = useCallback(
    (index: number): void => {
      if (!useInfiniteLoop) {
        return;
      }
      const safeIndex = Math.min(index, itemCount - 1);
      const currentReal = positionToRealIndex(positionRef.current, itemCount);
      if (currentReal === safeIndex) {
        return;
      }
      setEnableTransition(true);
      setPosition(safeIndex + 1);
      reportIndex(safeIndex);
    },
    [itemCount, reportIndex, useInfiniteLoop]
  );

  const translateX =
    useInfiniteLoop && slideStepPx > 0 ? -(position * slideStepPx) : 0;

  const realIndex = useInfiniteLoop
    ? positionToRealIndex(position, itemCount)
    : 0;

  return {
    trackRef,
    loopItems,
    useInfiniteLoop,
    itemCount,
    slideStepPx,
    enableTransition,
    translateX,
    handleTransitionEnd,
    nextSlide,
    prevSlide,
    goToIndex,
    updateSlideStep,
    realIndex,
  };
}
