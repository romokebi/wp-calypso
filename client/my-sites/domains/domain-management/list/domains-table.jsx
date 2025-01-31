import { localize } from 'i18n-calypso';
import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import QuerySitePurchases from 'calypso/components/data/query-site-purchases';
import DomainRow from './domain-row';
import DomainsTableHeader from './domains-table-header';
import ListItemPlaceholder from './item-placeholder';
import { filterOutWpcomDomains } from './utils';

const noop = () => {};

class DomainsTable extends PureComponent {
	static propTypes = {
		isLoading: PropTypes.bool,
		currentRoute: PropTypes.string,
		domains: PropTypes.array,
		domainsTableColumns: PropTypes.array,
		selectedSite: PropTypes.object,
		settingPrimaryDomain: PropTypes.bool,
		primaryDomainIndex: PropTypes.number,
		translate: PropTypes.func,
		shouldUpgradeToMakeDomainPrimary: PropTypes.func,
		goToEditDomainRoot: PropTypes.func,
		handleUpdatePrimaryDomainOptionClick: PropTypes.func,
	};

	state = {
		sortKey: 'status', // initial column to sort by - should match the header columns
		sortOrder: -1, // initial sort order where 1 = ascending and -1 = descending
	};

	changeTableSort = ( selectedColumn, sortOrder = null ) => {
		const { domainsTableColumns } = this.props;

		const selectedColumnDefinition = domainsTableColumns.find(
			( column ) => column.name === selectedColumn
		);

		if ( ! selectedColumnDefinition?.isSortable ) {
			return;
		}

		this.setState( ( prevState ) => {
			let newSortOrder = sortOrder;

			if ( ! sortOrder ) {
				if ( selectedColumnDefinition?.supportsOrderSwitching ) {
					newSortOrder =
						selectedColumn === prevState.sortKey
							? prevState.sortOrder * -1
							: selectedColumnDefinition.initialSortOrder;
				} else {
					newSortOrder = selectedColumnDefinition.initialSortOrder;
				}
			}

			return {
				sortKey: selectedColumn,
				sortOrder: newSortOrder,
			};
		} );
	};

	render() {
		const {
			isLoading,
			currentRoute,
			domainsTableColumns,
			domains,
			selectedSite,
			settingPrimaryDomain,
			primaryDomainIndex,
			translate,
			shouldUpgradeToMakeDomainPrimary,
			goToEditDomainRoot,
			handleUpdatePrimaryDomainOptionClick,
			purchases,
		} = this.props;

		const { sortKey, sortOrder } = this.state;

		if ( isLoading ) {
			return [
				<ListItemPlaceholder key="item-1" />,
				<ListItemPlaceholder key="item-2" />,
				<ListItemPlaceholder key="item-3" />,
			];
		}

		const domainItems = filterOutWpcomDomains( domains );

		const selectedColumnDefinition = domainsTableColumns.find(
			( column ) => column.name === sortKey
		);

		if ( sortKey && sortOrder ) {
			domainItems.sort( ( first, second ) => {
				let result = 0;
				for ( const sortFunction of selectedColumnDefinition.sortFunctions ) {
					result = sortFunction( first, second, sortOrder );
					if ( 0 !== result ) {
						break;
					}
				}
				return result;
			} );
		}

		const domainListItems = domainItems.map( ( domain, index ) => {
			const purchase = purchases
				? purchases.find( ( p ) => p.id === parseInt( domain.subscriptionId, 10 ) )
				: null;
			return (
				<DomainRow
					key={ `${ domain.name }-${ index }` }
					currentRoute={ currentRoute }
					domain={ domain }
					domainDetails={ domain }
					site={ selectedSite }
					isManagingAllSites={ false }
					onClick={ settingPrimaryDomain ? noop : goToEditDomainRoot }
					isBusy={ settingPrimaryDomain && index === primaryDomainIndex }
					busyMessage={ translate( 'Setting primary site address…', {
						context: 'Shows up when the primary domain is changing and the user is waiting',
					} ) }
					disabled={ settingPrimaryDomain }
					selectionIndex={ index }
					onMakePrimaryClick={ handleUpdatePrimaryDomainOptionClick }
					shouldUpgradeToMakePrimary={ shouldUpgradeToMakeDomainPrimary( domain ) }
					purchase={ purchase }
				/>
			);
		} );

		return [
			<QuerySitePurchases key="query-purchases" siteId={ selectedSite.ID } />,
			domains.length > 0 && (
				<DomainsTableHeader
					key="domains-header"
					columns={ domainsTableColumns }
					isManagingAllSites={ false }
					onChangeSortOrder={ this.changeTableSort }
					activeSortKey={ sortKey }
					activeSortOrder={ sortOrder }
					domainItemsCount={ domainItems.length }
				/>
			),
			...domainListItems,
		];
	}
}

export default localize( DomainsTable );
