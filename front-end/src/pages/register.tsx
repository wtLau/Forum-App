import React from 'react'
import { Form, Formik } from 'formik'
import { useMutation } from 'urql'
import { Box, Button } from '@chakra-ui/react'
import InputField from '../components/InputField'
import { Wrapper } from '../components/Wrapper'
import { useRegisterMutation } from '../generated/graphql'
import { toErrorMap } from '../utils/toErrorMap'
import { useRouter } from 'next/router'

interface registerProps {}

const Register: React.FC<registerProps> = ({}) => {
  const router = useRouter()
  const [, register] = useRegisterMutation()

  return (
    <Wrapper variant='small'>
      <Formik
        initialValues={{
          username: '',
          password: '',
        }}
        onSubmit={async (
          values,
          { setErrors }
        ) => {
          const response = await register(values)
          if (response.data?.register.errors) {
            setErrors(
              toErrorMap(
                response.data.register.errors
              )
            )
          } else if (
            response.data?.register.user
          ) {
            //worked
            router.push('/')
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name='username'
              placeholder='username'
              label='Username'
            />
            <Box mt={4}>
              <InputField
                name='password'
                placeholder='password'
                label='Password'
                type='password'
              />
            </Box>
            <Button
              type='submit'
              mt={4}
              isLoading={isSubmitting}
              colorScheme='teal'
            >
              Register
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  )
}
export default Register
