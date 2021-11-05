<template>
  <div>
    <TopNav></TopNav>
    <LeftSideBar></LeftSideBar>
    <div class="app-content content">
      <div class="content-wrapper">
        <div class="content-header row">
          <div class="content-header-left col-md-6 col-12 mb-1">
            <h3 class="content-header-title">Post</h3>
          </div>
          <div class="content-header-right breadcrumbs-right breadcrumbs-top col-md-6 col-12">
            <div class="breadcrumb-wrapper col-12">
              <ol class="breadcrumb">
                <li class="breadcrumb-item"><router-link to="/">Home</router-link></li>
                <li class="breadcrumb-item active">Post</li>
              </ol>
            </div>
          </div>
        </div>
        <!-- Default ordering table -->
        <section id="ordering">
          <div class="row">
            <div class="col-12">
              <div v-if="tableStatus">
                <div class="card">
                  <div class="card-header">
                    <h4 class="card-title">All Post</h4>
                  </div>
                  <div class="card-content collapse show">
                    <div class="card-body card-dashboard">
                      <div class="table-responsive">
                        <table class="table table-striped table-bordered" id="datatable">
                          <thead>
                            <tr>
                              <th>#</th>
                              <th>Full Name</th>
                              <th>Email</th>
                              <th>Department</th>
                              <th>Study Level</th>
<!--                              <th>Description</th>-->
                              <th>Image</th>
                              <th>Status</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr v-for="(post, index) in allPost" :key="post.id">
                              <td>{{ index+1 }}</td>
                              <td>{{ post.fullName }}</td>
                              <td>{{ post.email }}</td>
                              <td>{{ post.department }}</td>
                              <td>{{ post.studyLevel }}</td>
<!--                              <td>{{ post.description }}</td>-->
                              <td><img :src="post.image" style="height: 100px; width: auto;">
                              </td>
                              <td>
                                <template v-if="post.status == 'PENDING'"><div class="badge badge-warning round"><span>PENDING</span></div></template>
                                <template v-if="post.status == 'ACCEPTED'"><div class="badge badge-success round"><span>ACCEPTED</span></div></template>
                              </td>
                              <td>
                                <div class="float-md-right">
                                  <button class="btn btn-info" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i class="icon-settings"></i></button>
                                  <div class="dropdown-menu arrow" x-placement="bottom-start" style="position: absolute; transform: translate3d(0px, 39px, 0px); top: 0px; left: 0px; will-change: transform;">
                                    <a class="dropdown-item" @click.prevent="viewDetails(post)"><i class="fa fa-eye mr-1"></i> Details</a>

                                    <template v-if="user.roles[0] == 'ADMIN' && post.status == 'PENDING'">
                                      <a class="dropdown-item" @click.prevent="approvePost(post.id)"><i class="fa fa-check mr-1"></i> Approve</a>
                                    </template>

                                    <template v-if="user.roles[0] == 'ADMIN'">
                                      <a class="dropdown-item" @click.prevent="deletePost(post.id)"><i class="fa fa-trash mr-1"></i> Delete</a>
                                    </template>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="card">
                <div class="card-header">
                  <h4 class="card-title">Add New Post</h4>
                </div>
                <div class="card-content collapse show">
                  <div class="card-body card-dashboard">
                    <form>
                      <div class="row">
                        <div class="col-md-6">
                          <div class="form-group">
                            <label for="fullName" class="text-danger"><b style="color: #00008B;">Full Name</b> *</label>
                            <input id="fullName" class="form-control"
                                   :class="{ 'is-invalid': form.errors.has('fullName') }"
                                   v-model="form.fullName" type="text" placeholder="Enter your full name">
                            <has-error :form="form" field="fullName"></has-error>
                          </div>
                        </div>

                        <div class="col-md-6">
                          <div class="form-group">
                            <label for="department" class="text-danger"><b style="color:#00008B;">Department</b> *</label>
                            <input id="department" class="form-control"
                                   :class="{ 'is-invalid': form.errors.has('department') }"
                                   type="text" placeholder="Enter your department" v-model="form.department" required/>
                            <has-error :form="form" field="department"></has-error>
                          </div>
                        </div>

                        <div class="col-md-6">
                          <div class="form-group">
                            <label for="email" class="text-danger"><b style="color:#00008B;">Email</b> *</label>
                            <input id="email" class="form-control"
                                   :class="{ 'is-invalid': form.errors.has('email') }"
                                   type="email" placeholder="Enter your email" v-model="form.email" required/>
                            <has-error :form="form" field="email"></has-error>
                          </div>
                        </div>

                        <div class="col-md-6">
                          <div class="form-group">
                            <label class="text-danger"><b style="color:#00008B;">Study Level</b> *</label>
                            <v-select id="studytype" class="vs" :options="studyType"  label="name"
                                      v-model="form.studyLevel" style="width: 100%; background-color: white;"
                                      placeholder="Select Study Level...">
                            </v-select>
                            <has-error :form="form" field="studyLevel"></has-error>
                          </div>
                        </div>

                        <div class="col-md-6">
                          <div class="form-group">
                            <label class="text-danger"><b style="color: #00008B;">Description</b> *</label>
                            <ckeditor id="description" v-model="form.description" :config="editorConfig"></ckeditor>
                            <has-error :form="form" field="description"></has-error>
                          </div>
                        </div>

                        <div class="col-md-6">
                          <label class="text-danger"><b style="color:#00008B;">Picture:</b> *</label>
                          <div class="form-group position-relative has-icon-left">
                            <input type="file" @change="changeContent($event)" :class="{ 'is-invalid': form.errors.has('image') }" class="dropify">
                            <has-error :form="form" field="image"></has-error>
                          </div>
                        </div>
                      </div>

                      <div class="row">
                        <div class="col-md-9">
                          <small class="text-danger">Fill the form correctly with all mandatory fields(*) and click the “Post” button.</small><br>
                        </div>
                        <div class="col-md-3">
                          <input type="submit" name="submit" id="submit" @click.prevent="addBudget()" value="Post" class="btn btn-sm btn-success pull-right">
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </section>
        <!--/ Default ordering table -->
      </div>
    </div>
    <Appfooter></Appfooter>

    <!--  details  -->
    <div class="modal fade text-left" id="dataModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel17" aria-hidden="true">
      <div class="modal-dialog modal-xl" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title" id="myModalLabel17">Post Details</h4>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">×</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="row" style="margin: 15px;">
              <div class="col-9">
                <div id="details_fullname"></div>
                <div id="details_email"></div>
                <br>
                <div id="details_description" v-html="data_desription"></div>
              </div>

              <div class="col-3">
                <div id="details_image"></div>
                <div id="details_department"></div>
                <div id="details_studyLevel"></div>
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn grey btn-outline-secondary" data-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import TopNav from "../layouts/topNav";
import LeftSideBar from "../layouts/leftSideBar";
import Appfooter from "../layouts/appfooter";
import {mapGetters} from "vuex";
import Vue from "vue";
import axios from 'axios';

export default {
  name: "index",
  components: {Appfooter, LeftSideBar, TopNav},
  data(){
    return {
      tableStatus: false,
      data_desription: null,
      allPost: [],
      editorConfig: {},
      studyType: [
        {type: "PHD", name: "PHD"},
        {type: "MS", name: "MS"},
        {type: "Undergraduate", name: "Undergraduate"},
      ],
      form: new Form({
        fullName: '', department: '', description: '', email: '', studyLevel: '', image: ''
      })
    }
  },

  async created() {
    var scripts = [
      "./src/assets/robust/app-assets/vendors/js/tables/datatable/datatables.min.js",
      "../src/assets/dropify/js/dropify.min.js"
    ];
    scripts.forEach(script => {
      let tag = document.createElement("script");
      tag.setAttribute("src", script);
      document.head.appendChild(tag);
    });
    setTimeout(function (evt) {
      this.setDropify();
    }.bind(this), 100);

    if(this.user.roles[0] == 'ADMIN')
      this.getPageData();
  },

  computed: {
    ...mapGetters({
      authenticated: 'auth/authenticated',
      user: 'auth/user'
    })
  },

  methods: {
    viewDetails(data){
      $('#details_fullname').html('<h2 class="text-danger">'+ data.fullName +'</h2>')
      $('#details_email').html('<p><i class="fa fa-envelope mr-1"></i>'+ data.email +'</p>')
      this.data_desription = data.description

      $('#details_department').html('<p><i class="fa fa-university mr-1"></i>'+ data.department +'</p>')
      $('#details_image').html('<img src="'+ data.image +'" class="rounded-circle  height-150" alt="Card image">')
      $('#details_studyLevel').html('<p><i class="fa fa-graduation-cap mr-1"></i>'+ data.studyLevel +'</p>')

      $('#dataModal').modal('show');
    },

    jqueryFunction: function () {
      $('#datatable').DataTable();
    },
    setDropify: function (){
      $('.dropify').dropify();
    },
    destroyDatatable: function () {
      $('#datatable').DataTable().destroy();
    },

    getPageData(){
      Vue.axios.get('/api/test/all/posts')
        .then((response) => {
          if(this.tableStatus)
            this.destroyDatatable();
          else
            this.tableStatus = true

          this.allPost = response.data.body
          setTimeout(function (evt) {
            this.jqueryFunction();
          }.bind(this), 100);
        });
    },

    changeContent(event, i) {
      let file = event.target.files[0];
      if (file.size > 1073741824) {
        Swal.fire({
          position: 'top-end',
          icon: 'error',
          title: "File can't greater than 1GB!!!",
          showConfirmButton: false,
          timer: 1500
        })
      } else {
        let reader = new FileReader();
        reader.onload = event => {
          this.form.image = event.target.result
        };
        reader.readAsDataURL(file);
      }
    },

    addBudget() {
      if(this.form.fullName && this.form.department && this.form.description && this.form.email && this.form.image && this.form.studyLevel)
      {
        this.form.studyLevel = this.form.studyLevel.name
        this.form.post('/api/test/user/data')
          .then(({data}) => {
            Toast.fire({
              icon: 'success',
              title: 'Post Added',
              timer: 3000
            });
          })
          .catch(() => {
            Toast.fire({
              icon: 'error',
              title: 'Please fill the form properly'
            });
          })
      }
      else {
        Toast.fire({
          icon: 'error',
          title: 'Fill up the form properly',
          timer: 3000
        });
      }

    },

    approvePost(id){
      Swal.fire({
        title: 'Are you sure?',
        text: "You want to make this post as approved!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, approved it!'
      }).then((result) => {
        if (result.isConfirmed) {
          Vue.axios.get('/api/test/accept/request/' + id)
            .then((response) => {
              this.getPageData();
              Toast.fire({
                icon: 'success',
                title: 'Post Approved Successfully',
                timer: 3000
              });
            })
        }
      })
    },

    deletePost(id){
      Swal.fire({
        title: 'Are you sure?',
        text: "You want to delete this post!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, Delete it!'
      }).then((result) => {
        if (result.isConfirmed) {
          axios.delete('/api/test/delete/post/' + id,{_method: 'delete'})
            .then((response) => {
              this.getPageData();
              Toast.fire({
                icon: 'success',
                title: 'Post Deleted Successfully',
                timer: 3000
              });
            })
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
