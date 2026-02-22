import { Locator, Page } from "@playwright/test";

export class SearchPage {
    private readonly page: Page;
    public readonly consentDialog = '#usercentrics-cmp-ui';
    public readonly firstDetailsLink = 'xpath=ancestor::*[contains(., ",")][1]';

    constructor(page: Page) {
        this.page = page;
    }

    async gotoSearchPage() {
        await this.page.goto('/HC_GP_Public_Pages/');
        await this.dismissCookieConsentIfPresent();
    }

    /** Dismiss Usercentrics cookie consent so it does not block clicks */
    async dismissCookieConsentIfPresent() {
        const consent = this.page.locator(this.consentDialog);
        const acceptAll = consent.getByRole('button', { name: /Alle akzeptieren|Accept all|Akzeptieren|Zustimmen|Accept/i });
        try {
            await acceptAll.waitFor({ state: 'visible', timeout: 8000 });
            await acceptAll.click();
            await this.page.waitForTimeout(500);
        } catch {
            // No consent dialog or already dismissed
        }
    }

    // Search bar
    get searchBar(): Locator {
        return this.page.getByRole('combobox', { name: /Ort oder Postleitzahl/ });
    }

    get groupSearchButton(): Locator {
        return this.page.getByRole('button', { name: 'Gruppen suchen' });
    }

    // Filter panel
    get filterButton(): Locator {
        return this.page.getByText('Filter', { exact: true });
    }

    get versicherungsartDropdown(): Locator {
        return this.page.getByText('Versicherungsart').locator('..').getByRole('textbox');
    }

    get indikationDropdown(): Locator {
        return this.page.getByText('Indikation').locator('..').getByRole('textbox');
    }

    get firstResultCard(): Locator {
        const firstDetailsLink = this.page.getByRole('link', { name: 'Details' }).first();
        return firstDetailsLink.locator(this.firstDetailsLink);
    }

    get firstResultAddress(): Locator {
        return this.firstResultCard.getByText(/\d{5}|Straße|platz|weg|str\./i);
    }

    get firstResultInfoContainer(): Locator {
        return this.firstResultCard;
    }

    async selectLocationFromDropdown(optionText: string) {
        await this.page.getByRole('option', { name: optionText, exact: true }).click();
    }

    async typeLocationAndSearch(location: string, optionText: string) {
        await this.searchBar.fill(location);
        await this.selectLocationFromDropdown(optionText);
        await this.groupSearchButton.click({ force: true });
    }

    async openFilters() {
        await this.filterButton.click();
    }

    async selectVersicherungsartFilter(option: string) {
        await this.versicherungsartDropdown.click();
        await this.page.getByText(option, { exact: true }).click();
    }

    async selectIndikationFilter(option: string) {
        await this.indikationDropdown.click();
        await this.page.getByText(option, { exact: true }).click();
    }

    async getFirstResultAddressText(): Promise<string> {
        return (await this.firstResultAddress.textContent()) ?? '';
    }

    /** Parses "X Gruppen" */
    async getResultNumberOfGroups(): Promise<{ groupsCount: number }> {
        const text = await this.firstResultInfoContainer.textContent() ?? '';
        const groupsMatch = text.match(/(\d+)\s*Gruppen?/);
        const groupsCount = groupsMatch ? parseInt(groupsMatch[1], 10) : 0;
        return { groupsCount };
    }

    async clickFirstResultDetails() {
        await this.firstResultCard.getByRole('link', { name: 'Details' }).click();
    }
}
