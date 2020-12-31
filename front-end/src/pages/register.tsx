import React from 'react'
import { Formik } from 'formik'
import {
  FormControl,
  FormLabel,
  Input,
} from '@chakra-ui/react'
import { Form } from 'formik'
import { Wrapper } from '../components/Wrapper'

interface registerProps {}

const Register: React.FC<registerProps> = ({}) => (
  <Formik
    initialValues={{
      username: '',
      password: '',
    }}
    onSubmit={(values) => {
      console.log(values)
    }}
  >
    {({ values, handleChange }) => (
      <Wrapper>
        <Form>
          <FormControl>
            <FormLabel htemlFor='username'>
              Username
            </FormLabel>
            <Input
              value={values.username}
              onChange={handleChange}
              id='username'
              placeholder='username'
            ></Input>
          </FormControl>
        </Form>
      </Wrapper>
    )}
  </Formik>
)

export default Register
