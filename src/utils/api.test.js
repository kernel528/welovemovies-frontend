import { listTheaters } from "./api";

afterEach(() => {
  delete global.fetch;
});

test("requests theaters from the configured API and returns response data", async () => {
  const theaters = [{ theater_id: 1, name: "Regal City Center" }];
  global.fetch = jest.fn().mockResolvedValue({
    status: 200,
    json: jest.fn().mockResolvedValue({ data: theaters }),
  });

  await expect(listTheaters()).resolves.toEqual(theaters);
  expect(global.fetch).toHaveBeenCalledWith(
    new URL("http://localhost:5001/theaters"),
    expect.objectContaining({ headers: expect.any(Headers) })
  );
});
