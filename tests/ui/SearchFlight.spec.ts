import { test, expect } from '@playwright/test';
import { FlightsPage } from '../../src/pages/FlightsPage';

function getFutureDate(days: number) {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0];
}

test.describe('Flight search', () => {
    let flightsPage: FlightsPage;

    test.beforeEach(async ({ page }) => {
        flightsPage = new FlightsPage(page);
        await flightsPage.goto();
    });

    test('one-way flight search shows results', async () => {
        await flightsPage.searchFlights('DEL', 'BOM', getFutureDate(7));

        expect(await flightsPage.getResultCount()).toBeGreaterThan(0);
    });

    test('round-trip flight search shows results', async () => {
        await flightsPage.searchFlights('DEL', 'BOM', getFutureDate(14), getFutureDate(19));

        expect(await flightsPage.getResultCount()).toBeGreaterThan(0);
    });
});
