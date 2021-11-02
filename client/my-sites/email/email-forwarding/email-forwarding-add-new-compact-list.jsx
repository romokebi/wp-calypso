import { Button, Gridicon } from '@automattic/components';
import { localize } from 'i18n-calypso';
import page from 'page';
import PropTypes from 'prop-types';
import { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import FormButton from 'calypso/components/forms/form-button';
import { validateAllFields } from 'calypso/lib/domains/email-forwarding';
import EmailForwardingAddNewCompact from 'calypso/my-sites/email/email-forwarding/email-forwarding-add-new-compact';
import { emailManagement } from 'calypso/my-sites/email/paths';
import {
	composeAnalytics,
	recordGoogleEvent,
	recordTracksEvent,
	withAnalytics,
} from 'calypso/state/analytics/actions';
import { addEmailForward } from 'calypso/state/email-forwarding/actions';
import { getSiteSlug } from 'calypso/state/sites/selectors';
import { getSelectedSiteId } from 'calypso/state/ui/selectors';
import EmailForwardingLimit from './email-forwarding-limit';

class EmailForwardingAddNewCompactList extends Component {
	static propTypes = {
		emailForwards: PropTypes.array,
		emailForwardingLimit: PropTypes.number.isRequired,
		selectedDomainName: PropTypes.string.isRequired,
	};

	state = {
		forwards: [ { destination: '', mailbox: '', valid: false } ],
		formSubmitting: false,
	};

	hasForwards() {
		return this.props.emailForwards.length > 0;
	}

	hasReachedLimit() {
		return this.props.emailForwards.length >= this.props.emailForwardingLimit;
	}

	validForwards() {
		return ! this.state.forwards.some( ( t ) => ! t.valid );
	}

	addNewEmailForwardWithAnalytics = ( domainName, mailbox, destination, siteSlug ) => {
		const onSuccessRedirectTarget = () => {
			page( emailManagement( siteSlug, domainName ) );
		};

		withAnalytics(
			composeAnalytics(
				recordGoogleEvent(
					'Domain Management',
					'Clicked "Add New Email Forward" Button in Email Forwarding',
					'Domain Name',
					domainName
				),
				recordTracksEvent(
					'calypso_domain_management_email_forwarding_add_new_email_forward_click',
					{
						destination,
						domain_name: domainName,
						mailbox,
					}
				),
				this.props.addEmailForward( domainName, mailbox, destination, onSuccessRedirectTarget )
			)
		);
	};

	addNewEmailForwardsClick = ( event ) => {
		const { selectedSiteSlug } = this.props;

		event.preventDefault();

		if ( this.state.formSubmitting ) {
			return;
		}

		this.setState( { formSubmitting: true } );

		this.state.forwards.map( ( t ) => {
			const { mailbox, destination } = t;

			this.addNewEmailForwardWithAnalytics(
				this.props.selectedDomainName,
				mailbox,
				destination,
				selectedSiteSlug
			);
		} );

		this.setState( { formSubmitting: false } );
	};

	onForwardAdd = () => {
		this.setState( { forwards: [ ...this.state.forwards, { destination: '', mailbox: '' } ] } );
	};

	renderAddButton( addMoreButton = false ) {
		const { translate } = this.props;
		return (
			<div className="email-forwarding-add-new-compact-list__actions">
				{ addMoreButton && (
					<Button
						className="email-forwarding-add-new-compact-list__add-another-forward-button"
						onClick={ this.onForwardAdd }
					>
						<Gridicon icon="plus" />
						<span>{ translate( 'Add another forward' ) }</span>
					</Button>
				) }

				<Button
					primary
					onClick={ this.addNewEmailForwardsClick }
					disabled={ ! this.validForwards() }
				>
					{ translate( 'Add' ) }
				</Button>
			</div>
		);
	}

	renderFormFooter() {
		return <div>{ this.renderAddButton() }</div>;
	}

	removeHandler = ( index ) => {
		const array = this.state.forwards;
		array.splice( index, 1 );

		this.setState( { forwards: array } );
	};

	updateHandler = ( index, name, value ) => {
		const array = this.state.forwards;
		array[ index ][ name ] = value;

		const valid = validateAllFields( array[ index ] );
		array[ index ].valid = valid.mailbox.length === 0 && valid.destination.length === 0;

		this.setState( { forwards: array } );
	};

	render() {
		const { selectedDomainName } = this.props;
		return (
			<>
				{ this.state.forwards.map( ( fields, index ) => (
					<Fragment key={ `email-forwarding__add-new_fragment-${ index }` }>
						<form className="email-forwarding__add-new" key={ `form-${ index }` }>
							<EmailForwardingAddNewCompact
								key={ `email-forwarding__add-ne-${ index }` }
								fields={ fields }
								index={ index }
								emailForwards={ this.state.forwards }
								selectedDomainName={ selectedDomainName }
								removeHandler={ this.removeHandler }
								updateHandler={ this.updateHandler }
							/>
						</form>
						<hr key={ `email-forwarding__add-new_hr-${ index }` } />
					</Fragment>
				) ) }
				{ this.renderFormFooter() }
			</>
		);
	}
}

export default connect(
	( state ) => {
		return {
			selectedSiteSlug: getSiteSlug( state, getSelectedSiteId( state ) ),
		};
	},
	{ addEmailForward }
)( localize( EmailForwardingAddNewCompactList ) );
