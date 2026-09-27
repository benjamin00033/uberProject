<script setup lang="ts">
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonItem,
  IonInput,
  IonButton,
} from "@ionic/vue";
import { useRouter } from "vue-router";
import { ref } from "vue";
import CenterLayout from "@/components/Layout/CenterLayout.vue";

const router = useRouter();
const username = ref("");
const password = ref("");

const handleLogin = () => {
  // In a real app, authenticate here.
  // We'll just redirect to home.
  router.push("/menu");
};

const goToForgotPassword = () => {
  router.push("/forgot-password");
};
</script>

<template>
  <CenterLayout>
    <ion-card class="auth-card">
      <ion-card-header>
        <ion-card-title class="text-center">{{
          $t("auth.login.title")
        }}</ion-card-title>
      </ion-card-header>
      <ion-card-content>
        <div class="form-group">
          <ion-item class="custom-item">
            <ion-input
              :label="$t('auth.login.usernameLabel')"
              label-placement="floating"
              v-model="username"
              :placeholder="$t('auth.login.usernamePlaceholder')"
            ></ion-input>
          </ion-item>
          <ion-item class="custom-item">
            <ion-input
              :label="$t('auth.login.passwordLabel')"
              label-placement="floating"
              type="password"
              v-model="password"
              :placeholder="$t('auth.login.passwordPlaceholder')"
            ></ion-input>
          </ion-item>
        </div>

        <ion-button expand="block" @click="handleLogin" class="login-btn">
          {{ $t("auth.login.loginButton") }}
        </ion-button>
        <div class="links">
          <a
            href="#"
            @click.prevent="goToForgotPassword"
            class="forgot-link"
            >{{ $t("auth.login.forgotPasswordLink") }}</a
          >
        </div>
      </ion-card-content>
    </ion-card>
  </CenterLayout>
</template>

<style scoped lang="scss">
.auth-card {
  width: 100%;
}

.text-center {
  text-align: center;
}

.form-group {
  margin-bottom: 2rem;
}

.custom-item {
  --background: transparent;
}

.login-btn {
  margin-top: 1rem;
}

.links {
  text-align: center;
  margin-top: 1.5rem;
}

.forgot-link {
  text-decoration: none;
  font-size: 0.9rem;

  &:hover {
    text-decoration: underline;
  }
}
</style>
