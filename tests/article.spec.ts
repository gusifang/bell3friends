import { expect, test } from "@playwright/test";
test("chapter deep links, rules, and interactive classical proof", async ({
  page,
}) => {
  await page.goto("/classical");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Three friends",
  );
  const toggle = page.getByRole("button", { name: "A.X", exact: true });
  await toggle.focus();
  await page.keyboard.press("Enter");
  await expect(toggle).toHaveText("−1");
  await page.getByRole("button", { name: "Multiply all four rows" }).click();
  await expect(page.getByTestId("proof-description")).toContainText(
    "six pairs",
  );
  const proof = page.locator(".proof");
  await proof.getByRole("button", { name: "Next step", exact: true }).click();
  await expect(page.getByTestId("proof-description")).toContainText(
    "Each pair contributes +1",
  );
  await proof.getByRole("button", { name: "Next step", exact: true }).click();
  await expect(proof.getByText("+1 ≠ −1", { exact: true })).toBeVisible();
  await proof.getByRole("button", { name: "Step back" }).click();
  await proof.getByRole("button", { name: "Replay proof" }).click();
  await expect(page.getByTestId("proof-description")).toContainText("Twelve");
  await proof.getByText("Read the static proof").click();
  await expect(proof.getByText(/Multiplying the four left-hand/)).toBeVisible();
  await page
    .getByRole("navigation", { name: "Chapters", exact: true })
    .getByRole("link", { name: /quantum trick/ })
    .click();
  await expect(page).toHaveURL(/quantum/);
  await page.reload();
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "extraordinary",
  );
});
test("quantum playback, replay, batches, discard, and reset", async ({
  page,
}) => {
  test.setTimeout(60000);
  await page.goto("/quantum");
  await page.getByLabel("Speed", { exact: true }).selectOption("40");
  await page.getByRole("button", { name: "Run 20", exact: true }).click();
  await expect(page.getByTestId("count-total")).toHaveText("20", {
    timeout: 15000,
  });
  await expect(page.getByTestId("count-failures")).toHaveText("0");
  await page.getByRole("button", { name: "Replay same round" }).click();
  await expect(page.locator(".transcript")).toContainText(
    "Replay (not counted again)",
  );
  await expect(page.getByTestId("count-total")).toHaveText("20");
  await expect(page.getByTestId("cheating-arrow")).toHaveCount(0);
  await page.getByRole("button", { name: "Run 200", exact: true }).click();
  await expect(page.getByTestId("count-total")).toHaveText("220", {
    timeout: 45000,
  });
  await expect(page.getByTestId("count-failures")).toHaveText("0");
  await page.getByRole("button", { name: "Reset", exact: true }).click();
  await expect(page.getByTestId("count-total")).toHaveText("0");
  await page.getByText("Explore a combination & reproducible settings").click();
  await page.getByLabel("Explore setting").selectOption("YYY");
  await page
    .getByRole("button", { name: "Explore a combination", exact: true })
    .click();
  await expect(page.locator(".transcript")).toContainText("Discarded");
  await expect(page.getByTestId("count-discarded")).toHaveText("1");
  await expect(page.getByTestId("count-passes")).toHaveText("0");
  await expect(page.getByTestId("pass-rate")).toHaveText("—");
});
test("pause cancels pending progress; reset and navigation cancel batches", async ({
  page,
}) => {
  await page.goto("/quantum");
  await page.getByRole("button", { name: "Run 200", exact: true }).click();
  await page.getByRole("button", { name: "Pause", exact: true }).click();
  const stage = await page.locator(".stage-readout").textContent();
  await page.waitForTimeout(650);
  expect(await page.locator(".stage-readout").textContent()).toBe(stage);
  await page.getByRole("button", { name: "Next step", exact: true }).click();
  expect(await page.locator(".stage-readout").textContent()).not.toBe(stage);
  await page.getByRole("button", { name: "Reset", exact: true }).click();
  await page.waitForTimeout(650);
  await expect(page.getByTestId("count-total")).toHaveText("0");
  await expect(
    page.getByRole("button", { name: "Resume", exact: true }),
  ).toBeDisabled();
  await page.getByRole("button", { name: "Run 200", exact: true }).click();
  await page
    .getByRole("navigation", { name: "Chapters", exact: true })
    .getByRole("link", { name: /experiment/ })
    .click();
  await expect(page.getByTestId("count-total")).toHaveText("0");
});
test("cheating shows an explicit late path and pauses before C answers", async ({
  page,
}) => {
  await page.goto("/cheating");
  await page.getByLabel("Allow a late message to C").check();
  await expect(page.getByTestId("cheating-arrow")).toHaveCount(1);
  await page.getByLabel("Speed", { exact: true }).selectOption("40");
  await page.getByRole("button", { name: "Run one", exact: true }).click();
  await expect(page.getByText("The decisive moment.")).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Resume", exact: true }),
  ).toBeEnabled();
  await page.getByRole("button", { name: "Next step", exact: true }).click();
  await expect(page.locator(".stage-readout")).toContainText("Deliver C");
  await page.getByRole("button", { name: "Remove late message" }).click();
  await expect(page.getByTestId("cheating-arrow")).toHaveCount(0);
  await expect(page.getByTestId("count-total")).toHaveText("0");
});
test("responsive layout, reduced motion, touch, and unified mode changes", async ({
  page,
  isMobile,
}, testInfo) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/experiment");
  const q = page.getByRole("button", { name: "Quantum", exact: true });
  if (isMobile) await q.tap();
  else await q.click();
  await expect(page.getByTestId("cheating-arrow")).toHaveCount(0);
  await page.getByRole("button", { name: "Timeline view" }).click();
  await expect(page.locator(".pipeline li")).toHaveCount(6);
  await page.getByRole("button", { name: "Triangle view" }).click();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({
    path: testInfo.outputPath("experiment.png"),
    fullPage: true,
  });
  await page.getByRole("button", { name: "Cheating", exact: true }).click();
  await expect(page.getByTestId("cheating-arrow")).toHaveCount(1);
  await page.getByRole("button", { name: "Classical", exact: true }).click();
  await expect(page.getByTestId("cheating-arrow")).toHaveCount(0);
});
