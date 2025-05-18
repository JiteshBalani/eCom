import {axiosInstance} from './index';

export const createNewOrder = async(payload) => {
    try{
        const response = await axiosInstance.post('api/order/create-new-order', payload);
        return response.data;
    }catch(err){
        console.log(err, err.message);
    }
};

export const getAllOrders = async(id) => {
    try{
        const response = await axiosInstance.get(`api/order/find/${id}`);
        return response.data;
    }catch(err){
        console.log(err, err.message);
    }
};