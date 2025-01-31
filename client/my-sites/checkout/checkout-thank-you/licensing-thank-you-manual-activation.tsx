import { Button, Card, ProgressBar } from '@automattic/components';
import { useTranslate } from 'i18n-calypso';
import { FC } from 'react';
import footerCardBackground from 'calypso/assets/images/jetpack/jp-licensing-checkout-footer-bg.svg';
import footerCardImg from 'calypso/assets/images/jetpack/licensing-card.png';
import JetpackLogo from 'calypso/components/jetpack-logo';
import Main from 'calypso/components/main';
import PageViewTracker from 'calypso/lib/analytics/page-view-tracker';

interface Props {
	productSlug: string | 'no_product';
}

const LicensingThankYouAutoActivation: FC< Props > = ( { productSlug } ) => {
	const translate = useTranslate();

	// This is the first step of three of the manual activation flow
	const progressBarProperties = {
		value: 1,
		total: 3,
	};

	return (
		<Main fullWidthLayout className="licensing-thank-you-manual-activation">
			<PageViewTracker
				options={ { useJetpackGoogleAnalytics: true } }
				path={ '/checkout/jetpack/thank-you/licensing-manual-activation/:product' }
				properties={ { product_slug: productSlug } }
				title="Checkout > Jetpack Thank You Licensing Manual Activation"
			/>
			<Card className="licensing-thank-you-manual-activation__card">
				<div className="licensing-thank-you-manual-activation__card-main">
					<div className="licensing-thank-you-manual-activation__card-top">
						<JetpackLogo size={ 45 } />
						<ProgressBar
							className="licensing-thank-you-manual-activation__progress-bar"
							{ ...progressBarProperties }
						/>
					</div>
					<h1 className="licensing-thank-you-manual-activation__main-message">
						{ translate( 'Thank you for your purchase!' ) }{ ' ' }
						{ String.fromCodePoint( 0x1f389 ) /* Celebration emoji 🎉 */ }
					</h1>
					<p className="licensing-thank-you-manual-activation__product-info">
						{ translate( 'Learn how to get started with Jetpack.' ) }
						<br />
						{ translate( "We've also sent you an email with these instructions." ) }
					</p>
					<Button
						className="licensing-thank-you-manual-activation__button"
						primary
						disabled={ false }
					>
						{ translate( 'Continue ' ) }
					</Button>
				</div>
				<div
					className="licensing-thank-you-manual-activation__card-footer"
					style={ { backgroundImage: `url(${ footerCardBackground })` } }
				>
					<div className="licensing-thank-you-manual-activation__card-footer-image">
						<img src={ footerCardImg } alt="Checkout Thank you" />
					</div>
				</div>
			</Card>
		</Main>
	);
};

export default LicensingThankYouAutoActivation;
