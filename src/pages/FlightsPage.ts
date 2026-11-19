import { Locator, Page } from '@playwright/test';

export class FlightsPage {
    readonly page: Page;
    readonly oneWay: Locator;
    readonly roundTrip: Locator;
    readonly leavingFrom: Locator;
    readonly goingTo: Locator;
    readonly locationInput: Locator;
    readonly removeAirport: Locator;
    readonly travelDates: Locator;
    readonly nextMonth: Locator;
    readonly searchButton: Locator;
    readonly resultCards: Locator;

    constructor(page: Page) {
        this.page = page;
        this.oneWay = page.getByRole('radio', { name: 'One way' });
        this.roundTrip = page.getByRole('radio', { name: 'Round trip' });
        this.leavingFrom = page.getByRole('button', { name: /^Leaving from/ });
        this.goingTo = page.getByRole('button', { name: /^Going to/ });
        this.locationInput = page.locator('input[data-ui-name="input_text_autocomplete"]');
        this.removeAirport = page.getByRole('button', { name: /Remove airport or city/ });
        this.travelDates = page.getByRole('button', { name: /^Travel date/ });
        this.nextMonth = page.getByRole('button', { name: 'Next month' });
        this.searchButton = page.getByRole('button', { name: 'Search', exact: true });
        this.resultCards = page.getByTestId('searchresults_card');
    }
     
    async goto() {
        await this.page.goto('https://www.booking.com/flights/index.en-gb.html', { waitUntil: 'networkidle' });
    }

    async enterLocation(field: Locator, code: string) {
        await field.click();
        if (await this.removeAirport.isVisible()) {
            await this.removeAirport.click();
        }
        await this.locationInput.fill(code);
        await this.page.getByRole('option', { name: new RegExp(code, 'i') }).first().click();
    }

    async selectDate(date: string) {
        const day = this.page.locator(`[data-date="${date}"]`);
        while (!(await day.isVisible())) {
            await this.nextMonth.click();
        }
        await day.click();
    }

    async searchFlights(from: string, to: string, departDate: string, returnDate?: string) {
        if (returnDate) {
            await this.roundTrip.check();
        } else {
            await this.oneWay.check();
        }

        await this.enterLocation(this.leavingFrom, from);
        await this.enterLocation(this.goingTo, to);

        await this.travelDates.click();
        await this.selectDate(departDate);
        if (returnDate) {
            await this.selectDate(returnDate);
        }

        await this.searchButton.click();
    }

    async getResultCount() {
        await this.resultCards.first().waitFor();
        return this.resultCards.count();
    }
}
