import {AxiosPromise} from "axios/index";
import {UserInfo} from "@/api/user/types";
import request from "@/utils/request";



/**
 * 根据主键获取通知详情
 */
export function getInfoApi(id: any): AxiosPromise<any> {
  return request({
    url: `/kindergarten/circulars/${id}`,
    method: 'get'
  });
}

/**
 * 添加通知信息
 */
export function addInfoApi(noticeObj: object): AxiosPromise<any> {
  return request({
    url: `/kindergarten/circulars`,
    method: 'post',
    params: noticeObj
  });
}

/**
 * 修改通知信息
 */
export function updateInfoApi(noticeObj: object): AxiosPromise<any> {
  return request({
    url: `/kindergarten/circulars/update`,
    method: 'put',
    params: noticeObj
  });
}

/**
 * 删除通知信息
 */
export function deleteInfoApi(id: any): AxiosPromise<any> {
  return request({
    url: `/kindergarten/circulars/${id}`,
    method: 'delete'
  });
}

export function getNoticeListApi(): AxiosPromise<any> {
  return request({
    url: '/kindergarten/circulars/getCirculars',
    method: 'get'
  });
}
