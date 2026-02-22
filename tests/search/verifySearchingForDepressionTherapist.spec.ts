import { test, expect } from '@playwright/test';
import { SearchPage } from '../../pages/searchPage';
import { TherapistDetailsPage } from '../../pages/therapistDetailsPage';
import searchTestData from '../../test-data/depression-therapist-search.json'  assert { type: 'json' };

test.describe('Search for Depression Therapist', () => {
    test('TC01: Verify searching for depression therapist with GKV filter', async ({ page }) => {
        const searchPage = new SearchPage(page);
        const detailsPage = new TherapistDetailsPage(page);
        const { search, versicherungsartFilter, indikationFilter } = searchTestData;

        // 1. Go to search page
        await searchPage.gotoSearchPage();

        // 2. Input "Berlin" and click "Gruppen suchen"
        await searchPage.typeLocationAndSearch(search.location, search.locationOption);

        // 3. Click Filter to expand filters panel
        await searchPage.openFilters();

        // 4. Apply filters: Versicherungsart = GKV, Indikation = Depression
        await searchPage.selectVersicherungsartFilter(versicherungsartFilter.gesetzlicheKrankenversicherung);
        await searchPage.selectIndikationFilter(indikationFilter.depression);

        // 5. First result: get address, number of groups
        const addressFromResults = (await searchPage.getFirstResultAddressText()).trim();
        const { groupsCount: groupsCountFromResults } = await searchPage.getResultNumberOfGroups();

        // 6. Click Details on first result
        await searchPage.clickFirstResultDetails();

        // 7. Assert map is visible on therapist details page
        await expect(detailsPage.mapZoomInButton).toBeVisible();

        // 8. Assert therapist address on details page contains the address from results
        const addressOnDetails = (await detailsPage.practiceAddressText.textContent()) ?? '';
        const normalizedDetails = addressOnDetails.replace(/\s+/g, ' ').trim();
        const normalizedResult = addressFromResults.replace(/\s+/g, ' ').trim();
        const parts = normalizedResult.split(',').map(p => p.trim()).filter(Boolean);
        for (const part of parts) {
            expect(normalizedDetails).toContain(part);
        }

        // 9. "Gesetzliche Krankenversicherung (GKV)" is visible (chosen filter)
        await expect(page.getByText('Gesetzliche Krankenversicherung (GKV)', { exact: true })).toBeVisible();

        // 10. Number of therapy groups on details page matches search results
        const groupsOnDetailsPage = await detailsPage.getTherapyGroupsCount();
        expect(groupsOnDetailsPage).toBe(groupsCountFromResults);

        // 11. All visible groups contain "Depression"
        const groupCount = await detailsPage.therapyGroupAnfragenButtons.count();
        for (let i = 0; i < groupCount; i++) {
            const card = detailsPage.getGroupCardByAnfragenIndex(i);
            await expect(card.getByText('Depression')).toBeVisible();
        }

        // 12. Click "Anfragen" button
        await detailsPage.clickFirstAnfragen();

        // 13. "Jetzt einloggen oder registrieren" is enabled
        await expect(detailsPage.jetztEinloggenOderRegistrierenButton).toBeEnabled();

        // 14. "Anfragen" is disabled
        await expect(detailsPage.disabledAnfragenButton).toBeVisible();
    });
});
