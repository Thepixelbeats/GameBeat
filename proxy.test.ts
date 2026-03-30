import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { getTokenMock } = vi.hoisted(() => ({
  getTokenMock: vi.fn(),
}));

vi.mock("next-auth/jwt", () => ({
  getToken: getTokenMock,
}));

import { proxy } from "./proxy";

describe("proxy", () => {
  beforeEach(() => {
    getTokenMock.mockReset();
  });

  it("redirects unauthenticated protected routes to login with a callback", async () => {
    getTokenMock.mockResolvedValue(null);

    const response = await proxy(
      new NextRequest("https://gameflow.test/backlog?view=list")
    );

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe(
      "https://gameflow.test/login?callbackUrl=%2Fbacklog%3Fview%3Dlist"
    );
  });

  it("redirects unauthenticated dashboard requests without a callback param", async () => {
    getTokenMock.mockResolvedValue(null);

    const response = await proxy(
      new NextRequest("https://gameflow.test/dashboard")
    );

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe(
      "https://gameflow.test/login"
    );
  });

  it("redirects signed-in users away from login", async () => {
    getTokenMock.mockResolvedValue({ sub: "user_1" });

    const response = await proxy(new NextRequest("https://gameflow.test/login"));

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe(
      "https://gameflow.test/dashboard"
    );
  });
});
