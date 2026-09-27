<script setup lang="ts">
import { useRouter } from "vue-router";
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import CenterLayout from "@/components/Layout/CenterLayout.vue";

const router = useRouter();
const email = ref("");
const { t } = useI18n();

const handleReset = () => {
  // In a real app, send reset link.
  alert(t('auth.forgotPassword.alertSent') + email.value);
  router.push("/login");
};

const goToLogin = () => {
  router.push("/login");
};
</script>

<template>
  <CenterLayout>
    <ion-card class="auth-card">
      <ion-card-header>
        <ion-card-title class="text-center">{{ $t('auth.forgotPassword.title') }}</ion-card-title>
      </ion-card-header>
      <ion-card-content>
        <p class="instruction-text">
          {{ $t('auth.forgotPassword.instruction') }}
        </p>
        <div class="form-group">
          <ion-item class="custom-item">
            <ion-input
              :label="$t('auth.forgotPassword.emailLabel')"
              label-placement="floating"
              type="email"
              v-model="email"
              :placeholder="$t('auth.forgotPassword.emailPlaceholder')"
            ></ion-input>
          </ion-item>
        </div>

        <ion-button expand="block" @click="handleReset" class="reset-btn">
          {{ $t('auth.forgotPassword.resetButton') }}
        </ion-button>
        <div class="links">
          <a href="#" @click.prevent="goToLogin" class="login-link"
            >{{ $t('auth.forgotPassword.backToLoginLink') }}</a
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

.instruction-text {
  text-align: center;
  margin-bottom: 1.5rem;
  font-size: 0.95rem;
}

.form-group {
  margin-bottom: 2rem;
}

.custom-item {
  --background: transparent;
}

.reset-btn {
  margin-top: 1rem;
}

.links {
  text-align: center;
  margin-top: 1.5rem;
}

.login-link {
  text-decoration: none;
  font-size: 0.9rem;

  &:hover {
    text-decoration: underline;
  }
}
</style>
