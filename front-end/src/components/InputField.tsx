import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  propNames,
} from '@chakra-ui/react'
import { useField } from 'formik'
import React, { InputHTMLAttributes } from 'react'

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  name: string
  label: string
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  size: _,
  ...props
}) => {
  const [field, { error }] = useField(props)
  return (
    <FormControl isInvalid={!!error}>
      <FormLabel htmlFor='username'>
        {label}
      </FormLabel>
      <Input
        {...field}
        {...props}
        id={field.name}
        placeholder={props.placeholder}
      ></Input>
      {error ? (
        <FormErrorMessage>
          {error}
        </FormErrorMessage>
      ) : null}
    </FormControl>
  )
}

export default InputField
