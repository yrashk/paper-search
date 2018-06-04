/**
Panel with a search bar and filtering dialog.

### Example

```html
<paper-search-panel
	search="{{search}}"
	count="{{count}}"
	items="[[items]]"
	has-more="[[hasMore]]"
	loading="[[loading]]"
	filters="[[filters]]"
	selected-filters="{{selectedFilters}}"
	on-change-request-params="loadData">
	<div>
		Show your [[count]] results for "[[search]]"
	</div>
</paper-search-panel>
```

The panel shows the search configuration, and considers the `items` property to know whether
the lister is currently showing any results.

The content is hidden if no results are available. Content with attribute `fixed`
is shown even without no results (check the demo for an example).

@demo demo/paper-search-panel.html
*/
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/
import './paper-search-bar.js';

import './paper-filter-dialog.js';

Polymer({
		is: 'paper-search-panel',

		/**
		 * Fired when the user changes the parameter defining the currently shown items
		 *
		 * @event change-request-params
		 */
		 /**
		 * Fired when the user requests to search for a query
		 *
		 * @event search
		 */

		properties: {
        /**
         * Query for which the user was searching
         */
        search: {
            type: String,
            observer: '_onChangeRequest',
            notify: true
        },
        /**
         * All filters from which the user can choose
         */
        filters: Object,
        /**
         * All filters that have been selected by the user, e.g. `{ age: [ "child", "teen" ] }`
         */
        selectedFilters: {
            type: Object,
            observer: '_onChangeRequest',
            notify: true,
            value: {}
        },
        /**
         * Items that are currently shown in the lister
         */
        items: Array,
        /**
         * True if further items could be loaded
         */
        hasMore: {
            type: Boolean,
            value: false
        },

        /**
         * True if items are currently loaded
         */
        loading: {
            type: Boolean,
            value: false
        },

        /**
         * Whether to hide the Filter button. Set attribute "hide-filter-button" to do so.
         */
        hideFilterButton: {
            type: Boolean,
            value: false
        },

        /**
         * Number of items loaded per page (i.e. for each click on [more])
         */
        count: {
            type: Number,
            notify: true,
            value: 20
        },
        /**
         * Icon shown in the search background
         */
        icon: {
            type: String,
            value: 'search'
        },
        /**
         * Text shown in the search box if the user didn't enter any query
         */
        placeholder: {
            type: String,
            value: 'Search'
        },

        /**
         * Text shown if no results are found. Use this property to localize the element.
         */
        noResultsText: {
            type: String,
            value: 'No matching results found.'
        },

        /**
         * Text for the more button to load more data. Use this property to localize the element.
         */
        moreButton: {
            type: String,
            value: 'More'
        },

        /**
         * Text for the reset button in the filter dialog. Use this property to localize the element.
         */
        resetButton: String,

        /**
         * Text for the save button in the filter dialog. Use this property to localize the element.
         */
        saveButton: String,

        /**
         * Label shown if no values are selected for a filter. Use this property to localize the element.
         */
        noValuesLabel: String,

        _hasItems: {
            type: Boolean,
            computed: '_computeHasItems(items)',
            value: false
        }
		},

		getPaperSearchBarInstance: function() {
        return this.$.paperSearchBar;
		},

		// Private methods
		_loadMore: function() {
        this.count += 20;

        this._updateData();
		},
		_computeHasItems: function(items) {
        return typeof items !== 'undefined' && items.length > 0;
		},
		_showNoResults: function(_hasItems, loading) {
        return !_hasItems && !loading;
		},
		_onChangeRequest: function(newValue, oldValue) {
        // Ignore initial setting of properties (caller is supposed to trigger this call automatically)
        if (typeof oldValue !== 'undefined') {
            // Set back to default to avoid endless listers
            this.count = 20;
            this._updateData();
        }
		},
		_updateData: function() {
        this.fire('change-request-params');
		},
		_onFilter: function() {
        this.$.filterDialog.open();
		},
		_onSearch: function() {
        this.fire('search');
		},
		// Counts the selected filters
		_getNrSelectedFilters: function(selectedFilters) {
        if (Object.keys(selectedFilters).length <= 0) {
            return 0;
        }

        var nrSelectedFilters = Object.keys(selectedFilters)
            .map(function(key) {
                // Returns number of selected value for a filter
                return selectedFilters[key].length;
            })
            .reduce(function(sum, value) {
                // Sum up the selected values across filters
                return sum + value;
            });

        return nrSelectedFilters;
		},

		_disableFilterButton: function(filters) {
        return !(filters && filters.length > 0);
		}
});
