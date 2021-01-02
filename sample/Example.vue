<template>
  <div class="resource-library">
    <input v-model="keyword" @keyup.enter="setSearch(keyword)" />
    <button class="search" @click="doSearch()"></button>
    <p>{{ pagination_data.total }} results</p>

    <div class="full-screen">
      <div class="loader" v-show="loading">Loading...</div>
      <div class="loader" v-if="error">{{ error }}</div>

      <div>
        <ul>
          <li v-for="post in resources" :key="post.id">
            <a :href="post.link">{{ post.title }}</a>
            <br />
            <small class="meta">
              <template v-for="taxonomy in post.terms">
                <a v-for="term in taxonomy" :key="term.id" :href="term.link" class="term">{{ term.name }}</a>
              </template>
            </small>
          </li>
        </ul>

        <div class="pagination">
          <button v-for="page in pages" :key="page" @click="selectPage(page)" :class="{ currentPage: params.pagenum === page }">
            {{ page }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import VueWPResourceLibrary from 'vue-wp-resource-library';

  export default {
    name: 'ResourceLibrary',
    extends: VueWPResourceLibrary,
    // custom data, computed, methods etc can be defined here.
    data() {
      return {
        keyword: '',
      };
    },

    methods: {
      onParamsChange() {
        if (this.params.search !== this.keyword) {
          this.keyword = this.params.search;
        }
      },
      doSearch() {
        setSerch(this.keyword);
      },
    },
  };
</script>

<style scoped>
  .meta {
    padding-left: 1rem;
  }
  .term + .term:before {
    content: ', ';
  }

  .full-screen {
    min-height: 60vh;
    position: relative;
  }

  .loader {
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    backdrop-filter: blur(5px);
  }

  .pagination {
    display: flex;
    justify-content: space-evenly;
    max-width: 500px;
    margin: 1rem auto;
  }

  .pagination button {
    background: transparent;
    outline: none;
    border: none;
    cursor: pointer;
  }
  .currentPage {
    text-decoration: underline;
  }
</style>