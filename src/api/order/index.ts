import {AxiosPromise} from "axios";
import request from "@/utils/request";


/**
 * 根据订单主键获取订单信息
 *
 * @param id
 */
export function getOrderDetailApi(id: number): AxiosPromise<any> {
  return request({
    url: `/worder/order/getById/${id}`,
    method: 'get'
  });
}

/**
 * 订单发货
 *
 * @param id
 */
export function sendOrderApi(id: number): AxiosPromise<any> {
  return request({
    url: `/worder/order/sendOrder/${id}`,
    method: 'put'
  });
}

/**
 * 根据订单主键获取菜品详情
 *
 * @param id
 */
export function getDishesDetailApi(id: number): AxiosPromise<any> {
  return request({
    url: `/worder/orderItem/getByOrderId/${id}`,
    method: 'get'
  });
}
