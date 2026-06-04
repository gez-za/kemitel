<script setup lang="ts">
import {
  EyeIcon,
  EyeSlashIcon,
  ExclamationTriangleIcon,
} from "@heroicons/vue/24/outline";
import { ref } from "vue";
import { useField } from "vee-validate";

export interface InputProps {
  type?: string;
  disabled?: boolean;
  required?: boolean;
  id: string;
  name: string;
  placeholder?: string;
  pattern?: string;
  minlength?: number;
  autocomplete?: string;
  inputClass?: string;
  labelHasBackground?: boolean;
}

const props = withDefaults(defineProps<InputProps>(), {
  type: "password",
  disabled: false,
  required: false,
  placeholder: undefined,
  pattern: undefined,
  minlength: undefined,
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

const showPassword = ref(false);

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};
</script>

<template>
  <div class="relative w-full">
    <div class="relative">
      <input
        :id="id"
        :type="
          props.type === 'password'
            ? showPassword
              ? 'text'
              : 'password'
            : props.type
        "
        :name="name"
        :data-testid="name"
        :value="inputValue"
        placeholder=" "
        :disabled="disabled"
        :autocomplete="autocomplete"
        class="disabled:bg-sp-base-100 peer disabled:text-base-300 border-while bg-login-field w-full appearance-none rounded-[10px] border-white bg-transparent pt-4 pr-2.5 pb-2.5 pl-2.5 text-sm text-black focus:border-gray-400 focus:ring-0 focus:outline-none disabled:cursor-not-allowed md:text-base"
        :class="inputClass"
        @input="onChange"
        @blur="onBlur"
        :required="required"
        :pattern="pattern"
        :minlength="minlength"
      />
      <label
        :for="id"
        class="bg-color-white pointer-events-none absolute top-1.5 left-2 z-10 flex max-w-[calc(100%-24px)] origin-[0] -translate-y-4 scale-75 transform items-center px-2 text-sm text-gray-400 duration-300 peer-placeholder-shown:pointer-events-auto peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-1.5 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 peer-focus:text-gray-400 md:text-base"
        :class="{ 'bg-white': labelHasBackground }"
      >
        <span class="min-w-0 truncate">{{ placeholder }}</span>
        <span
          v-if="required"
          class="ml-0.5 shrink-0"
          :class="{ 'text-error': !!inputValue }"
          >*</span
        >
      </label>
      <span
        v-if="props.type === 'password' && inputValue"
        class="absolute inset-y-0 right-3 flex cursor-pointer items-center"
        data-testid="toggle-icon"
        @click="togglePasswordVisibility"
      >
        <EyeIcon v-if="!showPassword" class="size-4" />
        <EyeSlashIcon v-else class="size-4" />
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
