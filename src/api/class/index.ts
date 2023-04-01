import request from '@/utils/request';
import {AxiosPromise} from "axios";


/**
 * 班级列表
 *
 * @returns
 */
export function getClassListApi(): AxiosPromise<any> {
  return request({
    url: '/kindergarten/class',
    method: 'get'
  });
}

/**
 * 添加班级
 *
 * @returns
 */
//classNo
// className
// teacherId
export function addClassApi(classObj: object): AxiosPromise<any> {
  return request({
    url: '/kindergarten/class',
    method: 'post',
    params: classObj
  });
}
/**
 * 添加班级
 *
 * @returns
 */
//classNo
// id
// className
// teacherId
export function updateClassApi(classObj: object): AxiosPromise<any> {
  return request({
    url: '/kindergarten/class',
    method: 'put',
    params: classObj
  });
}

/**
 * 删除
 *
 * @returns
 */
export function deleteClassApi(id: any): AxiosPromise<any> {
  return request({
    url: `/kindergarten/class/${id}`,
    method: 'delete'
  });
}
/**
 *
 * @returns
 */
export function getTeachersApi(): AxiosPromise<any> {
  return request({
    url: `/kindergarten/users/getTeacher`,
    method: 'get'
  });
}
/**
 *
 * @returns
 */
//parentId， claId
export function joinClassApi(obj: object): AxiosPromise<any> {
  return request({
    url: `/kindergarten/clap/add`,
    method: 'post',
    params: obj
  });
}
/**
 *
 * @returns
 */
export function unJoinClassApi(userId: any): AxiosPromise<any> {
  return request({
    url: `/kindergarten/clap/delete/${userId}`,
    method: 'delete'
  });
}
