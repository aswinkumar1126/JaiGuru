import { useMutation } from '@tanstack/react-query';
import { createEmployee } from '../../service/authService';
import { message } from 'antd';
import { useNavigate } from 'react-router-dom';

export const useCreateEmployee = () => {
    const navigate = useNavigate();

    return useMutation({
        mutationFn: createEmployee,
        onSuccess: () => {
            message.success('Employee created successfully!');
            navigate('/employee/manage');
        },
        onError: (error) => {
            console.error('Create employee failed:', error);
            message.error(error?.response?.data?.message || 'Failed to create employee');
        }
    });
};