import {AxiosPromise} from "axios/index";
import {UserInfo} from "@/api/user/types";
import request from "@/utils/request";


/**
 * 根据主键获取通知详情
 */
export function getHomeworkApi(id: any): AxiosPromise<any> {
  return request({
    url: `/kindergarten/homework/${id}`,
    method: 'get'
  });
}

/**
 * 添加通知信息
 */
//content;classId
export function addHomeworkApi(homeworkObj: object): AxiosPromise<any> {
  return request({
    url: `/kindergarten/homework/publish`,
    method: 'post',
    params: homeworkObj
  });
}

/**
 * 删除通知信息
 */
export function deleteHomeworkApi(id: any): AxiosPromise<any> {
  return request({
    url: `/kindergarten/homework/${id}`,
    method: 'delete'
  });
}


export function getHomeworkListApi(): AxiosPromise<any> {
  return request({
    url: '/kindergarten/homework',
    method: 'get'
  });
}
