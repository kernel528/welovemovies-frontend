import { listTheaters } from "./api";
import { vi } from "vitest";

afterEach(() => {
  delete global.fetch;
  vi.restoreAllMocks();
});

test("requests theaters from the configured API and returns response data", async () => {
  const theaters = [{ theater_id: 1, name: "Regal City Center" }];
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    status: 200,
    json: vi.fn().mockResolvedValue({ data: theaters }),
  });

  await expect(listTheaters()).resolves.toEqual(theaters);
  expect(global.fetch).toHaveBeenCalledWith(
    new URL("http://localhost:5001/theaters"),
    expect.objectContaining({ headers: expect.any(Headers) })
  );
});

test("rejects a failed API response", async () => {
  vi.spyOn(console, "error").mockImplementation(() => {});
  global.fetch = vi.fn().mockResolvedValue({
    ok: false,
    status: 503,
    json: vi.fn().mockResolvedValue({ error: "Theaters are unavailable." }),
  });

  await expect(listTheaters()).rejects.toThrow("Theaters are unavailable.");
});
