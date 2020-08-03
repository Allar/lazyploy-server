<template lang="pug">
b-card(header="Builds" header-tag="header")
  FeathersVuexFind(service='builds' :query='{$sort: {createdAt: -1 }, $limit: 50}')
    div(slot-scope='{ items }')
      b-table(small striped hover :items='items' :current-page='currentPage' primary-key="buildid" :per-page='perPage' :fields=[{ key: 'buildid', label: 'Build Id'}, 'project', 'status', 'desc', 'platforms'])
        template(v-slot:cell(platforms)='data')
          FeathersVuexFind(service='buildUploads' :query='{$sort: {platform: -1 }, buildid: data.item.buildid }')
            div(slot-scope='{ items }')
              ul.platformList
                li(v-for="item in items")
                  a(:class="{ Windows: item.platform == 'Windows', WindowsServer: item.platform == 'WindowsServer', Linux: item.platform == 'Linux', LinuxServer: item.platform == 'LinuxServer', OSX: item.platform == 'OSX'}" 
                   :href="'http://localhost:3030/' + item.serveDir + '/' + item.filename"
                   target='_blank'
                  )
      b-pagination(v-model='currentPage', :total-rows='items.length', :per-page='perPage' align="fill")

</template>

<script>

//import { computed } from '@vue/composition-api';
//import { useFind } from 'feathers-vuex';

export default {
  name: 'BuildList',
  components: {
  },
  data() {
    return {
      totalRows: 20,
      currentPage: 1,
      perPage: 5
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

ul.platformList { 
  padding: 0;
  list-style: none;
}

.platformList li {
  display: inline;
}

.platformList li a {
  padding-left:24px;
}

.platformList li a.Windows {
  background:url(/assets/Windows.svg) no-repeat left center;
}

.platformList li a.WindowsServer {
  background:url(/assets/WindowsServer.svg) no-repeat left center;
}

.platformList li a.Linux {
  background:url(/assets/Linux.svg) no-repeat left center;
}

.platformList li a.LinuxServer {
  background:url(/assets/LinuxServer.svg) no-repeat left center;
}

.platformList li a.OSX {
  background:url(/assets/OSX.svg) no-repeat left center;
}

</style>
