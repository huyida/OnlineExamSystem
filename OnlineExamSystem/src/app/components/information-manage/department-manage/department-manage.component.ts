import {Component, OnInit} from '@angular/core';
import {TableServiceService} from "../../../serve/table-service.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {SchoolManageServerService} from "../../../serve/information-manage/school-manage-server.service";

@Component({
  selector: 'app-department-manage',
  templateUrl: './department-manage.component.html',
  styleUrls: ['./department-manage.component.css']
})
export class DepartmentManagementComponent implements OnInit {
  validateForm: FormGroup;

  private statusShow = false;
  /*状态*/

  private id;
  /*删除的id*/
  private tabTitle = "";
  /*弹窗标题*/
  private scholls;
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

  constructor(private _randomUser: TableServiceService, private fb: FormBuilder, private schoolManageServerService: SchoolManageServerService) {
  }

  ngOnInit() {
    // this.scholls = [{value: 'jack', label: '苏州科技大学'},
    //   {value: 'lucy', label: 'Lucy'},
    //   {value: 'disabled', label: 'Disabled', disabled: true}];
    // this.scholls = [{value: 'usts', label: '苏州科技大学'},
    //   {value: 'su', label: '苏州大学'},
    //   {value: 'disabled', label: 'Disabled', disabled: true}];
    this.validateForm = this.fb.group({
      school_id: ['', [Validators.required]],
      department_id: ['', [Validators.required]],
      name: ['', [Validators.required]],
      is_adult: ['', [Validators.required]]
    });
  }

  //获取学校
  querySchool() {
    this.schoolManageServerService.getSchool({
      'page': 1,
      'size': 10
    }).subscribe((data: any) => {

      console.log(data.data.list)
      this.scholls = data.data.list;
      this._loading = false;
      this._total = data.data.endRow;
      this._dataSet = data.data.list;

    });
  }

  //查询数据
  searchDepartment() {
    console.log(this.schollsId);
    this.serachShow = true;
    this.refreshData();
  }

  /*弹窗*/
  operateData(strs) {
    this.isVisible = true;
    if (strs == "add") {
      this.tabTitle = "添加专业数据";
      this.statusShow = false;
    } else {
      this.tabTitle = "修改专业数据";
      this.statusShow = true;
    }
  }

  //添加数据
  addDepartment() {
    // console.log('添加成功')
    // this.isVisible = false;
    if (this.validateForm.valid) {
      /*此处提交*/
      console.log(this.validateForm.value);
      this.validateForm.reset();
      console.log(this.validateForm.value)
      this.isVisible = false;
      this.refreshData(true);
      /*刷新table*/

    }
  }

  //关闭窗口
  handleCancel() {
    this.isVisible = false;
  }

  sort(value) {
    this._sortValue = value;
    this.refreshData();
  }

  reset() {
    this._filterGender.forEach(item => {
      item.value = false;
    });
    this.refreshData(true);
  }


  //表格数据操作
  refreshData(reset = false) {
    if (reset) {
      this._current = 1;
    }
    this._loading = true;
    const selectedGender = this._filterGender.filter(item => item.value).map(item => item.name);
    this._randomUser.getUsers(this._current, this._pageSize, 'name', this._sortValue, selectedGender, '/api/department').subscribe((data: any) => {
      this._loading = false;
      this._total = data[0].info.total;
      this._dataSet = data[0].results;
      console.log(this._total)
    })
  }

  /*删除提醒操作*/
  cancel = function () {
    this.alertTab = false;
  };

  confirm = () => {
    /*删除数据请求*/
    console.log(this.id);
    this.refreshData(true);
  };

}
