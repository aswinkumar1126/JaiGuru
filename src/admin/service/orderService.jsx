import axiosInstance from "../api/axiosInstance";


export const orderService ={
    
   getAllOrders: (page, size) =>
         axiosInstance.get('/order/all-ordersCount' ,{params:{page,size}}) ,

}