import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {HttpHeaders} from "@angular/common/http";

@Injectable()
export class DesignPaperService {

  constructor(private http: HttpClient) {
  }

  //组卷策略1
  addExampaper(body) {
    return this.http.post('http://localhost:8081/examonline/api/teacher/exampaper/makepaper', body, {
      headers: new HttpHeaders().set('Content-Type', 'application/json;charset=UTF-8'),
      withCredentials: true,
    });
  }

  //组卷策略2
  addExampaper2(body) {
    return this.http.post('http://localhost:8081/examonline/api/teacher/exampaper/makepapereasy', body, {
      headers: new HttpHeaders().set('Content-Type', 'application/json;charset=UTF-8'),
      withCredentials: true,
    });
  }

  deleteExampaper(id) {
    return this.http.delete("http://localhost:8081/examonline/api/teacher/exampaper/" + id, {
      headers: new HttpHeaders().set('Content-Type', 'application/json;charset=utf-8'),
      withCredentials: true,
    });
  }

  updateExampaper(body) {
    return this.http.put('http://localhost:8081/examonline/api/teacher/exampaper', body, {
      headers: new HttpHeaders().set('Content-Type', 'application/json;charset=UTF-8'),
      withCredentials: true,
    });
  }

  getExampaper(param) {
  return this.http.get('http://localhost:8081/examonline/api/teacher/exampaper', {
    headers: new HttpHeaders().set('Content-Type', 'application/json;charset=utf-8'),
    withCredentials: true,
    params: param
  });
}

}
