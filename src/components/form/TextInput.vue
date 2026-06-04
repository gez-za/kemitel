<script setup lang="ts">
import { ref } from "vue";
import { useField } from "vee-validate";
import { ExclamationTriangleIcon } from "@heroicons/vue/24/outline";

export interface InputProps {
  type?: string;
  disabled?: boolean;
  required?: boolean;
  id: string;
  name: string;
  placeholder?: string;
  pattern?: string;
  minlength?: number;
  min?: number;
  autocomplete?: string;
  inputClass?: string;
  labelHasBackground?: boolean;
}

const props = withDefaults(defineProps<InputProps>(), {
  type: "text",
  disabled: false,
  required: false,
  placeholder: undefined,
  pattern: undefined,
  minlength: undefined,
  min: undefined,
  autocomplete: undefined,
  inputClass: "",
  labelHasBackground: true,
});

const emit = defineEmits(["blur"]);

const isFocused = ref(false);

const {
  value: inputValue,
  handleChange,
  handleBlur,
  errorMessage,
} = useField<string>(() => props.name);

const onChange = (event: Event) => {
  handleChange(event, false);
};

const onBlur = (event: Event) => {
  handleBlur(event, true);
  isFocused.value = false;
  emit("blur");
};
</script>

<template>
  <div class="relative w-full">
    <div class="relative">
      <input
        :id="id"
        :value="inputValue"
        :type="type"
        :name="name"
        :data-testid="name"
        :disabled="disabled"
        :min="min"
        :autocomplete="autocomplete"
        :required="required"
        class="disabled:bg-sp-base-100 peer disabled:text-base-300 bg-login-field relative w-full appearance-none rounded-[10px] border-white bg-transparent px-2.5 pt-4 pb-2.5 text-sm text-black focus:border-gray-400 focus:ring-0 focus:outline-none disabled:cursor-not-allowed md:text-base"
        :class="[inputClass, { 'pl-10': $slots.left }]"
        placeholder=" "
        @input="onChange"
        @blur="onBlur"
      />
      <label
        :for="id"
        class="bg-duration-300 pointer-events-none absolute top-1.5 left-2 z-10 flex max-w-[calc(100%-24px)] origin-[0] -translate-y-4 scale-75 transform items-center px-2 text-sm text-gray-400 peer-placeholder-shown:pointer-events-auto peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-1.5 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 peer-focus:text-gray-400 md:text-base"
        :class="{
          'bg-white': labelHasBackground,
          'pl-8': $slots.left && !inputValue,
        }"
      >
        <span class="min-w-0 truncate">{{ placeholder }}</span>
        <span
          v-if="required"
          class="ml-0.5 shrink-0"
          :class="{ 'text-red-500': inputValue }"
          >*</span
        >
      </label>
      <span
        v-if="$slots.left"
        class="absolute inset-y-0 left-3 z-10 flex cursor-pointer items-center"
      >
        <slot name="left"></slot>
      </span>
      <span
        v-if="$slots.right"
        class="absolute inset-y-0 right-3 flex cursor-pointer items-center"
      >
        <slot name="right"></slot>
      </span>
    </div>
    <div
      v-if="errorMessage"
      class="flex items-center gap-1 pl-2 text-xs text-red-900"
      id="error-message"
      data-testid="textInput_error_message"
    >
      <ExclamationTriangleIcon class="size-3" />
      {{ errorMessage }}
    </div>
  </div>
</template>
