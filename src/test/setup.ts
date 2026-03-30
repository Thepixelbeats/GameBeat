import "@testing-library/jest-dom/vitest";

import { afterEach, vi } from "vitest";

class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

afterEach(async () => {
  if (typeof document !== "undefined") {
    const { cleanup } = await import("@testing-library/react");
    cleanup();
  }

  vi.useRealTimers();
});

vi.stubGlobal("ResizeObserver", ResizeObserver);
