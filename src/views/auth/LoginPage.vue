<script setup lang="ts">
import TextInput from "@/components/form/TextInput.vue";
import PasswordInput from "@/components/form/PasswordInput.vue";
import { useI18n } from "vue-i18n";
import ButtonWrapper from "@/components/ButtonWrapper.vue";
import BaseImage from "@/components/BaseImage.vue";
import { computed, ref } from "vue";
import { useRoute } from "vue-router";

const { t } = useI18n({
  useScope: "global",
  inheritLocale: true,
  messages: {
    en: {
      title: "Login",
      description: "Welcome to Kemitel",
      forget_password: "Forgot your password?",
      username: "Username",
      password: "Password",
      submit_btn_lbl: "Sign In",
      sign_up_prompt: "Don't have an account?",
      sign_up_link: "Sign up",
      login_failed: "Please check your information and try again",
      required_fields: "Please fill in all required fields",
    },
    fr: {
      title: "Connexion",
      description: "Bienvenue sur Kemitel",
      forget_password: "Mot de passe oublié ?",
      username: "Nom d'utilisateur",
      password: "Mot de passe",
      submit_btn_lbl: "Connexion",
      sign_up_prompt: "Vous n'avez pas de compte ?",
      sign_up_link: "Sign up",
      login_failed: "Veuillez vérifier vos informations et réessayer",
      required_fields: "Veuillez renseigner tous les champs obligatoires",
    },
  },
});

const route = useRoute();
const missingUsername = ref(false);
const missingPassword = ref(false);
const loginFailed = computed(() => !!route.query.error);

const hasMissingFields = computed(
  () => missingUsername.value || missingPassword.value,
);
const errorMessage = computed(() =>
  loginFailed.value ? t("login_failed") : t("required_fields"),
);
const usernameInputClass = computed(() =>
  missingUsername.value || loginFailed.value
    ? "bg-login-field !border-red-900"
    : "bg-login-field",
);
const passwordInputClass = computed(() =>
  missingPassword.value || loginFailed.value
    ? "bg-login-field !border-red-900"
    : "bg-login-field",
);

const formAction = `${import.meta.env.VITE_OAUTH2_URL}/login?tenant-id=${import.meta.env.VITE_TENANT}`;
</script>

<template>
  <div class="w-full">
    <section
      class="mb-6 flex w-full flex-col items-center justify-center gap-y-2"
    >
      <div class="flex w-full justify-center">
        <BaseImage
          name="loginImag"
          path="image"
          class="h-28 w-28 object-contain sm:h-[150px] sm:w-[150px]"
        />
      </div>
      <h1
        data-testid="title"
        class="font-roboto-semiBold w-full text-center text-2xl font-semibold text-black sm:text-3xl"
      >
        {{ t("title") }}
      </h1>
      <span class="block w-full text-center text-base font-normal text-black">
        {{ t("description") }}
      </span>
    </section>

    <form
      autocomplete="off"
      data-testid="login-form"
      class="flex w-full flex-col gap-4"
      method="post"
      :action="formAction"
    >
      <div
        v-if="loginFailed || hasMissingFields"
        class="text-red-900"
        role="alert"
      >
        <p data-test="error-login-message" class="text-sm">
          {{ errorMessage }}
        </p>
      </div>
      <div class="flex flex-col gap-4">
        <TextInput
          id="username"
          name="username"
          :placeholder="t('username')"
          :required="true"
          autocomplete="username"
          :input-class="usernameInputClass"
          :label-has-background="false"
        />
        <PasswordInput
          id="password"
          name="password"
          :placeholder="t('password')"
          :required="true"
          autocomplete="current-password"
          :input-class="passwordInputClass"
          :label-has-background="false"
        />
      </div>
      <router-link
        to="/forgot-password"
        class="font-poppins-regular inline-block text-right text-sm font-normal text-blue-100 underline"
        data-testid="forgot-password-link"
      >
        {{ t("forget_password") }}
      </router-link>
      <ButtonWrapper
        type="submit"
        data-testid="submit-button"
        class="font-poppins-medium my-4 h-12 w-full cursor-pointer rounded-full bg-blue-700 px-6 py-2 text-base font-medium text-white hover:bg-blue-700/70 sm:text-lg"
      >
        {{ t("submit_btn_lbl") }}
      </ButtonWrapper>
      <p class="text-center text-sm text-black">
        {{ t("sign_up_prompt") }}
        <button
          type="button"
          class="cursor-default font-medium text-blue-700 underline"
          data-testid="signup-link"
        >
          {{ t("sign_up_link") }}
        </button>
      </p>
    </form>
  </div>
</template>

<style scoped></style>
