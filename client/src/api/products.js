import {axiosInstance} from './index';

export const getAllProducts = async() => {
    try{
        const response = await axiosInstance.get('api/products/get-all-products');
        return response.data;
    }catch(err){
        console.log(err, err.message);
    }
};

export const addProduct = async(payload) => {
    try{
        const response = await axiosInstance.post('api/products/add-product', payload);
        return response.data;
    }catch(err){
        console.log(err, err.message)
    }
};

export const updateProduct = async(id, payload) => {
    try{
        const response = await axiosInstance.put(`api/products/update-product/${id}`, payload);
        return response.data;
    }catch(err){
        console.log(err, err.message)
    }
};

export const deleteProduct = async(id) => {
    try{
        const response = await axiosInstance.delete(`api/products/delete-product/${id}`);
        return response.data;
    }catch(err){
        console.log(err, err.message);
    }
};

export const getProductById = async(id) => {
    try{
        const response = await axiosInstance.get(`api/products/product/${id}`);
        return response.data;
    }catch(err){
        console.log(err, err.message);
    }
};