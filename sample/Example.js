import Vue from 'vue';
import ResourceLibrary from './Example.vue';

new Vue({
  el: '#root',
  props: {
    // all props are optional.
    post_type: 'posts',
    per_page: 10,
    meta_fields: {},
    initial_page: 1,
    initial_search: '',
    initial_order: 'desc',
    initial_orderby: 'date',
    initial_taxonomies: {},
    initial_meta_query: {},
  },
  render: (h) => h(ResourceLibrary),
});
