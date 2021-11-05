<template>
  <div>
    <TopNav></TopNav>
    <LeftSideBar></LeftSideBar>


    <div class="app-content content">
      <div class="content-wrapper">
        <div class="content-header row">
          <div class="content-header-left col-md-6 col-12 mb-1">
            <h3 class="content-header-title">Employee</h3>
          </div>
          <div class="content-header-right breadcrumbs-right breadcrumbs-top col-md-6 col-12">
            <div class="breadcrumb-wrapper col-12">
              <ol class="breadcrumb">
                <li class="breadcrumb-item"><router-link to="/">Home</router-link></li>
                <li class="breadcrumb-item active">Employee</li>
              </ol>
            </div>
          </div>
        </div>
        <!-- Default ordering table -->

        <!--/ Default ordering table -->
      </div>
    </div>

    <Footer></Footer>
  </div>
</template>

<script>
import TopNav from "../layouts/topNav";
import LeftSideBar from "../layouts/leftSideBar";
import Footer from "../layouts/appfooter";
import axios from "axios";
export default {
  name: "index",
  components: {Footer, LeftSideBar, TopNav},
  data(){
    return {
      editMode: true,
      form: new Form({
        id: '',
        first_name: '',
        last_name: '',
        company_id: '',
        email: '',
        phone: '',
      })
    }
  },
  created() {
    this.$store.dispatch('getAllEmployees');
    this.$store.dispatch('getAllCompanies');
    var scripts = [
      "./src/assets/robust/app-assets/vendors/js/tables/datatable/datatables.min.js"
    ];
    scripts.forEach(script => {
      let tag = document.createElement("script");
      tag.setAttribute("src", script);
      document.head.appendChild(tag);
    });
  },
  mounted() {
    setTimeout(function (evt) {
      this.jqueryFunction();
    }.bind(this), 3000);
  },
  computed: {
    getAllEmployees() {
      return this.$store.getters.getAllEmployees;
    },
    getAllCompanies() {
      return this.$store.getters.getAllCompanies;
    }
  },
  methods: {
    openModal() {
      this.editMode= false;
      this.form.first_name = null;
      this.form.last_name = null;
      this.form.company_id = null;
      this.form.email = null;
      this.form.phone = null;
      $('#employeeModal').modal('show');
    },

    addEmployee() {
      this.form.post('employee')
        .then(({data}) => {
          $('#employeeModal').modal('hide');
          this.destroyDatatable();
          this.$store.dispatch('getAllEmployees');
          setTimeout(function (evt) {
            this.jqueryFunction();
          }.bind(this), 3000);
          Toast.fire({
            icon: 'success',
            title: data.message,
            timer: 3000
          });
        })
        .catch((e) => {
          Toast.fire({
            icon: 'error',
            title: e.response.data.message,
            timer: 3000
          });
        })
    },

    editModal(employee) {
      this.editMode= true;
      this.form.first_name = null;
      this.form.last_name = null;
      this.form.company_id = null;
      this.form.email = null;
      this.form.phone = null;
      $('#employeeModal').modal('show');
      this.form.fill(employee);
    },
    jqueryFunction: function () {
      $('#datatable').DataTable();
    },
    destroyDatatable: function () {
      $('#datatable').DataTable().destroy();
    },



    updateEmployee() {
      this.form.put('/employee/'+this.form.id)
        .then(({data}) => {
          $('#employeeModal').modal('hide');
          this.destroyDatatable();
          this.$store.dispatch('getAllEmployees');
          setTimeout(function (evt) {
            this.jqueryFunction();
          }.bind(this), 3000);
          Toast.fire({
            icon: 'success',
            title: data.message,
            timer: 3000
          });
        })
        .catch((e) => {
          Toast.fire({
            icon: 'error',
            title: e.response.data.message,
            timer: 3000
          });
        })
    },

    deleteEmployee(employee) {
      Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      }).then((result) => {
        if (result.isConfirmed) {
          axios.delete('employee/'+employee.id,{_method: 'delete'});
          this.destroyDatatable();
          this.$store.dispatch('getAllEmployees');
          setTimeout(function (evt) {
            this.jqueryFunction();
          }.bind(this), 3000);
          Toast.fire({
            icon: 'success',
            title: 'Employee Deleted successfully',
            timer:3000
          });
        }
      })
    }
  },
}
</script>

<style scoped>
</style>
