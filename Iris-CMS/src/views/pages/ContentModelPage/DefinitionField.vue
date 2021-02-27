<template>
  <draggable
    v-if="definitions.length > 0"
    tag="ul"
    :list="definitions"
    class="list-group"
    handle=".handle"
  >
    <transition-group>
      <div
        class="flex my-3"
        v-for="(definition, index) in definitions"
        :key="definition.api_label"
      >
        <feather-icon
          icon="MenuIcon"
          svgClasses="h-4 w-4 cursor-pointer text-danger"
          class="hover:text-danger handle"
        />
        <vx-card
          class="flex-1 pb-5"
          :title="
            definition.title +
              ' (' +
              $options.filters.title(definition.type) +
              ')'
          "
          :subtitle="definition.description"
        >
          <template slot="actions">
          <div class="flex">
              <input type="checkbox" style="transform:scale(1)" class="mt-1 mx-2 text-sm" v-model="definition.hidden_field" >Hidden
              <feather-icon
                icon="EditIcon"
                class="ml-4"
                @click="$emit('edit', { definition, path })"
              />
              <feather-icon
                icon="TrashIcon"
                class="ml-4"
                @click="$emit('delete', { index, path })"
              />
            </div>
          </template>
          <vs-button
            v-if="
              ['array', 'object'].includes(definition.type) &&
                (definition.schema.definitions == null ||
                  Array.isArray(definition.schema.definitions))
            "
            @click="
              $emit('add-field', {
                index,
                path: path.concat([definition.api_label]),
              })
            "
            type="border"
            class="m-3"
          >
            Add Field
          </vs-button>
          <definition-field
            v-if="['array', 'object'].includes(definition.type)"
            :path="path.concat([definition.api_label])"
            @edit="$emit('edit', $event)"
            @delete="$emit('delete', $event)"
            @add-field="$emit('add-field', $event)"
            :definitions="
              !Array.isArray(definition.schema.definitions)
                ? definition.schema.definitions == null
                  ? []
                  : [definition.schema.definitions]
                : definition.schema.definitions
            "
          />
        </vx-card>
      </div>
    </transition-group>
  </draggable>
  <div class="flex w-full justify-center" v-else>
    <center>
      <h3>
        No Field Available.
      </h3>
    </center>
  </div>
</template>

<script>
import EventBus from "@/event-bus";
import draggable from "vuedraggable";
export default {
  components: {
    draggable,
  },
  name: "DefinitionField",
  mounted() {
    EventBus.$on("force-refresh", () => {
      this.$forceUpdate();
    });
  },
  props: {
    definitions: {
      type: Array,
      required: true,
      default: () => [],
    },
    path: {
      type: Array,
      required: true,
      default: () => [],
    },
  },
};
</script>

<style></style>
