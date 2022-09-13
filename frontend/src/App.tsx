import { useCallback, useEffect, useState } from 'react'
import {
  Button,
  ButtonGroup,
  Center,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Icon,
  Input,
  InputGroup,
  InputRightAddon,
  Text
} from '@chakra-ui/react'
import { shortenUrl } from './api'
import * as yup from 'yup'
import ENV from './env'
import { TbNetwork } from 'react-icons/tb'
import { ArrowForwardIcon, CopyIcon } from '@chakra-ui/icons'

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
  const [notifyCopy, setNotifyCopy] = useState<string>('')

  const onInputChange = useCallback((e: any) => {
    setUrl(e.target.value)
  }, [])

  const onCopyHandler = useCallback(async () => {
    if (!result) {
      return
    }

    await navigator.clipboard.writeText(result).then(() => {
      setNotifyCopy('Copied to your clipboard!')
    })
  }, [result])

  const onRedirectHandler = useCallback(async () => {
    if (!result) {
      return
    }

    location.href = result
  }, [result])

  useEffect(() => {
    if (!notifyCopy) {
      return
    }

    const timeout = setTimeout(() => {
      setNotifyCopy('')
    }, 2000)
    return () => clearTimeout(timeout)
  }, [notifyCopy])

  const onSubmitHandler = (e: any) => {
    setErr('')
    e.preventDefault()

    if (!isValidUrl(url)) {
      setErr('You need to enter a valid URL.')
      return
    }

    shortenUrl({
      origin: url
    })
      .then((res) => setResult(getShortUrl(res.data.shortUrl)))
      .catch(() => {
        setErr('Something went wrong! Try again later.')
      })
  }

  return (
    <Flex
      flexDirection='column'
      align='center'
      width='100vw'
      height='100vh'
      mt='10vh'
      rowGap={4}
      p={4}
    >
      <Heading display='flex' alignItems='center'>
        <Icon as={TbNetwork} /> A URL Shortening Service
      </Heading>

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
        <Center
          minW='40%'
          flexDirection='column'
          border='1px grey solid'
          borderRadius='lg'
          p={4}
        >
          <Text fontSize='xl'>Your shortened URL is</Text>
          <Text fontSize='lg'>{result}</Text>

          <ButtonGroup mt={2}>
            <Button
              type='button'
              onClick={onCopyHandler}
              rightIcon={<CopyIcon />}
            >
              Copy
            </Button>
            <Button
              type='button'
              onClick={onRedirectHandler}
              rightIcon={<ArrowForwardIcon />}
            >
              Go there
            </Button>
          </ButtonGroup>

          {<div style={{ minHeight: '2em' }}>{notifyCopy}</div>}
        </Center>
      )}

      {!result && (
        <Center minW='40%' flexDirection='column' border='1px grey solid' p={2}>
          <Text fontSize='xl'>
            Key in your original url, and we will shorten it for you!
          </Text>
        </Center>
      )}
    </Flex>
  )
}

export default App
