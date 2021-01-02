yarn run v1.22.10
$ jsdoc2md resource-library.js
<a name="module_ResourceLibrary"></a>

## ResourceLibrary
Vue.js Resource Library for Taco WordPress


* [ResourceLibrary](#module_ResourceLibrary)
    * [~ResourceLibrary](#module_ResourceLibrary..ResourceLibrary) : <code>object</code>
    * [~ResourceLibrary](#module_ResourceLibrary..ResourceLibrary) : <code>object</code>
    * [~ResourceLibrary](#module_ResourceLibrary..ResourceLibrary) : <code>object</code>
    * [~afterCreated()](#module_ResourceLibrary..afterCreated)
    * [~onInitialLoad()](#module_ResourceLibrary..onInitialLoad)
    * [~onParamsChange()](#module_ResourceLibrary..onParamsChange)
    * [~selectPage(page, callback)](#module_ResourceLibrary..selectPage)
    * [~setSearchTerms(search, callback)](#module_ResourceLibrary..setSearchTerms)
    * [~resetTerms(taxonomy, callback)](#module_ResourceLibrary..resetTerms)
    * [~addTerms(taxonomy, terms, callback)](#module_ResourceLibrary..addTerms)
    * [~removeTerms(taxonomy, terms, callback)](#module_ResourceLibrary..removeTerms)
    * [~setTerms(taxonomy, terms, callback)](#module_ResourceLibrary..setTerms)
    * [~joinTerms(item, taxonomy, separator)](#module_ResourceLibrary..joinTerms)
    * [~setOrder(order, callback)](#module_ResourceLibrary..setOrder)
    * [~setOrderBy(orderby, callback)](#module_ResourceLibrary..setOrderBy)
    * [~selectOrderBy(orderby, default_order, callback)](#module_ResourceLibrary..selectOrderBy)
    * [~isOrderedBy(orderby, order)](#module_ResourceLibrary..isOrderedBy) ⇒ <code>boolean</code>
    * [~toggleOrder()](#module_ResourceLibrary..toggleOrder)
    * [~setMetaFilter(field, value)](#module_ResourceLibrary..setMetaFilter)
    * [~removeMetaFilter(field)](#module_ResourceLibrary..removeMetaFilter)
    * [~clearMetaFilters()](#module_ResourceLibrary..clearMetaFilters)
    * [~initialParams()](#module_ResourceLibrary..initialParams) ⇒ <code>Object</code>
    * [~reset()](#module_ResourceLibrary..reset)
    * [~triggerRootEvent(event, args)](#module_ResourceLibrary..triggerRootEvent)
    * [~serializeParams(params)](#module_ResourceLibrary..serializeParams) ⇒ <code>string</code>
    * [~unserializeParams(param_string)](#module_ResourceLibrary..unserializeParams) ⇒ <code>Object</code>

<a name="module_ResourceLibrary..ResourceLibrary"></a>

### ResourceLibrary~ResourceLibrary : <code>object</code>
**Kind**: inner namespace of [<code>ResourceLibrary</code>](#module_ResourceLibrary)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| props | <code>Object</code> | The initial properties |
| props.ver | <code>number</code> | Update to invalidate cache |
| props.post_type | <code>string</code> | The type of posts to query |
| props.per_page | <code>number</code> | Number of results per page |
| props.meta_fields | <code>string</code> | Meta fields to include |
| props.initial_page | <code>string</code> | The initial page of results to load |
| props.initial_search | <code>string</code> | The initial search terms |
| props.initial_order | <code>string</code> | The initial order direction |
| props.initial_orderby | <code>string</code> | The initial field to order on |
| props.initial_taxonomies | <code>Object</code> | The initial taxonomies available to filter on.  You must pass an empty array or inital data for each taxonomy to enable it on the instance |
| props.initial_meta_query | <code>Object</code> | The initial meta query |

<a name="module_ResourceLibrary..ResourceLibrary"></a>

### ResourceLibrary~ResourceLibrary : <code>object</code>
**Kind**: inner namespace of [<code>ResourceLibrary</code>](#module_ResourceLibrary)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| resources | <code>Array.&lt;Object&gt;</code> | Resources processes the raw REST response and delivers it in a useful way to the front end.  This matches the properties that are available in WordPress from getPost() with a few extra convenience properties |
| resources.getFeaturedImage(size) | <code>function</code> | Get the featured image at the requested size name (e.g. full, medium).  This must be defined in WordPress |
| resources.terms | <code>Array.&lt;Array.&lt;Object&gt;&gt;</code> | Convenience access for taxonomy terms.  The outer array is indexed by taxonomy, and the inner array contains the terms on this |

<a name="module_ResourceLibrary..ResourceLibrary"></a>

### ResourceLibrary~ResourceLibrary : <code>object</code>
**Kind**: inner namespace of [<code>ResourceLibrary</code>](#module_ResourceLibrary)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| pages | <code>Array.&lt;string&gt;</code> | An array of pagination data, including ellipses.  Always show 9 pages and insert ellipses in the correct spot. |

<a name="module_ResourceLibrary..afterCreated"></a>

### ResourceLibrary~afterCreated()
Override in order to call method after component is created

**Kind**: inner method of [<code>ResourceLibrary</code>](#module_ResourceLibrary)  
<a name="module_ResourceLibrary..onInitialLoad"></a>

### ResourceLibrary~onInitialLoad()
Override in order to call method on initial load

**Kind**: inner method of [<code>ResourceLibrary</code>](#module_ResourceLibrary)  
<a name="module_ResourceLibrary..onParamsChange"></a>

### ResourceLibrary~onParamsChange()
Override in order to call method after params change but not on initial load

**Kind**: inner method of [<code>ResourceLibrary</code>](#module_ResourceLibrary)  
<a name="module_ResourceLibrary..selectPage"></a>

### ResourceLibrary~selectPage(page, callback)
Select which page of results to display

**Kind**: inner method of [<code>ResourceLibrary</code>](#module_ResourceLibrary)  

| Param | Type | Description |
| --- | --- | --- |
| page | <code>number</code> | The page number |
| callback | <code>function</code> |  |

<a name="module_ResourceLibrary..setSearchTerms"></a>

### ResourceLibrary~setSearchTerms(search, callback)
Set search terms

**Kind**: inner method of [<code>ResourceLibrary</code>](#module_ResourceLibrary)  

| Param | Type | Description |
| --- | --- | --- |
| search | <code>string</code> | Search terms |
| callback | <code>function</code> |  |

<a name="module_ResourceLibrary..resetTerms"></a>

### ResourceLibrary~resetTerms(taxonomy, callback)
Reset taxonomy terms

**Kind**: inner method of [<code>ResourceLibrary</code>](#module_ResourceLibrary)  

| Param | Type | Description |
| --- | --- | --- |
| taxonomy | <code>string</code> | The taxonomy to use |
| callback | <code>function</code> |  |

<a name="module_ResourceLibrary..addTerms"></a>

### ResourceLibrary~addTerms(taxonomy, terms, callback)
Add taxonomy terms

**Kind**: inner method of [<code>ResourceLibrary</code>](#module_ResourceLibrary)  

| Param | Type | Description |
| --- | --- | --- |
| taxonomy | <code>string</code> | The taxonomy to use |
| terms | <code>integer</code> \| <code>Array.&lt;number&gt;</code> | The ID of the taxonomy to add |
| callback | <code>function</code> |  |

<a name="module_ResourceLibrary..removeTerms"></a>

### ResourceLibrary~removeTerms(taxonomy, terms, callback)
Remove taxonomy terms

**Kind**: inner method of [<code>ResourceLibrary</code>](#module_ResourceLibrary)  

| Param | Type | Description |
| --- | --- | --- |
| taxonomy | <code>string</code> | The taxonomy to use |
| terms | <code>number</code> \| <code>Array.&lt;number&gt;</code> | The ID of the taxonomy to remove |
| callback | <code>function</code> |  |

<a name="module_ResourceLibrary..setTerms"></a>

### ResourceLibrary~setTerms(taxonomy, terms, callback)
Set taxonomy terms.  This overwrites any current taxonomy temms.

**Kind**: inner method of [<code>ResourceLibrary</code>](#module_ResourceLibrary)  

| Param | Type | Description |
| --- | --- | --- |
| taxonomy | <code>string</code> | The taxonomy to use |
| terms | <code>number</code> \| <code>Array.&lt;number&gt;</code> | The ID of the taxonomy to remove |
| callback | <code>function</code> |  |

<a name="module_ResourceLibrary..joinTerms"></a>

### ResourceLibrary~joinTerms(item, taxonomy, separator)
Helper function to join taxonomy terms into a string to display on the front end

**Kind**: inner method of [<code>ResourceLibrary</code>](#module_ResourceLibrary)  

| Param | Type | Description |
| --- | --- | --- |
| item | <code>Object</code> | The item to join terms from |
| taxonomy | <code>string</code> | The taxonomy to use |
| separator | <code>string</code> | The separator to use |

<a name="module_ResourceLibrary..setOrder"></a>

### ResourceLibrary~setOrder(order, callback)
Set whether to order results in ascending or descending order

**Kind**: inner method of [<code>ResourceLibrary</code>](#module_ResourceLibrary)  

| Param | Type | Description |
| --- | --- | --- |
| order | <code>string</code> | Order direction. One of "asc" or "desc" |
| callback | <code>function</code> |  |

<a name="module_ResourceLibrary..setOrderBy"></a>

### ResourceLibrary~setOrderBy(orderby, callback)
Set the field to order results by

**Kind**: inner method of [<code>ResourceLibrary</code>](#module_ResourceLibrary)  

| Param | Type | Description |
| --- | --- | --- |
| orderby | <code>string</code> | The field to order by |
| callback | <code>function</code> |  |

<a name="module_ResourceLibrary..selectOrderBy"></a>

### ResourceLibrary~selectOrderBy(orderby, default_order, callback)
Convenience method to select an orderby and set the appropriate order, or toggle the order if already selected.

**Kind**: inner method of [<code>ResourceLibrary</code>](#module_ResourceLibrary)  

| Param | Type | Description |
| --- | --- | --- |
| orderby | <code>string</code> | The field to order by |
| default_order | <code>string</code> | Order direction.  One of  "asc" or "desc".  This will be used to sort results if the order has not been explicitly set. |
| callback | <code>function</code> |  |

<a name="module_ResourceLibrary..isOrderedBy"></a>

### ResourceLibrary~isOrderedBy(orderby, order) ⇒ <code>boolean</code>
Convenience method to see what we're ordered by in order to deal with postmeta

**Kind**: inner method of [<code>ResourceLibrary</code>](#module_ResourceLibrary)  
**Returns**: <code>boolean</code> - Whether or not results are currently ordered by orderby, and sorted in the order direction  

| Param | Type | Description |
| --- | --- | --- |
| orderby | <code>string</code> | The field to order by |
| order | <code>string</code> | The direction to order in |

<a name="module_ResourceLibrary..toggleOrder"></a>

### ResourceLibrary~toggleOrder()
Toggle the order direction from asc to desc or from desc to asc

**Kind**: inner method of [<code>ResourceLibrary</code>](#module_ResourceLibrary)  
<a name="module_ResourceLibrary..setMetaFilter"></a>

### ResourceLibrary~setMetaFilter(field, value)
Set a filter on a meta-value.  Currently only supports one field value per meta value.

**Kind**: inner method of [<code>ResourceLibrary</code>](#module_ResourceLibrary)  

| Param | Type | Description |
| --- | --- | --- |
| field | <code>string</code> | The meta field to set the filter on |
| value | <code>string</code> | The value to filter on |

<a name="module_ResourceLibrary..removeMetaFilter"></a>

### ResourceLibrary~removeMetaFilter(field)
Remove filters on a meta field

**Kind**: inner method of [<code>ResourceLibrary</code>](#module_ResourceLibrary)  

| Param | Type | Description |
| --- | --- | --- |
| field | <code>string</code> | The meta field to delete the filter on |

<a name="module_ResourceLibrary..clearMetaFilters"></a>

### ResourceLibrary~clearMetaFilters()
Clear all meta filters

**Kind**: inner method of [<code>ResourceLibrary</code>](#module_ResourceLibrary)  
<a name="module_ResourceLibrary..initialParams"></a>

### ResourceLibrary~initialParams() ⇒ <code>Object</code>
Get the params that the resource library was initialized with

**Kind**: inner method of [<code>ResourceLibrary</code>](#module_ResourceLibrary)  
**Returns**: <code>Object</code> - Object of initial values  
<a name="module_ResourceLibrary..reset"></a>

### ResourceLibrary~reset()
Reset params to their initial values

**Kind**: inner method of [<code>ResourceLibrary</code>](#module_ResourceLibrary)  
<a name="module_ResourceLibrary..triggerRootEvent"></a>

### ResourceLibrary~triggerRootEvent(event, args)
In case you need to communicate with something outside of Vue, call this to trigger an event on the Vue root element.  Attach a function to the Vue root element to then interact with the function.  The args will be passed to the "detail" arg in the function

**Kind**: inner method of [<code>ResourceLibrary</code>](#module_ResourceLibrary)  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>string</code> | The event type to trigger |
| args | <code>string</code> | The args to pass to the triggered function |

<a name="module_ResourceLibrary..serializeParams"></a>

### ResourceLibrary~serializeParams(params) ⇒ <code>string</code>
Serialize URL params

**Kind**: inner method of [<code>ResourceLibrary</code>](#module_ResourceLibrary)  
**Returns**: <code>string</code> - A URL param string (e.g. param1=value1&param2=value2)  

| Param | Type | Description |
| --- | --- | --- |
| params | <code>Object</code> | An object of key:value pairs corresponding to the URL params |

<a name="module_ResourceLibrary..unserializeParams"></a>

### ResourceLibrary~unserializeParams(param_string) ⇒ <code>Object</code>
Unserialize URL params to an object

**Kind**: inner method of [<code>ResourceLibrary</code>](#module_ResourceLibrary)  
**Returns**: <code>Object</code> - An object with key:value pairs corresponding to the URL params  

| Param | Type | Description |
| --- | --- | --- |
| param_string | <code>string</code> | A URL param string (e.g. param1=value1&param2=value2) |

