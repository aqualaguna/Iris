<template>
  <vs-table :data="enum_datas">
    <template slot="thead">
      <vs-th>Key</vs-th>
      <vs-th>Value</vs-th>
      <vs-th>Action</vs-th>
    </template>

    <template slot-scope="{ data }">
      <vs-tr :key="indextr" v-for="(tr, indextr) in data">
        <vs-td colspan="3" v-if="tr.type && tr.type == 'add'">
          <vs-button
            type="border"
            class="w-full"
            @click.prevent.stop="enum_datas.unshift({ key: '', value: '' })"
          >
            Add new Option.
          </vs-button>
        </vs-td>
        <template v-else>
          <vs-td :data="data[indextr].key">
            <vs-input v-model="tr.key" />
          </vs-td>

          <vs-td :data="data[indextr].value">
            <vs-input v-model="tr.value" />
          </vs-td>

          <vs-td>
            <feather-icon
              @click.prevent.stop="enum_datas.splice(indextr, 1)"
              icon="TrashIcon"
              svgClasses="h-4 w-4"
              class="mr-2"
            />
          </vs-td>
        </template>
      </vs-tr>
    </template>
  </vs-table>
</template>

<script>
export default {
  watch: {
    'enum_datas': {
      handler: function(newVal) {
        this.$emit('setEnum', newVal.filter(t => !t.type));
      },
      deep: true,
    }
  },
  data() {
    return {
      enum_datas: [
        {
          type: "add",
        },
      ],
    };
  },
};
</script>

<style></style>
