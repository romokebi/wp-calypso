import { Page } from 'playwright';

const selectors = {
	// Close account
	closeAccountLink: `p:text("Close your account permanently")`,
	closeAccountButton: `button:text("Close account")`,
	deletedItemsSidebar: 'text=These items will be deleted',

	// Modal
	modalContinueButton: `button:text("Continue")`,
	usernameSpan: `span.account-close__confirm-dialog-target-username`,
	usernameConfirmationInput: `input[id="confirmAccountCloseInput"]`,
	modalCloseAccountButton: `button:text("Close your account")`,
};

/**
 * Represents the Me > Account Settings page.
 */
export class AccountSettingsPage {
	private page: Page;

	/**
	 * Constructs an instance of the component.
	 *
	 * @param {Page} page The underlying page.
	 */
	constructor( page: Page ) {
		this.page = page;
	}

	/**
	 * Closes the currently logged in user's account.
	 */
	async closeAccount(): Promise< void > {
		// Wait for the async navigation
		await Promise.all( [
			this.page.waitForNavigation(),
			this.page.click( selectors.closeAccountLink ),
		] );

		// This page is tricky. All the text and the close account button load in and are "visible",
		// except they are then covered over with gray boxes. The button is still "clickable", but doesn't do anything.
		// The only thing that doesn't appear until all the loading is done is the sidebar of items to be deleted.
		// So we must wait for that text before continuing, or our close account button click can get swallowed!
		await this.page.waitForSelector( selectors.deletedItemsSidebar );
		await this.page.click( selectors.closeAccountButton );

		await this.page.click( selectors.modalContinueButton );
		const username = await this.page
			.waitForSelector( selectors.usernameSpan )
			.then( ( element ) => element.innerText() );
		await this.page.fill( selectors.usernameConfirmationInput, username );
		await this.page.click( selectors.modalCloseAccountButton );
	}
}
