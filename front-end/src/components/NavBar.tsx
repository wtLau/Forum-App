import {
  Box,
  Button,
  Flex,
  Link,
} from '@chakra-ui/react'
import React from 'react'
import NextLink from 'next/link'
import {
  useMeQuery,
  useLogoutMutation,
} from '../generated/graphql'

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = ({}) => {
  const [
    { fetching: logoutFetching },
    logout,
  ] = useLogoutMutation()
  const [{ data, fetching }] = useMeQuery()

  let body = null

  // Data is loding
  if (fetching) {
    // User not logged in
  } else if (!data?.me) {
    // User is logged in
    body = (
      <div>
        <NextLink href='/register'>
          <Link color='white' mr={3}>
            Register
          </Link>
        </NextLink>
        <NextLink href='/login'>
          <Link color='white'>Login</Link>
        </NextLink>
      </div>
    )
  } else {
    //LOG OUT
    body = (
      <Flex>
        <Box mr={2}>{data.me.username}</Box>
        <Button
          variant='link'
          onClick={() => {
            logout()
          }}
          isLoading={logoutFetching}
        >
          Logout
        </Button>
      </Flex>
    )
  }
  return (
    <Flex bg='tomato' p={5}>
      <Box ml={'auto'}>{body}</Box>
    </Flex>
  )
}
