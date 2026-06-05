<script setup lang="ts">
import TextInput from "@/components/form/TextInput.vue";
import PasswordInput from "@/components/form/PasswordInput.vue";
import { useI18n } from "vue-i18n";
import ButtonWrapper from "@/components/ButtonWrapper.vue";
import BaseImage from "@/components/BaseImage.vue";
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth.store";
import { ExclamationTriangleIcon } from "@heroicons/vue/24/outline";

const { t } = useI18n({
  useScope: "global",
  inheritLocale: true,
  messages: {
    en: {
      title: "Login",
      description: "Welcome to Kemitel",
      forget_password: "Forgot your password?",
      username: "Email",
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
      username: "Email",
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
const router = useRouter();
const authStore = useAuthStore();

const email = ref("");
const password = ref("");
const loading = ref(false);
const error = ref("");

const loginFailed = computed(() => !!error.value);

const usernameInputClass = computed(() =>
  loginFailed.value ? "!border-red-500" : "border-gray-200",
);
const passwordInputClass = computed(() =>
  loginFailed.value ? "!border-red-500" : "border-gray-200",
);

const handleLogin = async () => {
  if (!email.value || !password.value) {
    error.value = t("required_fields");
    return;
  }

  loading.value = true;
  error.value = "";
  try {
    await authStore.login(email.value, password.value);
    router.push("/");
  } catch (e: any) {
    console.error(e);
    error.value = t("login_failed");
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="w-full max-w-md mx-auto p-6">
    <section
      class="mb-10 flex w-full flex-col items-center justify-center gap-y-4"
    >
      <div class="flex w-full justify-center">
        <BaseImage
          name="loginImag"
          path="image"
          class="h-24 w-24 object-contain sm:h-32 sm:w-32"
        />
      </div>
      <div class="text-center">
        <h1
          data-testid="title"
          class="font-roboto-semiBold text-2xl font-bold text-gray-900 sm:text-3xl"
        >
          {{ t("title") }}
        </h1>
        <p class="mt-2 text-gray-500">
          {{ t("description") }}
        </p>
      </div>
    </section>

    <div class="flex w-full flex-col gap-6">
      <div
        v-if="error"
        class="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 flex items-center gap-2"
        role="alert"
      >
        <ExclamationTriangleIcon class="h-5 w-5 shrink-0" />
        <p data-test="error-login-message" class="text-sm font-medium">
          {{ error }}
        </p>
      </div>
      
      <div class="flex flex-col gap-5">
        <TextInput
          id="email"
          name="email"
          v-model="email"
          :placeholder="t('username')"
          :required="true"
          autocomplete="email"
          :input-class="usernameInputClass"
          :label-has-background="true"
        />
        <PasswordInput
          id="password"
          name="password"
          v-model="password"
          :placeholder="t('password')"
          :required="true"
          autocomplete="current-password"
          :input-class="passwordInputClass"
          :label-has-background="true"
        />
      </div>

      <div class="flex items-center justify-end">
        <router-link
          to="/forgot-password"
          class="text-sm font-medium text-blue-600 hover:text-blue-500"
          data-testid="forgot-password-link"
        >
          {{ t("forget_password") }}
        </router-link>
      </div>

      <ButtonWrapper
        @click="handleLogin"
        :loading="loading"
        data-testid="submit-button"
        class="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-base font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
      >
        {{ t("submit_btn_lbl") }}
      </ButtonWrapper>

      <div class="text-center">
        <p class="text-sm text-gray-600">
          {{ t("sign_up_prompt") }}
          <button
            type="button"
            class="ml-1 font-semibold text-blue-600 hover:text-blue-500 underline"
            data-testid="signup-link"
          >
            {{ t("sign_up_link") }}
          </button>
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
