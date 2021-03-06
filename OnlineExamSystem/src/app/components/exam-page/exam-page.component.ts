import {Component, OnInit} from '@angular/core';
import {TestService} from '../../serve/test/test.service';
import * as $ from 'jquery'
import {ExamPageServiceService} from "../../serve/exam-page/exam-page-service.service";

@Component({
  selector: 'app-exam-page',
  templateUrl: './exam-page.component.html',
  styleUrls: ['./exam-page.component.css']
})
export class ExamPageComponent implements OnInit {
  eoQuestionList: any = [];
  eoAnswer: any = [];
  select: any = [];
  selects: any = [];
  judges: any = [];
  fillings: any = [];
  reads: any = [];
  list: string[] = ["A", "B", "C", "D"];
  answer: object = {};
  isVisible: boolean = false;
  errorTitle: string;
  errorId: number;
  errorContent: string;
  titleType: object = {};
  schedule: string;

  constructor(private _testService: TestService,
              private examPageServiceService: ExamPageServiceService) {
  }

  ngOnInit() {
    // this._testService.getTestSelectData('')
    //   .subscribe(data => {
    //     this.selectData = data;
    //   });

    this.eoQuestionList = JSON.parse(sessionStorage.getItem('EXAMDATA'));
    this.eoAnswer = JSON.parse(sessionStorage.getItem('EXAMANSWER'));
    console.log(this.eoQuestionList);
    sessionStorage.setItem('EXAMDATA', "");
    this.schedule = "0/" + this.eoQuestionList.length;
    for (let i = 0; i < this.eoQuestionList.length; i++) {
      if (this.eoQuestionList[i]['typeId'] == 1) {
        this.titleType['s'] = "单选题";
        this.select.push(this.eoQuestionList[i]);
      } else if (this.eoQuestionList[i]['typeId'] == 2) {
        this.selects.push(this.eoQuestionList[i]);
        this.titleType['ss'] = "多选题";
      } else if (this.eoQuestionList[i]['typeId'] == 3) {
        this.judges.push(this.eoQuestionList[i]);
        this.titleType['j'] = "判断题";
      } else if (this.eoQuestionList[i]['typeId'] == 4) {
        this.fillings.push(this.eoQuestionList[i]);
        this.titleType['f'] = "填空题";
      } else if (this.eoQuestionList[i]['typeId'] == 5) {
        this.reads.push(this.eoQuestionList[i]);
        this.titleType['d'] = "阅读题";
      }
    }
    $(".con_key").on('click', function () {
      console.log(1)
    })
  }

  // index每种题目下的序号，type每种题目，id每道题的id，i如有值为abcd序号，value为选择项的内容
  selectClick(index: number, type: string, id: any, i?: number, value?: string) {
    if (type == 's') {
      $('#s' + id).children('div').eq(1).find('span').removeClass('y');
      $('#s' + id).children('div').eq(1).children('div').eq(i).children('span').eq(0).addClass('y');
      $('#select').children('a').eq(index).addClass('y');
      this.answer[id] = this.list[i];
    } else if (type == 'ss') {
      if (!this.answer[id]) {
        this.answer[id] = [];
      }
      if (!$('#ss' + id).children('div').eq(1).children('div').eq(i).children('span').eq(0).hasClass('y')) {
        this.answer[id].push(this.list[i]);
      } else if (this.answer[id].length > 1) {
        let _index = this.answer[id].indexOf(this.list[i]);
        console.log(_index);
        this.answer[id].splice(_index, 1);
      } else if (this.answer[id].length == 1) {
        delete this.answer[id];
      }
      $('#ss' + id).children('div').eq(1).children('div').eq(i).children('span').eq(0).toggleClass('y');
      let length = $('#ss' + id).find('span.y').length;
      if (length > 0) {
        $('#selects').children('a').eq(index).addClass('y');
      } else {
        $('#selects').children('a').eq(index).removeClass('y');
      }
    } else if (type == 'j') {
      $('#j' + id).children('div').eq(1).find('span').removeClass('y');
      $('#j' + id).children('div').eq(1).children('div').eq(i).children('span').eq(0).addClass('y');
      $('#judges').children('a').eq(index).addClass('y');
      this.answer[id] = this.list[i];
    } else if (type == 'f') {
      let value = $('#f' + id).val();
      if (value) {
        this.answer[id] = value;
        $("#fillings").children('a').eq(index).addClass('y');
      } else if (this.answer[id] && !value) {
        delete this.answer[id];
        $("#fillings").children('a').eq(index).removeClass('y');
      }
    }
    let length = 0;
    for (let key in this.answer) {
      length++;
    }
    this.schedule = length + '/' + this.eoQuestionList.length;
    let width = length / this.eoQuestionList.length * 250 + 'px';
    $(".scheduleLength").css("width", width);
  }

  // 标记      type不同题目类型   ismark true纠错，false标记    index序号
  mark(type: string, isMark: boolean, index: number, id: any) {
    if (isMark) {
      this.isVisible = true;
      this.errorId = id;
      this.errorTitle = '[' + this.titleType[type] + ']  第' + index + 1 + '题';
    } else {
      if (type == 's') {
        $('#select').children('a').eq(index).toggleClass('marks');
      } else if (type == 'ss') {
        $('#selects').children('a').eq(index).toggleClass('marks');
      } else if (type == 'j') {
        $('#judges').children('a').eq(index).toggleClass('marks');
      } else if (type == 'f') {
        $('#fillings').children('a').eq(index).toggleClass('marks');
      }
    }
  }


  // 提交纠错
  handleOk() {
    let params = {
      id: this.errorId,
      errorConten: this.errorContent
    }
    // 发送请求
    this.isVisible = false;
    this.errorContent = '';
  }

  // 提交答案
  upData() {
    // if(this.eoQuestionList.length == )
    let length = 0;
    for (let key in this.answer) {
      length++;
    }
    if (length < this.eoQuestionList.length) {
      alert("您还有未完成的试题");
      return;
    }
    let questionList = [];

    console.log(this.answer);
    var keys = Object.keys(this.answer);
    console.log(keys);
    console.log('长度', keys.length);
    let answer_str = [];
    for (let i in keys) {
      // console.log('key是', , ', value是', );
      answer_str.push({"answoer": this.answer[keys[i]].toString().replace(",", ""), "id": keys[i]});

    }
    console.log(answer_str);
    console.log(this.eoAnswer);

    const eoExamPaper = {
      eoQuestionList: answer_str
    }
    const body = {
      duration: this.eoAnswer.duration,
      eoExamPaper: eoExamPaper,
      id: this.eoAnswer.id,
    };
    this.examPageServiceService.submitExamAnswer(this.eoAnswer.id, body).subscribe((data: any) => {
      console.log("添加");
      console.log(body);
      console.log(data);
    });
    // 提交答案到后台
  }


}
