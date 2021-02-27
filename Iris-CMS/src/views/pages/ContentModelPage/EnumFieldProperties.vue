<template>
  <div>
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
                title="Default"
                @click.prevent.stop="
                  def = tr.value;
                  $emit('setDefault', tr.value);
                "
                :icon="tr.value == def ? 'CheckSquareIcon' : 'SquareIcon'"
                svgClasses="h-4 w-4"
                class="mr-2"
              />
              <feather-icon
                title="Delete Option"
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
    <!-- default -->

    <div class="flex m-3">
      <vs-switch v-model="required" @input="$emit('setRequired', $event)">
      </vs-switch>
      <label class="mx-3">Required?</label>
    </div>
  </div>
</template>

<script>
export default {
  watch: {
    enum_datas: {
      handler: function(newVal) {
        this.$emit(
          "setEnum",
          newVal.filter((t) => !t.type)
        );
      },
      deep: true,
    },
  },
  props: ["schema"],
  mounted() {
    // console.log(this.schema.enum);
    this.enum_datas.unshift(...this.schema.enum);
    this.def = this.schema.default;
    this.required = this.schema.isNotEmpty;
  },
  data() {
    return {
      required: false,
      def: "",
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
