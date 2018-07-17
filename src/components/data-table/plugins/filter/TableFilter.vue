<template>
  <div class="q-data-table-toolbar upper-toolbar row col items-center">
    <q-search
      class="col"
      v-model="filtering.terms"
      :placeholder="labels.search"
    ></q-search>
  </div>
</template>

<script>
import { QSearch } from '../../../search'

export default {
  name: 'q-table-filter',
  components: {
    QSearch
  },
  props: ['filtering', 'columns', 'labels']
}
</script>
