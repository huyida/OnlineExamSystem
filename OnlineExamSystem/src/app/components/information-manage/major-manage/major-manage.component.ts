import {Component, OnInit} from '@angular/core';
import {TableServiceService} from "../../../serve/table-service.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {SchoolManageServerService} from "../../../serve/information-manage/school-manage-server.service";
import {MajorManageServerService} from "../../../serve/information-manage/major-manage-server.service";
import {DepartmentManageServerService} from "../../../serve/information-manage/department-manage-server.service";

@Component({
  selector: 'app-major-manage',
  templateUrl: './major-manage.component.html',
  styleUrls: ['./major-manage.component.css']
})
export class MajorManageComponent implements OnInit {
  validateForm: FormGroup;

  private root = false;
  private admin = false;
  private status = "";

  private schoolId;
  private flag = false;

  private id_modal;
  private school_modal;
  private department_modal;
  private major_modal;
  private is_adult;

  private department;

  private statusShow = false;
  /*状态*/
  private id;
  /*删除的id*/
  private tabTitle = "";
  /*弹窗标题*/
  private scholls;
  private departments;
  private schollsId;
  private serachShow = false;
  /*控制是否生成table*/
  private isVisible = false;
  /*tab添加修改窗口*/

  _current = 1;
  _pageSize = 10;
  _total = 1;
  _dataSet = [];
  _loading = true;
  _sortValue = null;
  _filterGender = [
    {name: 'male', value: false},
    {name: 'female', value: false}
  ];

  constructor(private _randomUser: TableServiceService, private fb: FormBuilder,
              private schoolManageServerService: SchoolManageServerService,
              private majorManageServerService: MajorManageServerService,
              private departmentManageServerService: DepartmentManageServerService) {
  }

  ngOnInit() {
    this.status = sessionStorage.getItem("roleValue");
    if (this.status == "1") {
      this.root = true;
      this.admin = false;

    } else {
      this.root = false;
      this.admin = true;
    }
    this.validateForm = this.fb.group({
      school_modal: ['', [Validators.required]],
      department_modal: ['', [Validators.required]],
      major_modal: ['', [Validators.required]],
      is_adult: ['', [Validators.required]]
    });

    //获取学校
    this.schoolManageServerService.getSchool({
      'page': 1,
      'size': 10,
    }).subscribe((data: any) => {

      console.log(data.data.list)
      this.scholls = data.data.list;

    });

    //校管获取所属学校的所有学院
    this.departmentManageServerService.getDepartmentFromAdmin({
      'page': 1,
      'size': 10,
    }).subscribe((data: any) => {

      console.log(data.data.list)
      this.departments = data.data.list;
      // this.departments_modal = data.data.list;

    });

  }

  isRoot() {
    return this.root;
  }

  isAdmin() {
    return this.admin;
  }

  /*查询数据*/
  searchMajor() {
    console.log(this.schollsId);
    this.majorManageServerService.getMajor({
      'page': 1,
      'size': 10,
      'schoolId': this.schoolId,
      'departmentId': this.department,
    }).subscribe((data: any) => {

      console.log(data.data.list)
      // this.scholls = data.data.list;
      this._loading = false;
      this._total = data.data.endRow;
      this._dataSet = data.data.list;

    });
    this.serachShow = true;
  }

  searchMajorFromAdmin() {
    this.majorManageServerService.getMajorFromAdmin({
      'page': 1,
      'size': 10,
      'departmentId': this.department
    }).subscribe((data: any) => {

      console.log(data.data.list)
      // this.scholls = data.data.list;
      this._loading = false;
      this._total = data.data.endRow;
      this._dataSet = data.data.list;

    });
    this.serachShow = true;
  }

  /*弹窗*/
  operateData(strs) {
    this.isVisible = true;
    if (strs == "add") {
      this.tabTitle = "添加学院数据";
      this.statusShow = false;
    } else {
      this.tabTitle = "修改学院数据";
      this.id_modal = strs.id;
      this.major_modal = strs.name;
      this.statusShow = true;
    }
  }

  submit() {

    if (this.status == "1") {
      if (this.statusShow == true) {
        const body = {
          id: this.id_modal,
          name: this.major_modal,
          departmentId: this.department_modal,
          schoolId: this.school_modal,
          isAdult: this.is_adult,
        };
        this.majorManageServerService.updateMajor(body).subscribe((data: any) => {
          console.log("更新");
          console.log(body);
        });
      } else {
        const body = {
          name: this.major_modal,
          departmentId: this.department_modal,
          schoolId: this.school_modal
        };
        this.majorManageServerService.addMajor(body).subscribe((data: any) => {
          console.log("添加");
          console.log(body);
        });
      }
      // console.log(this.validateForm.value);
      this.validateForm.reset();
      // console.log(this.validateForm.value)
      this.isVisible = false;
      this.searchMajor();
      // this.refreshData(true);
      // this.searchSchool();
      /*刷新table*/
    } else {
      if (this.statusShow == true) {
      } else {
        const body = {
          name: this.major_modal,
          departmentId: this.department_modal,
          schoolId: "3"
        };
        this.majorManageServerService.addMajorFromAdmin(body).subscribe((data: any) => {
          console.log("添加");
          console.log(body);
        });
      }
      // console.log(this.validateForm.value);
      this.validateForm.reset();
      // console.log(this.validateForm.value)
      this.isVisible = false;
      this.searchMajor();
      // this.refreshData(true);
      // this.searchSchool();
      /*刷新table*/
    }


  }

  queryDepartment(value) {
    console.log(value)
    this.departmentManageServerService.getDepartment({
      'page': 1,
      'size': 10,
      'schoolId': value
    }).subscribe((data: any) => {

      console.log(data.data.list)
      this.departments = data.data.list;
      // this._loading = false;
      // this._total = data.data.endRow;
      // this._dataSet = data.data.list;

    });
  }


  /*关闭窗口*/
  handleCancel() {
    this.isVisible = false;
  }

  sort(value) {
    this._sortValue = value;
    this.searchMajor();
  }

  reset() {
    this._filterGender.forEach(item => {
      item.value = false;
    });
    this.searchMajor();
  }


  /*删除提醒操作*/
  cancel = function () {
    this.alertTab = false;
  };

  confirm = function (id) {
    /*删除数据请求*/
    console.log(id);
    this.majorManageServerService.deleteMajor(id).subscribe((data: any) => {
      // console.log(data)
    });
    this.searchMajor();
    // this.refreshData(true);
  };

}
