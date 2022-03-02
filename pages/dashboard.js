import { useState, useEffect } from 'react'
import { 
  Box, Grid, Text, Heading, HStack, Button, Stack, Container, 
  Spacer, Input, InputGroup, InputRightElement, useDisclosure, FormLabel
} from '@chakra-ui/react'
import { EmailIcon, PhoneIcon } from '@chakra-ui/icons'
import { motion } from 'framer-motion'
import { Magic, RPCError, RPCErrorCode } from 'magic-sdk'
import Link from 'next/link'


export default function Dashboard() {
  const { getButtonProps, getDisclosureProps, isOpen } = useDisclosure()
  const [hidden, setHidden] = useState(!isOpen)
  const [update, setUpdate] = useState('')
  const [email, setEmail] = useState('')
  const [address, setAddress] = useState('')
  const [getIdToken, setGetIdToken] = useState('')
  const [genIdToken, setGenIdToken] = useState('')
  const [metaData, setMetaData] = useState('')
  const [userStatus, setUserStatus] = useState('')

  const updateHandler = async () => {
    const magic = new Magic(process.env.NEXT_PUBLIC_MAGIC_PUB_KEY)
    try {
      await magic.user.updateEmail({ email: update, showUI: true })
    } catch (err) {
      if (err instanceof RPCError) {
        switch (err.code) {
          case RPCErrorCode.UpdateEmailFailed:
            break;
        }
      }
    }
  }
  const userLogout = async() => {
    const magic = new Magic(process.env.NEXT_PUBLIC_MAGIC_PUB_KEY)
    try {
      await magic.user.logout();
      console.log(await magic.user.isLoggedIn())
    } catch (err) {
    }
  }
  const userLogin = async() => {
    const magic = new Magic(process.env.NEXT_PUBLIC_MAGIC_PUB_KEY)
    try {
      await magic.auth.loginWithCredential();
      const metadata = await magic.user.getMetadata()
      const { email, publicAddress } = await magic.user.getMetadata()
      const genIdToken = await magic.user.generateIdToken()
      const getIdToken = await magic.user.getIdToken()
      const isLoggedIn = await magic.user.isLoggedIn()
      setEmail(email)
      setAddress(publicAddress)
      setGenIdToken(genIdToken)
      setGetIdToken(getIdToken)
      setUserStatus(isLoggedIn)
      console.log("Metadata: ", metadata)
      console.log("Is logged in? ", isLoggedIn)
    } catch (err) {
    }
  }
  useEffect(() => { userLogin() }, [])

  return(
    <Box py={50}>
      <Container maxW="container.lg">
        <Heading>Dashboard</Heading>
          <Button pos="absolute" {...getButtonProps()}>Toggle</Button>
            <motion.div
              {...getDisclosureProps()}
              hidden={hidden}
              initial={false}
              onAnimationStart={() => setHidden(false)}
              onAnimationComplete={() => setHidden(!isOpen)}
              animate={{ width: isOpen ? 500 : 0 }}
              style={{
                background: 'pink',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                position: 'absolute',
                right: '0',
                height: '100vh',
                top: '0',
              }}>
            </motion.div>
        <Stack py={50} fontWeight={900}>
          <Text>Would you like to update your email address?</Text>
          <HStack pb={10} spacing={2}>
            <Input id="update" w="150px" variant="solid" bg="black" color="white" type="email" placeholder="New email address" onChange={(event) => setUpdate(event.target.value)} />
            <Button bg="green.300" variant="solid" onClick={updateHandler}>Update</Button>
          </HStack>
          <Text>Email: {email}</Text>
          <Text>Public Address: {address.slice(0, 15)}</Text>
          <Text>User ID Token: {getIdToken.slice(0, 20)}</Text>
          <Text>Generated Token: {genIdToken.slice(0, 24)}</Text>
        </Stack>
        <Link onClick={userLogout} href="/">Logout</Link>
      </Container>
    </Box>
  )
}