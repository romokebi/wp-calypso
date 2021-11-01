import { isEnabled } from '@automattic/calypso-config';
import page from 'page';
import { createElement } from 'react';
import { makeLayout } from 'calypso/controller';
import { getSiteFragment } from 'calypso/lib/route';
import { siteSelection, navigation, sites } from 'calypso/my-sites/controller';
import isAtomicSite from 'calypso/state/selectors/is-site-automated-transfer';
import {
	getSelectedSiteWithFallback,
	getSiteOption,
	getSiteWooCommerceUrl,
} from 'calypso/state/sites/selectors';
import main from './main';
import Installer from './woop/installer';

import './style.scss';

export default function ( router ) {
	router( '/woocommerce-installation', siteSelection, sites, makeLayout );
	router( '/woocommerce-installation/:site', siteSelection, navigation, makeInstaller, makeLayout );
}

export function makeInstaller( context, next ) {
	// Invalid site, redirect to select site.
	if ( ! getSiteFragment( context.path ) ) {
		return page.redirect( '/woocommerce-installation' );
	}

	const state = context.store.getState();
	const site = getSelectedSiteWithFallback( state );
	const siteId = site ? site.ID : null;

	if ( ! isEnabled( 'woop' ) ) {
		// Only allow AT sites to access.
		if ( ! isAtomicSite( state, siteId ) ) {
			return page.redirect( `/home/${ site.slug }` );
		}

		// WooCommerce plugin is already installed, redirect to Woo.
		if ( getSiteOption( state, siteId, 'is_wpcom_store' ) ) {
			const redirectUrl = getSiteWooCommerceUrl( state, siteId );
			window.location.href = redirectUrl;
			return;
		}

		context.primary = createElement( main );
	} else {
		context.primary = createElement( Installer );
	}

	next();
}
