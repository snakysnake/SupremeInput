<template>
  <div class="mt-2">
    <label v-if="label" :for="realId" class="block mb-2 text-sm font-medium">{{
      label
    }}</label>
    <input
      v-if="type == 'text'"
      :id="realId"
      type="text"
      :placeholder="placeholder"
      :value="modelValue"
      :disabled="disabled"
      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 focus:outline-none block w-full p-2.5"
      :model="modelValue"
      :required="required"
      :aria-describedby="describedById"
      @input="$emit('update:modelValue', $event.target.value)"
    />
    <textarea
      v-if="type == 'textarea'"
      :id="realId"
      rows="4"
      :model="modelValue"
      class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-xl shadow border border-gray-300 focus:ring-green-500 focus:border-green-500 focus:outline-none"
      autocorrect="off"
      spellcheck="false"
      :placeholder="placeholder"
      :required="required"
      @input="$emit('update:modelValue', $event.target.value)"
    />
    <input
      v-if="type == 'time'"
      :id="realId"
      type="time"
      :value="modelValue"
      :required="required"
      :placeholder="placeholder"
      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 focus:outline-none block w-full p-2.5"
      :model="modelValue"
      :aria-describedby="describedById"
      @input="$emit('update:modelValue', $event.target.value)"
    />
    <input
      v-if="type == 'color'"
      :id="realId"
      type="color"
      :value="modelValue"
      :required="required"
      :placeholder="placeholder"
      class="bg-gray-50 text-gray-900 text-sm focus:ring-green-500 focus:border-green-500 focus:outline-none h-14 block w-full"
      :model="modelValue"
      :aria-describedby="describedById"
      @input="$emit('update:modelValue', $event.target.value)"
    />
    <div v-else-if="type == 'range'">
      <input
        :id="realId"
        type="range"
        :required="required"
        :min="min"
        :max="max"
        :value="modelValue"
        class="range"
        :step="step"
        :aria-describedby="describedById"
        @input="$emit('update:modelValue', $event.target.value)"
      />
      <div
        v-if="step > 0"
        class="w-full flex justify-between text-xs px-2"
        aria-hidden="true"
      >
        <span v-for="index in amountOfDivisionSteps" :key="index" class="overflow-hidden"
          >|</span
        >
      </div>
    </div>
    <div v-else-if="type == 'checkbox'" class="div">
      <input
        v-if="modelValue == true"
        :id="realId"
        type="checkbox"
        :required="required"
        checked
        class="checkbox"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.checked)"
      />
      <input
        v-else
        :id="realId"
        type="checkbox"
        :required="required"
        class="checkbox"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.checked)"
      />
    </div>
    <div v-else-if="type == 'toggle'">
      <input
        v-if="modelValue == true"
        :id="realId"
        checked
        type="checkbox"
        class="toggle"
        :required="required"
        :model="modelValue"
        :aria-describedby="describedById"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.checked)"
      />
      <input
        v-else
        :id="realId"
        type="checkbox"
        class="toggle"
        :required="required"
        :model="modelValue"
        :aria-describedby="describedById"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.checked)"
      />
    </div>
    <input
      v-else-if="type == 'tel'"
      :id="realId"
      type="tel"
      :required="required"
      :value="modelValue"
      :placeholder="placeholder"
      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 focus:outline-none block w-full p-2.5"
      :model="modelValue"
      :aria-describedby="describedById"
      @input="$emit('update:modelValue', $event.target.value)"
    />
    <input
      v-else-if="type == 'password'"
      type="password"
      :required="required"
      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 focus:outline-none block w-full p-2.5"
      :autocomplete="autocomplete"
      :minlength="minlength"
      :model="modelValue"
      :aria-describedby="describedById"
      @input="$emit('update:modelValue', $event.target.value)"
    />
    <input
      v-else-if="type == 'email'"
      type="email"
      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 focus:outline-none block w-full p-2.5"
      :model="modelValue"
      :value="modelValue"
      :required="required"
      :placeholder="placeholder"
      :aria-describedby="describedById"
      @input="$emit('update:modelValue', $event.target.value)"
    />
    <input
      v-else-if="type == 'number'"
      :id="realId"
      type="number"
      inputmode="numeric"
      :value="modelValue"
      :placeholder="placeholder"
      :min="min"
      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 focus:outline-none block w-full p-2.5"
      :model="modelValue"
      :aria-describedby="describedById"
      @input="$emit('update:modelValue', $event.target.value)"
    />
    <p
      v-if="description.length > 0"
      :id="describedById"
      class="text-gray-700 text-xs p-1"
    >
      {{ description }}
    </p>
  </div>
</template>

<script lang="ts">
import md5 from "md5"; // we use md5 for id creation.. makes it kind of predictable for search engines, so random shit doesnt just change
import { defineComponent } from "vue";

// heavily inspired from:
// https://www.youtube.com/watch?v=CALrQCw41dI
// (...watch to understand v-model with custom components)

export default defineComponent({
  name: "SupremeLabel",
  props: {
    modelValue: {
      type: String,
    },
    minlength: {
      type: Number,
      default: 0,
    },
    type: {
      type: String,
      default: "text",
    },
    id: {
      type: String,
      default: "",
    },
    label: {
      type: String,
      default: "",
    },
    placeholder: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      default: "",
    },
    min: {
      type: Number,
      default: 0,
    },
    max: {
      type: Number,
      default: 1,
    },
    autocomplete: {
      type: String,
      default: "",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    step: {
      type: Number,
      default: 0,
    },
    required: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      realId: "",
    };
  },
  computed: {
    describedById() {
      return this.realId + "-help";
    },
    amountOfDivisionSteps() {
      const length = Math.floor(this.max - this.min);
      return Number(Math.floor(length / this.step) + 1);
    },
  },
  created() {
    // ... give random id if not set
    if (this.id == "") {
      this.realId = md5(this.label);
    } else {
      this.realId = this.id;
    }
  },
});
</script>
