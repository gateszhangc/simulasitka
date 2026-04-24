const { test, expect } = require("@playwright/test");

test.describe("Simulasi TKA site", () => {
  test("desktop homepage renders SEO and selector states", async ({ page }) => {
    await page.goto("/");

    await expect(page).toHaveTitle(/Simulasi TKA/i);
    await expect(page.locator("html")).toHaveAttribute("lang", "id");
    await expect(page.locator("h1")).toContainText("Simulasi TKA");
    await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /simulasi resmi Pusmendik/i);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://simulasitka.lol/");

    const officialLink = page.getByRole("link", { name: "Buka Simulasi Resmi" });
    await expect(officialLink).toHaveAttribute("href", "https://pusmendik.kemdikbud.go.id/tka/simulasi_tka");

    await expect(page.locator("#mapel option")).toHaveCount(3);
    await expect(page.locator("[data-mapel-card]")).toHaveCount(3);
    await expect(page.locator("[data-results-count]")).toHaveText("3 mapel");

    await page.selectOption("#jenis-mapel", "pilihan");
    await expect(page.locator("#mapel option")).toHaveCount(19);
    await expect(page.locator("[data-mapel-card]")).toHaveCount(19);
    await expect(page.locator("[data-results-count]")).toHaveText("19 mapel");

    await page.selectOption("#jenjang", "smp");
    await page.selectOption("#jenis-mapel", "wajib");
    await expect(page.locator("#mapel option")).toHaveCount(2);
    await expect(page.locator("[data-mapel-card]")).toHaveCount(2);

    await page.selectOption("#jenis-mapel", "pilihan");
    await expect(page.locator("#mapel")).toBeDisabled();
    await expect(page.locator("[data-empty-state]")).toBeVisible();
    await expect(page.locator("[data-results-count]")).toHaveText("0 mapel");

    await page.selectOption("#jenjang", "sd");
    await page.selectOption("#jenis-mapel", "wajib");
    await expect(page.locator("#mapel option")).toHaveCount(2);
    await expect(page.locator("[data-mapel-card]")).toHaveCount(2);

    const imagesLoaded = await page.evaluate(() =>
      Array.from(document.images).every((image) => image.complete && image.naturalWidth > 0)
    );
    expect(imagesLoaded).toBe(true);
  });

  test("mobile layout keeps CTA and selectors accessible", async ({ browser }) => {
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
      isMobile: true
    });
    const page = await context.newPage();

    await page.goto("/");

    await expect(page.getByRole("link", { name: "Buka Simulasi Resmi" })).toBeVisible();
    await page.getByRole("link", { name: "Lihat Pilihan Mapel" }).click();
    await expect(page.locator("#selector-panel")).toBeInViewport();
    await expect(page.locator("#jenjang")).toBeVisible();
    await expect(page.locator("#jenis-mapel")).toBeVisible();
    await expect(page.locator("#mapel")).toBeVisible();

    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(1);

    await context.close();
  });
});
