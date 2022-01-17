import React from 'react'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'

import { useYupValidationResolver } from './yupValidator';
const validationSchema = yup.object({
    name: yup.string().min(4,"Minimum length of Name is 4").max(500,"Maximum length of Name is 500").required('Required'),
    age: yup.number().min(1,"Minimum length of Age is 1").max(150,"Maximum length of age is 150").typeError('Age must be a number').required('Required'),
   
  });
  

export default function Index() {
    const resolver = useYupValidationResolver(validationSchema);  
    const { register,handleSubmit, formState:{errors} } = useForm(
        { resolver }
    )
    
    return (
        <div>
            <form onSubmit={handleSubmit(data=>console.log(data))} >
                <input type="text" 
                placeholder='name'
                {...register('name')}
                />
                {errors.name?.message }
                <input type="text" 
                placeholder='age'
                {...register('age')}
                />
                {errors.age?.message }
                <input type="submit" value="submit" />
            </form>
        </div>
    )
}
