import { COMPANY_API_END_POINT } from '@/utils/constant';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setTrashedCompanies } from '@/redux/companySlice';
import { useEffect } from 'react';

const useGetTrashedCompanies = () => {
    const dispatch = useDispatch();
    
    useEffect(() => {
        const fetchTrashedCompanies = async () => {
            try {
                const res = await axios.get(`${COMPANY_API_END_POINT}/trash`, { 
                    withCredentials: true 
                });
                if(res.data.success){
                    dispatch(setTrashedCompanies(res.data.companies));
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchTrashedCompanies();
    }, [dispatch]);
}

export default useGetTrashedCompanies;