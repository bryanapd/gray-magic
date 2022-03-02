import { Fragment } from 'react'
import { useState } from 'react'
import { 
  Box, Grid, Text, Heading, HStack, Button, Stack, Container, 
  Spacer, Input, InputGroup, InputLeftElement
} from '@chakra-ui/react'
import { EmailIcon, PhoneIcon } from '@chakra-ui/icons'
import matter from 'gray-matter'
import { Magic, RPCError, RPCErrorCode } from 'magic-sdk'
import { ethers } from 'ethers';
import { OAuthExtension } from '@magic-ext/oauth'


const darkMatter = matter('---\ntitle: Dark Matter\n---\nThe greatest magician ever existed.')
const firstFourLines = (file, options) => file.excerpt = file.content.split('\n').slice(0, 3).join(' ') 
const file =  matter(['---', 'foo: bar', '---', 'N', 'is the', 'greatest', 'magician', 'ever...'].join('\n'), {excerpt: firstFourLines});
console.log("WELCOME TO DARK MATTER ", file)
export default function Home() {
  const [email, setEmail] = useState('')
  const [sms, setSMSNumber] = useState('')

  const emailHandler = async () => {
    const magic = new Magic(process.env.NEXT_PUBLIC_MAGIC_PUB_KEY)
    const idToken = await magic.user.generateIdToken({ attachment: 'SERVER_SECRET' });
    try {
      await magic.auth.loginWithMagicLink({ email: email, redirectURI: 'http://localhost:3000/dashboard' });
    } catch (err) {
      if (err instanceof RPCError) {
        switch (err.code) {
          case RPCErrorCode.MagicLinkFailedVerification:
          case RPCErrorCode.MagicLinkExpired:
          case RPCErrorCode.MagicLinkRateLimited:
          case RPCErrorCode.UserAlreadyLoggedIn:
            break;
        }
      }
    }
  }
  const smsHandler = async () => {
    const magic = new Magic(process.env.NEXT_PUBLIC_MAGIC_PUB_KEY)
    try {
      await magic.auth.loginWithSMS({ phoneNumber: sms });
    } catch (err) {
      if (err instanceof RPCError) {
        switch (err.code) {
          case RPCErrorCode.AccessDeniedToUser:
          case RPCErrorCode.MagicLinkRateLimited:
          case RPCErrorCode.UserAlreadyLoggedIn:
            break;
        }
      }
    }
  }

  const facebookHandler = async () => {
    const magic = new Magic(process.env.NEXT_PUBLIC_MAGIC_PUB_KEY, {
      extensions: [new OAuthExtension()]
    })
    try {
      await magic.oauth.loginWithRedirect({
        provider: 'facebook',
        redirectURI: 'http://localhost:3000/dashboard'
      })
    } catch (err) {
    }
  }
  const googleHandler = async () => {
    const magic = new Magic(process.env.NEXT_PUBLIC_MAGIC_PUB_KEY, {
      extensions: [new OAuthExtension()]
    })
    try {
      await magic.oauth.loginWithRedirect({
        provider: 'google',
        redirectURI: 'http://localhost:3000/dashboard'
      })
    } catch (err) {
    }
  }
  const ethereumHandler = async () => {
    const magic = new Magic(process.env.NEXT_PUBLIC_MAGIC_PUB_KEY)
    const provider = new ethers.providers.Web3Provider(magic.rpcProvider);
    try {
      await magic.auth.loginWithSMS({ phoneNumber: sms });
    } catch (err) {
      if (err instanceof RPCError) {
        switch (err.code) {
          case RPCErrorCode.AccessDeniedToUser:
          case RPCErrorCode.MagicLinkRateLimited:
          case RPCErrorCode.UserAlreadyLoggedIn:
            break;
        }
      }
    }
  }

  return (
    <Fragment>
      <Box h="100vh" py={50} bgGradient="linear(to-r, #FFEFBA, #FFFFFF)">
        <Container maxW="container.lg" centerContent>
          <Box p={20} border="1px solid black">
            <Heading>Dark Matter</Heading>
            <Stack>
              <Text>Title: {darkMatter.data.title}</Text>
              <Text>Content: {darkMatter.content}</Text>
            </Stack>
            <Stack color="green">
              <Text>{file.content}</Text>
              <Text>{file.excerpt}</Text>
              <Text fontStyle="italic" fontSize="xs" color="gray.400">Console log to see more of dark matter...</Text>
            </Stack>
            <Stack pt={30}>
              <Heading>Magic!</Heading>
              <InputGroup>
                <InputLeftElement pointerEvents="none" children={<PhoneIcon color="gray.300" />} />
                <Input variant="solid" bg="black" color="white" type="tel" placeholder="Phone number" onChange={(event) => setSMSNumber(event.target.value)} />
              </InputGroup>
              <InputGroup>
                <InputLeftElement pointerEvents="none" children={<EmailIcon color="gray.300" />} />
                <Input variant="solid" bg="black" color="white" type="email" placeholder="Email address" onChange={(event) => setEmail(event.target.value)} />
              </InputGroup>
              <HStack>
                <Button variant="solid" onClick={smsHandler}>Verify your phone number</Button>
                <Button bg="green.300" variant="solid" onClick={emailHandler}>Login</Button>
              </HStack>
              <Text color="gray.400" py={5}>Or use any of the following..</Text>
              <HStack spacing={10} justifyContent="center">
                <Button variant="link" onClick={facebookHandler}>Facebook</Button>
                <Button variant="link" onClick={googleHandler}>Google</Button>
              </HStack>
            </Stack>
          </Box>
        </Container>
      </Box>
    </Fragment>
  )
}
