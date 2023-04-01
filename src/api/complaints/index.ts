import {AxiosPromise} from "axios/index";
import request from "@/utils/request";



/**
 * 根据主键获取投诉详情
 */
export function getComplaintsApi(id: any): AxiosPromise<any> {
  return request({
    url: `/kindergarten/complaints/getById/${id}`,
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
 * 删除投诉
 */
export function deleteComplaintsApi(id: any): AxiosPromise<any> {
  return request({
    url: `/kindergarten/complaints/deleteComplaints/${id}`,
    method: 'delete'
  });
}

/**
 * 管理员
 */
export function getComplaintsListApi(): AxiosPromise<any> {
  return request({
    url: '/kindergarten/complaints/getAll',
    method: 'get'
  });
}
/**
 * 管理员
 */
export function getComplaintsByStatusApi(status: string): AxiosPromise<any> {
  return request({
    url: `/kindergarten/complaints/getByStatus1/${status}`,
    method: 'get'
  });
}

export function userGetComplaintsApi(): AxiosPromise<any> {
  return request({
    url: '/kindergarten/complaints/getComplaints',
    method: 'get'
  });
}
export function userGetComplaintsByStatusApi(status: string): AxiosPromise<any> {
  return request({
    url: `/kindergarten/complaints/getByStatus/${status}`,
    method: 'get'
  });
}

export function complainApi(content: string): AxiosPromise<any> {
  return request({
    url: '/kindergarten/complaints/complain',
    method: 'post',
    params: {
      content
    }
  });
}

export function adminGetComByStatusApi(status: string): AxiosPromise<any> {
  return request({
    url: `/kindergarten/complaints/getByStatus1/${status}`,
    method: 'get'
  });
}

// processResults, id
export function adminHandleComplaintsApi(handleObj :object): AxiosPromise<any> {
  return request({
    url: `/kindergarten/complaints/process`,
    method: 'post',
    params: handleObj
  });
}
