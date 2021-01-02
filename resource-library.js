import { get, map, range, extend, clone, merge } from 'lodash';
import { createBrowserHistory as createHistory } from 'history';

/**
 * Vue.js Resource Library for WordPress
 * @module ResourceLibrary
 */

export default {
  /**
   * @namespace ResourceLibrary
   * @property {Object} props                       The initial properties
   * @property {number} props.ver                   Update to invalidate cache
   * @property {string} props.post_type             The type of posts to query
   * @property {number} props.per_page              Number of results per page
   * @property {string} props.meta_fields           Meta fields to include
   * @property {string} props.initial_page          The initial page of results to load
   * @property {string} props.initial_search        The initial search terms
   * @property {string} props.initial_order         The initial order direction
   * @property {string} props.initial_orderby       The initial field to order on
   * @property {Object} props.initial_taxonomies    The initial taxonomies available to filter on.  You must pass an empty array or inital data for each taxonomy to enable it on the instance
   * @property {Object} props.initial_meta_query    The initial meta query
   */
  props: {
    ver: {
      type: Number,
      default: 1,
    },
    post_type: {
      type: String,
      default: 'posts',
    },
    per_page: {
      type: Number,
      default: 10,
    },
    meta_fields: {
      type: Object,
      default() {
        return {};
      },
    },
    initial_page: {
      type: Number,
      default: 1,
    },
    initial_search: {
      type: String,
      default: '',
    },
    initial_order: {
      type: String,
      default: 'desc',
    },
    initial_orderby: {
      type: String,
      default: 'date',
    },
    initial_taxonomies: {
      type: Object,
      default() {
        return {};
      },
    },
    initial_meta_query: {
      type: Object,
      default() {
        return {};
      },
    },
  },

  /* RAW DATA */
  data() {
    return {
      wp_data: {}, // WP data holds the raw Wordpress REST response.  Massaged data is in the computed data property
      pagination_data: {
        total: 0,
        total_pages: 0,
      },
      params: {},
      error: null,
      loading: true,
    };
  },

  /* COMPUTED DATA */
  computed: {
    // Processes things like orderby to use a meta query
    query_params() {
      let query_params = extend({}, this.params);

      let orderby = this.params.orderby;

      // Translate pagenum to page because WordPress likes to try to be smart about that param
      if (query_params.pagenum) {
        query_params.page = query_params.pagenum;
        delete query_params.pagenum;
      }

      if (this.meta_fields[orderby] === 'number') {
        query_params.orderby = 'meta_value_num';
        query_params.meta_key = orderby;
      } else if (this.meta_fields[orderby]) {
        query_params.orderby = 'meta_value';
        query_params.meta_key = orderby;
      } else if (this.__valid_orderbys.indexOf(orderby) === -1) {
        throw 'Orderby must be one of: ' + this.__valid_orderbys.join(', ') + ', or a postmeta field';
      }

      // Process meta query
      if (Object.keys(query_params.meta_query).length > 0) {
        query_params.meta_query.relation = 'AND';
      }

      return query_params;
    },

    /**
     * @namespace ResourceLibrary
     * @property {Array.<Object>} resources Resources processes the raw REST response and delivers it in a useful way to the front end.  This matches the properties that are available in WordPress from getPost() with a few extra convenience properties
     * @property {function} resources.getFeaturedImage(size) Get the featured image at the requested size name (e.g. full, medium).  This must be defined in WordPress
     * @property {Array.<Array.<Object>>} resources.terms Convenience access for taxonomy terms.  The outer array is indexed by taxonomy, and the inner array contains the terms on this
     */
    resources() {
      return map(this.wp_data, (item, index) => {
        // Grab the rendered title and excerpt
        if (!item.title) {
          item.title = '';
        }

        if (item.title.rendered) {
          item.title = item.title.rendered;
        }

        if (!item.excerpt) {
          item.excerpt = '';
        }

        if (item.excerpt.rendered) {
          item.excerpt = item.excerpt.rendered;
        }

        item.getFeaturedImage = function (size) {
          let base_featured_image = get(item, ['_embedded', 'wp:featuredmedia', '0', 'media_details']);

          if (!base_featured_image) {
            return false;
          }

          if (!size || !get(base_featured_image, ['sizes', size])) {
            size = 'full';
          }

          if (get(base_featured_image, ['sizes', size, 'source_url'])) {
            return get(base_featured_image, ['sizes', size, 'source_url']);
          } else {
            return false;
          }
        };

        // Pull in and massage terms
        item.terms = {};
        if (get(item, ['_embedded', 'wp:term'])) {
          item._embedded['wp:term'].forEach((taxonomy) => {
            if (taxonomy.length > 0) {
              taxonomy.forEach((term) => {
                let taxonomy_name = term.taxonomy;
                // I have no idea why Wordpress expects this taxonomy to be called "tags" when querying, but returns it as "post_tag".
                // Just normalize it here.
                if (taxonomy_name === 'post_tag') {
                  taxonomy_name = 'tags';
                }

                if (item.terms[taxonomy_name] === undefined) {
                  item.terms[taxonomy_name] = [];
                }

                item.terms[taxonomy_name].push(term);
              });
            }
          });
        }

        return item;
      });
    },

    /**
     * @namespace ResourceLibrary
     * @property {Array.<string>} pages An array of pagination data, including ellipses.  Always show 9 pages and insert ellipses in the correct spot.
     */
    pages() {
      if (this.pagination_data.total_pages === 0) {
        return [];
      }

      if (this.pagination_data.total_pages <= 10) {
        return range(1, this.pagination_data.total_pages + 1);
      } else {
        // Show 9 pages always, and show ellipses on either side when appropriate
        // Number of pages to show before and after current page
        let pages_before = 4;
        let pages_after = 4;
        let current_page = this.params.pagenum;

        if (pages_before >= current_page) {
          pages_after += pages_before - (current_page - 1);
          pages_before = current_page - 1;
        } else if (current_page + pages_after > this.pagination_data.total_pages) {
          pages_before += pages_after - (this.pagination_data.total_pages - current_page);
          pages_after = this.pagination_data.total_pages - current_page;
        }

        let start_page = current_page - pages_before;
        let end_page = current_page + pages_after;

        if (start_page === 1) {
          return range(start_page, end_page + 1).concat(['&hellip;', this.pagination_data.total_pages]);
        } else if (end_page === this.pagination_data.total_pages) {
          return [1, '&hellip;'].concat(range(start_page, end_page + 1));
        } else {
          let pagination_items = range(start_page, end_page + 1);

          if (start_page !== 2) {
            pagination_items.unshift('&hellip;');
          }

          pagination_items.unshift(1);

          if (end_page !== this.pagination_data.total_pages - 1) {
            pagination_items.push('&hellip;');
          }

          pagination_items.push(this.pagination_data.total_pages);

          return pagination_items;
        }
      }
    },
  },

  /* METHODS */
  methods: {
    /**
     * Override in order to call method after component is created
     * @function afterCreated
     */
    afterCreated() {
      return;
    },
    /**
     * Override in order to call method on initial load
     * @function onInitialLoad
     */
    onInitialLoad() {
      return;
    },
    /**
     * Override in order to call method after params change but not on initial load
     * @function onParamsChange
     */
    onParamsChange() {
      return;
    },
    /**
     * Build the url for the WP API
     * @returns {string} a constructed url for the WP API based on the query params.
     */
    constructURL() {
      try {
        const apiURL = new URL(`${location.origin}${this.__api_base_url}${this.post_type}`);
        apiURL.searchParams.append('context', 'embed');
        apiURL.searchParams.append('_embed', 1);

        for (const key in this.query_params) {
          if (Object.hasOwnProperty.call(this.query_params, key)) {
            const value = this.query_params[key];
            apiURL.searchParams.append(key, value);
          }
        }
        return apiURL;
      } catch (error) {
        throw new Error(error);
      }
    },
    /**
     * Internal function to fetch data based on current properties.  Do not call directly
     * @function __fetchData
     * @private
     */
    async __fetchData() {
      this.loading = true;
      this.triggerRootEvent('loading');

      try {
        const apiCall = this.constructURL();
        const fetchResponse = await fetch(apiCall);
        const response = await fetchResponse.json();
        this.wp_data = response;
        this.pagination_data.total = parseInt(fetchResponse.headers.get('x-wp-total'));
        this.pagination_data.total_pages = parseInt(fetchResponse.headers.get('x-wp-totalpages'));

        this.loading = false;

        if (this.__is_initial_load === true) {
          this.onInitialLoad();
          this.__is_initial_load = false;
        }
      } catch (error) {
        this.error = error;
        this.loading = false;
      }
    },
    /**
     * Select which page of results to display
     * @function selectPage
     * @param {number} page The page number
     * @param {function} callback
     */
    selectPage(page, callback) {
      this.__page_updated = true;
      this.params.pagenum = page;

      if (callback instanceof Function) {
        callback(page);
      }
    },
    /**
     * Set search terms
     * @function setSearchTerms
     * @param {string} search Search terms
     * @param {function} callback
     */
    setSearch(search, callback) {
      this.params.search = search;

      if (callback instanceof Function) {
        callback(search);
      }
    },
    /**
     * Reset taxonomy terms
     * @function resetTerms
     * @param {string} taxonomy The taxonomy to use
     * @param {function} callback
     */
    resetTerms(taxonomy, callback) {
      this.params[taxonomy] = [];

      if (callback instanceof Function) {
        callback(taxonomy);
      }
    },
    /**
     * Add taxonomy terms
     * @function addTerms
     * @param {string}  taxonomy The taxonomy to use
     * @param {integer|Array.<number>} terms The ID of the taxonomy to add
     * @param {function} callback
     */
    addTerms(taxonomy, terms, callback) {
      if (terms.constructor !== Array) {
        terms = [terms];
      }

      for (let i = 0; i < terms.length; i++) {
        if (this.params[taxonomy].indexOf(terms[i]) === -1) {
          this.params[taxonomy].push(terms[i]);
        }
      }

      if (callback instanceof Function) {
        callback(taxonomy, terms);
      }
    },
    /**
     * Remove taxonomy terms
     * @function removeTerms
     * @param {string} taxonomy The taxonomy to use
     * @param {number|Array.<number>} terms The ID of the taxonomy to remove
     * @param {function} callback
     */
    removeTerms(taxonomy, terms, callback) {
      if (terms.constructor !== Array) {
        terms = [terms];
      }

      for (let i = 0; i < terms.length; i++) {
        let index = this.params[taxonomy].indexOf(terms[i]);

        if (index !== -1) {
          this.params[taxonomy].splice(index, 1);
        }
      }

      if (callback instanceof Function) {
        callback(taxonomy, terms);
      }
    },
    /**
     * Set taxonomy terms.  This overwrites any current taxonomy temms.
     * @function setTerms
     * @param {string} taxonomy The taxonomy to use
     * @param {number|Array<number>} terms The ID of the taxonomy to remove
     * @param {function} callback
     */
    setTerms(taxonomy, terms, callback) {
      if (terms.constructor !== Array) {
        terms = [terms];
      }

      this.params[taxonomy] = terms;

      if (callback instanceof Function) {
        callback(taxonomy, terms);
      }
    },
    /**
     * Helper function to join taxonomy terms into a string to display on the front end
     * @function joinTerms
     * @param {Object} item The item to join terms from
     * @param {string} taxonomy The taxonomy to use
     * @param separator {string} The separator to use
     */
    joinTerms(item, taxonomy, separator = ', ') {
      if (!item.terms[taxonomy] || item.terms[taxonomy].constructor !== Array) {
        return '';
      } else {
        return item.terms[taxonomy]
          .map((item) => {
            return item.name;
          })
          .join(separator);
      }
    },
    /**
     * Set whether to order results in ascending or descending order
     * @function setOrder
     * @param {string} order Order direction. One of "asc" or "desc"
     * @param {function} callback
     */
    setOrder(order, callback) {
      if (order !== 'asc' && order !== 'desc') {
        throw 'Order must be either asc or desc';
      }

      this.params.order = order;

      if (callback instanceof Function) {
        callback(order);
      }
    },
    /**
     * Set the field to order results by
     * @function setOrderBy
     * @param {string} orderby The field to order by
     * @param {function} callback
     */
    setOrderBy(orderby, callback) {
      this.params.orderby = orderby;

      if (callback instanceof Function) {
        callback(orderby);
      }
    },
    /**
     * Convenience method to select an orderby and set the appropriate order, or toggle the order if already selected.
     * @function selectOrderBy
     * @param {string} orderby The field to order by
     * @param {string} default_order Order direction.  One of  "asc" or "desc".  This will be used to sort results if the order has not been explicitly set.
     * @param {function} callback
     */
    selectOrderBy(orderby, default_order, callback) {
      if (!default_order) {
        default_order = 'asc';
      }

      if (this.params.orderby === orderby) {
        this.toggleOrder();
      } else {
        this.setOrder(default_order);
      }

      this.setOrderBy(orderby);

      if (callback instanceof Function) {
        callback(orderby, default_order);
      }
    },
    /**
     * Convenience method to see what we're ordered by in order to deal with postmeta
     * @function isOrderedBy
     * @param {string} orderby The field to order by
     * @param {string} order The direction to order in
     * @returns {boolean} Whether or not results are currently ordered by orderby, and sorted in the order direction
     */
    isOrderedBy(orderby, order) {
      return this.params.orderby === orderby && this.params.order === order;
    },
    /**
     * Toggle the order direction from asc to desc or from desc to asc
     * @function toggleOrder
     */
    toggleOrder() {
      if (this.params.order === 'asc') {
        this.setOrder('desc');
      } else {
        this.setOrder('asc');
      }
    },
    /**
     * Set a filter on a meta-value.  Currently only supports one field value per meta value.
     * @function setMetaFilter
     * @param {string} field The meta field to set the filter on
     * @param {string} value The value to filter on
     */
    setMetaFilter(field, value) {
      Vue.set(this.params.meta_query, field, {
        field: field,
        value: value,
      });
    },
    /**
     * Remove filters on a meta field
     * @function removeMetaFilter
     * @param {string} field The meta field to delete the filter on
     */
    removeMetaFilter(field) {
      Vue.delete(this.params.meta_query, field);
    },
    /**
     * Clear all meta filters
     * @function clearMetaFilters
     */
    clearMetaFilters() {
      Vue.set(this.params, meta_query, {});
    },
    /**
     * Get the params that the resource library was initialized with
     * @function initialParams
     * @returns {Object} Object of initial values
     */
    initialParams() {
      return {
        per_page: this.per_page,
        search: this.initial_search,
        order: this.initial_order,
        orderby: this.initial_orderby,
        pagenum: this.initial_page,
        meta_query: clone(this.initial_meta_query),
        ver: this.ver, // Including version for cache invalidation
      };
    },
    /**
     * Reset params to their initial values
     * @function reset
     */
    reset() {
      let params = merge({}, this.initialParams(), this.initial_taxonomies);

      this.params = params;
    },
    /**
     * In case you need to communicate with something outside of Vue, call this to trigger an event on the Vue root element.  Attach a function to the Vue root element to then interact with the function.  The args will be passed to the "detail" arg in the function
     * @function triggerRootEvent
     * @param {string} event The event type to trigger
     * @param {string} args The args to pass to the triggered function
     */
    triggerRootEvent(event, args) {
      this.$root.$el.dispatchEvent(new CustomEvent(event, { detail: args }));
    },
    /**
     * Serialize URL params
     * @function serializeParams
     * @param {Object} params An object of key:value pairs corresponding to the URL params
     * @returns {string} A URL param string (e.g. param1=value1&param2=value2)
     */
    serializeParams(params) {
      return Object.keys(params)
        .filter(function (k) {
          return !!params[k];
        })
        .map(function (k) {
          return encodeURIComponent(k) + '=' + encodeURIComponent(JSON.stringify(params[k]));
        })
        .join('&');
    },
    /**
     * Unserialize URL params to an object
     * @function unserializeParams
     * @param {string} param_string A URL param string (e.g. param1=value1&param2=value2)
     * @returns {Object} An object with key:value pairs corresponding to the URL params
     */
    unserializeParams(param_string) {
      let params_obj = param_string
        .substring(1)
        .split('&')
        .map(function (item) {
          return item.split('=');
        });

      let params = {};

      params_obj.forEach(function (val) {
        params[decodeURIComponent(val[0])] = JSON.parse(decodeURIComponent(val[1]));
      });

      return params;
    },
    /**
     * Internal function to initialize browser history.  Do not call directly.
     * @function __initHistory
     * @private
     */
    __initHistory() {
      this.__history = createHistory();
      // Allows back button navigation
      this.__history.listen((location, action) => {
        if (action === 'POP') {
          this.__suppress_history_state = true;
          if (location.state) {
            this.__page_updated = true;
            this.params = location.state;
          } else {
            this.reset();
          }
        }
      });
    },
    /**
     * Internal function to push to history.  Do not call directly.
     * @function __pushHistoryState
     * @private
     */
    __pushHistoryState(url) {
      this.__history.push(url, this.params);
    },
  },

  /* WATCH PARAMS */
  watch: {
    params: {
      handler() {
        if (this.__page_updated === false) {
          this.params.pagenum = 1;
        }

        this.__fetchData();
        this.__page_updated = false;

        if (this.__suppress_history_state === false) {
          this.__pushHistoryState(window.location.pathname + '?' + this.serializeParams(this.params));
        }

        this.__suppress_history_state = false;

        // if (this.__is_initial_load !== true) {
          this.onParamsChange();
        // }
      },
      deep: true,
    },
  },

  /* CREATION HOOKS */
  created() {
    // Set private non-reactive properties
    this.__api_base_url = '/wp-json/wp/v2/';
    this.__page_updated = true; // Keep track of the latest change to query params was that the page number.  If not, reset to page 1.
    this.__suppress_history_state = true; // Whether or not to suppress a history state.  Suppress it on load, and when popping history
    this.__valid_orderbys = ['author', 'date', 'id', 'include', 'modified', 'parent', 'relevance', 'slug', 'title'];
    this.__is_initial_load = true;

    if (!window.location.search) {
      this.reset(); // Initialize params to initial values
    } else {
      this.params = _.merge(this.initialParams(), this.unserializeParams(window.location.search));
    }

    this.__initHistory();
    this.afterCreated();
  },
};
