import { ChakraProvider } from '@chakra-ui/react'
import { GeistProvider, CssBaseline } from '@geist-ui/core'
function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider>
      <GeistProvider>
      <CssBaseline />
        <Component {...pageProps} />
      </GeistProvider>
    </ChakraProvider>
  )
}

export default MyApp