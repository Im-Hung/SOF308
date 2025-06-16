<template>
  <router-link class="logo navbar-brand fs-3 fw-bold text-primary" to="/">V-TEC</router-link>
  <div class="min-vh-100 d-flex align-items-center justify-content-center bg-light">
    <div class="card shadow-lg w-100" style="max-width: 900px">
      <div class="row g-0">
        <!-- Left Image -->
        <div class="col-md-6 d-none d-md-block" :style="imageStyle"></div>

        <!-- Right Forms -->
        <div class="col-md-6 p-4">
          <!-- Tabs -->
          <div class="d-flex justify-content-between mb-3">
            <button class="btn btn-link text-primary fw-bold" @click="currentForm = 'login'">
              Login
            </button>
            <button class="btn btn-link text-primary fw-bold" @click="currentForm = 'signup'">
              Signup
            </button>
            <button class="btn btn-link text-primary fw-bold" @click="currentForm = 'recovery'">
              Recover
            </button>
          </div>

          <!-- Login Form -->
          <form v-if="currentForm === 'login'" @submit.prevent="showAlert('Login successful!')">
            <h3 class="mb-3 fw-bold">Login</h3>
            <div class="mb-3">
              <input type="email" class="form-control" placeholder="Email" required />
            </div>
            <div class="mb-3 position-relative">
              <input
                :type="showPassword.login ? 'text' : 'password'"
                id="loginPassword"
                class="form-control"
                placeholder="Password"
                required
              />
              <button
                type="button"
                class="btn btn-sm position-absolute top-0 end-0 mt-1 me-2"
                @click="togglePassword('login')"
              >
                👁️
              </button>
            </div>
            <button type="submit" class="btn btn-primary w-100">Login</button>
            <button type="button" class="btn btn-danger w-100 mt-2" @click="loginWithGoogle">
              Login with Google
            </button>
          </form>

          <!-- Signup Form -->
          <form v-if="currentForm === 'signup'" @submit.prevent="showAlert('Signup successful!')">
            <h3 class="mb-3 fw-bold">Signup</h3>
            <div class="mb-3">
              <input type="text" class="form-control" placeholder="Name" required />
            </div>
            <div class="mb-3">
              <input type="email" class="form-control" placeholder="Email" required />
            </div>
            <div class="mb-3">
              <input
                type="password"
                class="form-control"
                placeholder="Password"
                required
                minlength="6"
              />
            </div>
            <button type="submit" class="btn btn-success w-100">Signup</button>
          </form>

          <!-- Recovery Form -->
          <form
            v-if="currentForm === 'recovery'"
            @submit.prevent="showAlert('Recovery email sent!')"
          >
            <h3 class="mb-3 fw-bold">Password Recovery</h3>
            <div class="mb-3">
              <input type="email" class="form-control" placeholder="Email" required />
            </div>
            <button type="submit" class="btn btn-warning w-100 text-white">Recover Password</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const currentForm = ref('login')
const showPassword = ref({ login: false })

function togglePassword(field) {
  showPassword.value[field] = !showPassword.value[field]
}

function showAlert(message) {
  alert(message)
}

function loginWithGoogle() {
  window.open(
    'https://accounts.google.com/v3/signin/identifier?ifkv=AdBytiMtQj_kSSZVtJ9EcDIsptcOwVSHfJyoYjUGGaTku1-6KKOwVee8benAAfALqxFEPA_izcJy6A&flowName=GlifWebSignIn&flowEntry=ServiceLogin&dsh=S1747047877%3A1750043689652817',
    '_blank',
  )
}

const imageStyle = {
  backgroundImage:
    "url('https://images.unsplash.com/reserve/LJIZlzHgQ7WPSh5KVTCB_Typewriter.jpg?q=80&w=1992&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  borderTopLeftRadius: '0.375rem',
  borderBottomLeftRadius: '0.375rem',
}
</script>

<style scoped>
.logo {
  font-size: 50px !important;
  margin: 10px 0;
  display: flex;
  top: 200px;
  justify-content: center;
  align-items: center;
}
* {
  transition: 0.3s ease;
}
button.btn-link {
  text-decoration: none;
}
</style>
