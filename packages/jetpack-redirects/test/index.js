/**
 * Internal dependencies
 */
import getRedirectUrl from '../src';

describe( 'getRedirectUrl', () => {
	test( 'simple url', () => {
		const url = getRedirectUrl( 'simple' );
		expect( url ).toBe( 'https://jetpack.com/redirect/?source=simple' );
	} );

	test( 'Invalid param', () => {
		const url = getRedirectUrl( 'simple', { invalid: 'asd' } );
		expect( url ).toBe( 'https://jetpack.com/redirect/?source=simple' );
	} );

	test( 'Test path', () => {
		const url = getRedirectUrl( 'simple', { path: '1234' } );
		expect( url ).toBe( 'https://jetpack.com/redirect/?source=simple&path=1234' );
	} );

	test( 'Test path with special chars', () => {
		const url = getRedirectUrl( 'simple', { path: 'weird value!' } );
		const value = encodeURIComponent( 'weird value!' );
		expect( url ).toBe( `https://jetpack.com/redirect/?source=simple&path=${ value }` );
	} );

	test( 'Test query', () => {
		const url = getRedirectUrl( 'simple', { query: 'key=1234&other=super' } );
		const value = encodeURIComponent( 'key=1234&other=super' );
		expect( url ).toBe( `https://jetpack.com/redirect/?source=simple&query=${ value }` );
	} );

	test( 'Test anchor', () => {
		const url = getRedirectUrl( 'simple', { anchor: 'section' } );
		expect( url ).toBe( 'https://jetpack.com/redirect/?source=simple&anchor=section' );
	} );

	test( 'Test all', () => {
		const url = getRedirectUrl( 'simple', {
			query: 'key=1234&other=super',
			anchor: 'section',
			site: 'example.org',
			path: 123,
		} );
		const parsedUrl = new URL( url );

		expect( parsedUrl.searchParams.get( 'source' ) ).toBe( 'simple' );
		expect( parsedUrl.searchParams.get( 'anchor' ) ).toBe( 'section' );
		expect( parsedUrl.searchParams.get( 'query' ) ).toBe( 'key=1234&other=super' );
		expect( parsedUrl.searchParams.get( 'site' ) ).toBe( 'example.org' );
		expect( parsedUrl.searchParams.get( 'path' ) ).toBe( '123' );
	} );

	test( 'Test informing URL', () => {
		const url = getRedirectUrl( 'https://wordpress.com/support' );
		const value = encodeURIComponent( 'https://wordpress.com/support' );
		expect( url ).toBe( `https://jetpack.com/redirect/?url=${ value }` );
	} );

	test( 'Test informing URL and query', () => {
		const url = getRedirectUrl( 'https://wordpress.com/support', {
			query: 'key=1234&other=super',
		} );
		const value = encodeURIComponent( 'https://wordpress.com/support' );
		const query = encodeURIComponent( 'key=1234&other=super' );
		expect( url ).toBe( `https://jetpack.com/redirect/?url=${ value }&query=${ query }` );
	} );

	test( 'Test informing URL and query discarding info from url', () => {
		const url = getRedirectUrl( 'https://wordpress.com/support?super=mega&key=value#section1', {
			query: 'key=1234&other=super',
		} );
		const value = encodeURIComponent( 'https://wordpress.com/support' );
		const query = encodeURIComponent( 'key=1234&other=super' );
		expect( url ).toBe( `https://jetpack.com/redirect/?url=${ value }&query=${ query }` );
	} );
} );
