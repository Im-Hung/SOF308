<template>
  <section style="background-color: #eee">
    <div class="container py-5">
      <div class="row">
        <div class="col">
          <nav aria-label="breadcrumb" class="bg-body-tertiary rounded-3 p-3 mb-4">
            <ol class="breadcrumb mb-0">
              <li class="breadcrumb-item"><a href="/">Home</a></li>
              <li class="breadcrumb-item active" aria-current="page">User Profile</li>
            </ol>
          </nav>
        </div>
      </div>

      <div class="row">
        <div class="col-lg-4">
          <div class="card mb-4">
            <div class="card-body text-center">
              <img :src="form.avatar" alt="avatar" class="rounded-circle img-fluid" style="width: 150px" />
              <h5 class="my-3">{{ form.fullName }}</h5>
              <p class="text-muted mb-1">Full Stack Developer</p>
              <p class="text-muted mb-4">{{ form.address }}</p>
              <div class="d-flex justify-content-center mb-2">
                <button type="button" data-mdb-button-init data-mdb-ripple-init class="btn btn-primary">
                  Follow
                </button>
                <router-link type="button" data-mdb-button-init data-mdb-ripple-init
                  class="btn btn-outline-primary ms-1" to="/editProfile">
                  Edit Profile
                </router-link>
              </div>
            </div>
          </div>
          <div class="card mb-4 mb-lg-0">
            <div class="card-body p-0">
              <ul class="list-group list-group-flush rounded-3">
                <li class="list-group-item d-flex justify-content-between align-items-center p-3">
                  <i class="fas fa-globe fa-lg text-warning"></i>
                  <p class="mb-0">https://mdbootstrap.com</p>
                </li>
                <li class="list-group-item d-flex justify-content-between align-items-center p-3">
                  <i class="fab fa-github fa-lg text-body"></i>
                  <p class="mb-0">mdbootstrap</p>
                </li>
                <li class="list-group-item d-flex justify-content-between align-items-center p-3">
                  <i class="fab fa-twitter fa-lg" style="color: #55acee"></i>
                  <p class="mb-0">@mdbootstrap</p>
                </li>
                <li class="list-group-item d-flex justify-content-between align-items-center p-3">
                  <i class="fab fa-instagram fa-lg" style="color: #ac2bac"></i>
                  <p class="mb-0">mdbootstrap</p>
                </li>
                <li class="list-group-item d-flex justify-content-between align-items-center p-3">
                  <i class="fab fa-facebook-f fa-lg" style="color: #3b5998"></i>
                  <p class="mb-0">mdbootstrap</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="col-lg-8">
          <div class="card mb-4">
            <div class="card-body">
              <div class="row">
                <div class="col-sm-3">
                  <p class="mb-0">Full Name</p>
                </div>
                <div class="col-sm-9">
                  <p class="text-muted mb-0">{{ form.fullName }}</p>
                </div>
              </div>
              <hr />
              <div class="row">
                <div class="col-sm-3">
                  <p class="mb-0">Date of Birth</p>
                </div>
                <div class="col-sm-9">
                  <p class="text-muted mb-0">{{ formatDate(form.dob) }}</p>
                </div>
              </div>
              <hr />
              <div class="row">
                <div class="col-sm-3">
                  <p class="mb-0">Gender</p>
                </div>
                <div class="col-sm-9">
                  <p class="text-muted mb-0">{{ genderLabel(form.gender) }}</p>
                </div>
              </div>
              <hr />
              <div class="row">
                <div class="col-sm-3">
                  <p class="mb-0">Email</p>
                </div>
                <div class="col-sm-9">
                  <p class="text-muted mb-0">{{ form.email }}</p>
                </div>
              </div>
              <hr />
              <div class="row">
                <div class="col-sm-3">
                  <p class="mb-0">Phone</p>
                </div>
                <div class="col-sm-9">
                  <p class="text-muted mb-0">{{ form.phone }}</p>
                </div>
              </div>
              <hr />
              <div class="row">
                <div class="col-sm-3">
                  <p class="mb-0">Address</p>
                </div>
                <div class="col-sm-9">
                  <p class="text-muted mb-0">{{ form.address }}</p>
                </div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-md-6">
              <div class="card mb-4 mb-md-0">
                <div class="card-body">
                  <p class="mb-4">
                    <span class="text-primary font-italic me-1">Assignment</span> Follower Growth
                  </p>
                  <p class="mb-1" style="font-size: 0.77rem">Social Media Reach</p>
                  <div class="progress rounded" style="height: 5px">
                    <div class="progress-bar" role="progressbar" style="width: 80%" aria-valuenow="80" aria-valuemin="0"
                      aria-valuemax="100"></div>
                  </div>
                  <p class="mt-4 mb-1" style="font-size: 0.77rem">Engagement Rate</p>
                  <div class="progress rounded" style="height: 5px">
                    <div class="progress-bar" role="progressbar" style="width: 72%" aria-valuenow="72" aria-valuemin="0"
                      aria-valuemax="100"></div>
                  </div>
                  <p class="mt-4 mb-1" style="font-size: 0.77rem">New Followers</p>
                  <div class="progress rounded" style="height: 5px">
                    <div class="progress-bar" role="progressbar" style="width: 89%" aria-valuenow="89" aria-valuemin="0"
                      aria-valuemax="100"></div>
                  </div>
                  <p class="mt-4 mb-1" style="font-size: 0.77rem">Returning Followers</p>
                  <div class="progress rounded" style="height: 5px">
                    <div class="progress-bar" role="progressbar" style="width: 55%" aria-valuenow="55" aria-valuemin="0"
                      aria-valuemax="100"></div>
                  </div>
                  <p class="mt-4 mb-1" style="font-size: 0.77rem">Conversion Rate</p>
                  <div class="progress rounded mb-2" style="height: 5px">
                    <div class="progress-bar" role="progressbar" style="width: 66%" aria-valuenow="66" aria-valuemin="0"
                      aria-valuemax="100"></div>
                  </div>
                </div>
              </div>
            </div>

            <div class="col-md-6">
              <div class="card mb-4 mb-md-0">
                <div class="card-body">
                  <p class="mb-4">
                    <span class="text-primary font-italic me-1">assigment</span> Latest Posts
                  </p>
                  <div class="post-card">
                    <div class="post-title">🚀 V-TEC Mayfest 2025 | Công bố kết quả CHÍNH THỨC</div>
                    <div class="post-meta">
                      V-TEC Team · 2 giờ trước · <span class="badge bg-primary">Announcement</span>
                    </div>
                    <br />
                    <a href="/post" class="btn btn-primary">Xem thêm</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import api from '@/composables/api'

const form = reactive({
  avatar: '',
  fullName: '',
  dob: '',
  gender: '',
  email: '',
  phone: '',
  address: ''
})

const isLoading = ref(true)
let userId = null

onMounted(async () => {
  try {
    const savedUser = JSON.parse(localStorage.getItem('user'));
    const userId = savedUser?.id;
    
    const userRes = await api.get(`/users/${userId}`)
    Object.assign(form, userRes.data)
  } catch (err) {
    console.error('Load profile error', err)
  } finally {
    isLoading.value = false
  }
})

function genderLabel(val) {
  return val === 'male' ? 'Male'
    : val === 'female' ? 'Female'
      : val === 'other' ? 'Other'
        : ''
}

function formatDate(val) {
  if (!val) return ''
  const d = new Date(val)
  return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
}
</script>