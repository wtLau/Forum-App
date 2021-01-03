import {
  Box,
  Button,
  Flex,
  Link,
} from '@chakra-ui/react'
import React from 'react'
import NextLink from 'next/link'
import { useMeQuery } from '../generated/graphql'

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = ({}) => {
  const [{ data, fetching }] = useMeQuery()

  let body = null

  // Data is loding
  if (fetching) {
    // User not logged in
  } else if (!data?.me) {
    // User is logged in
    body = (
      <div>
        <NextLink href='/reg  ister'>
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
    body = (
      <Flex>
        <Box mr={2}>{data.me.username}</Box>
        <Button variant='link'>Logout</Button>
      </Flex>
    )
  }
  return (
    <Flex bg='tomato' p={5}>
      <Box ml={'auto'}>{body}</Box>
    </Flex>
  )
}
