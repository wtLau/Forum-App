import {
  FormControl,
  FormLabel,
  Input,
} from '@chakra-ui/react'
import { useField } from 'formik'
import React, { InputHTMLAttributes } from 'react'

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  name: string
}

const InputField: React.FC<InputFieldProps> = ({}) => {
  const [field] = useField(props)
  return (
    <FormControl>
      <FormLabel htemlFor='username'>
        Username
      </FormLabel>
      <Input
        {...field}
        onChange={handleChange}
        id='username'
        placeholder='username'
      ></Input>
    </FormControl>
  )
}

export default InputField
