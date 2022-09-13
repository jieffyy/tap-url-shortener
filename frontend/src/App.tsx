import { useCallback, useState } from 'react'
import {
  Button,
  Center,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputRightAddon,
  Text
} from '@chakra-ui/react'
import { shortenUrl } from './api'
import * as yup from 'yup'
import ENV from './env'

function isValidUrl(url: string): boolean {
  return yup.string().url().isValidSync(url)
}

function getShortUrl(shortUrl: string): string {
  return `${ENV.BASE_SHORT_URL}/${shortUrl}`
}

function App() {
  const [url, setUrl] = useState<string>('')
  const [result, setResult] = useState<string>('')
  const [err, setErr] = useState<string>('')

  const onInputChange = useCallback((e: any) => {
    setUrl(e.target.value)
  }, [])

  const onSubmitHandler = (e: any) => {
    setErr('')
    e.preventDefault()

    if (!isValidUrl(url)) {
      setErr('You need to enter a URL.')
      return
    }

    shortenUrl({
      origin: url
    })
      .then((res) => setResult(res.data.shortUrl))
      .catch(() => {
        setErr('Something went wrong! Try again later.')
      })
  }

  return (
    <Center flexDirection='column' width='100vw' height='100vh' rowGap={4}>
      <Heading>A URL Shortening Service</Heading>
      <form style={{ minWidth: '40%' }} onSubmit={onSubmitHandler}>
        <FormControl isInvalid={!!err}>
          <FormLabel>Enter the original URL</FormLabel>
          <InputGroup>
            <Input
              type='url'
              value={url}
              onChange={onInputChange}
              autoFocus
              width={'100%'}
            />
            <InputRightAddon
              children={
                <Button type='submit' p={0} m={0} onClick={onSubmitHandler}>
                  Shorten
                </Button>
              }
            />
          </InputGroup>
          <FormErrorMessage>{err}</FormErrorMessage>
        </FormControl>
      </form>

      {result && (
        <Center minW='40%' flexDirection='column'>
          <Text fontSize='xl'>Your shortened URL is</Text>
          <Text fontSize='xl'>{getShortUrl(result)}</Text>
        </Center>
      )}

      {!result && (
        <Center minW='40%' flexDirection='column'>
          <Text fontSize='xl'>
            Key in your original url, and we will shorten it for you!
          </Text>
        </Center>
      )}
    </Center>
  )
}

export default App
