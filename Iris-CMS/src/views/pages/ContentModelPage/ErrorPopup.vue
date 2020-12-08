<template>
  <vs-popup
    title="Error List"
    :active.sync="popupActive"
  >
    <vs-table :data="errors">
      <template slot="thead">
        <vs-th>No.</vs-th>
        <vs-th>Message</vs-th>
        <vs-th>Path</vs-th>
      </template>

      <template slot-scope="{ data }">
        <vs-tr :key="indextr" v-for="(tr, indextr) in data">
          
            <vs-td>
              {{indextr + 1}}.
            </vs-td>

            <vs-td>
              {{tr.message}}
            </vs-td>

            <vs-td>
              {{tr.dataPath}}
            </vs-td>
        </vs-tr>
      </template>
    </vs-table>
  </vs-popup>
</template>
<script>
export default {
  props: {
    errors: {
      type: Array,
      required: true,
      default: () => [],
    },
  },
  name: "ErrorPopup",
  data() {
    return {
      popupActive: false,
    };
  },
  watch: {
    popupActive(newval) {
      if (!newval) {
        this.reset();
      } else {
        setTimeout(() => {
          this.focus();
        }, 1000);
      }
    },
  },
  methods: {
    focus() {},
    open() {
      this.popupActive = true;
    },
    close() {
      this.popupActive = false;
    },
    toggle() {
      this.popupActive = !this.popupActive;
    },
    reset() {},
  },
};
</script>
