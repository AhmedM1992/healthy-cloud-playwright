import { Locator, Page } from "@playwright/test";

export class TherapistDetailsPage {
    private readonly page: Page;
    public readonly practiseAddressText = '[id$="PraxisBaseInfoCnt"].practice-details-text';
    public readonly therapyDepressionCard = 'xpath=./ancestor::*[.//*[contains(text(),"Depression")] and .//button[normalize-space()="Details"]][1]';

    constructor(page: Page) {
        this.page = page;
    }

    /** Map container (Leaflet) – visible when map is loaded */
    get mapZoomInButton(): Locator {
        return this.page.getByRole('button', { name: 'Zoom in' });
    }

    /** Practice address on details page (base info container with address) */
    get practiceAddressText(): Locator {
        return this.page.locator(this.practiseAddressText);
    }

    /** Each therapy group card has an "Anfragen" button – count = number of groups */
    get therapyGroupAnfragenButtons(): Locator {
        return this.page.getByRole('button', { name: 'Anfragen' });
    }

    /** First "Anfragen" button (on a group card) */
    get firstAnfragenButton(): Locator {
        return this.therapyGroupAnfragenButtons.first();
    }

    /** "Jetzt einloggen oder registrieren" button */
    get jetztEinloggenOderRegistrierenButton(): Locator {
        return this.page.getByRole('button', { name: 'Jetzt einloggen oder registrieren' });
    }

    /** Disabled "Anfragen" button in the request modal */
    get disabledAnfragenButton(): Locator {
        return this.page.getByRole('button', { name: 'Anfragen', disabled: true });
    }

    async getTherapyGroupsCount(): Promise<number> {
        return this.therapyGroupAnfragenButtons.count();
    }

    /** Get the card of Anfragen button (for checking "Depression" inside it) */
    getGroupCardByAnfragenIndex(index: number): Locator {
        return this.therapyGroupAnfragenButtons.nth(index).locator(this.therapyDepressionCard);
    }

    async clickFirstAnfragen() {
        await this.firstAnfragenButton.click();
    }
}
