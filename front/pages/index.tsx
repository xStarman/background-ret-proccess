import { Box, Container, Flex, Grid, GridItem } from '@chakra-ui/react'
import { useEffect, useMemo, useState } from 'react'
import { api } from '../services/api'
type File = {
  id: string
  heading: string
  status: string
}
export default function Home() {

  const [files, setFiles] = useState<File[]>([])

  useEffect(() => {
    if (typeof window != 'undefined') {
      const socket = new WebSocket(process.env.NEXT_PUBLIC_SOCKET_URL || '')
      socket.onmessage = (msg) => {
        const data = JSON.parse(msg.data)
        setFiles((oldValue: File[]) => {
          const fileIndex = oldValue.findIndex(file => file.id == data.id)
          if (fileIndex > -1) {
            oldValue[fileIndex].status = data.percent
            return [...oldValue]
          }
          return oldValue
        })
      }
    }
  }, [])

  const loadFiles = async () => {
    const list = await api.get('/list')
    setFiles(list.data)
  }
  const upload = async (e) => {
    if (!e.target.files) return
    const formData = new FormData();
    let file = e.target.files[0];
    formData.append("ret", file);
    const res = await api.post('/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
    setFiles([...files, res.data])
  }
  useEffect(() => {
    loadFiles()
  }, [])
  return (
    <Container maxW='2xl' pt="24" centerContent>
      <Grid w="full" templateColumns="100%" templateRows="1fr auto" gap="4">
        <GridItem bg="gray.200" px="6" py="4">
          <input type="file" onChange={upload} />
        </GridItem>
        <GridItem bg="gray.200" px="6" py="4">

          <Grid mb="3" fontWeight={500} templateColumns="2fr 8fr 2fr" justifyContent="space-between">
            <GridItem>ID</GridItem>
            <GridItem>HEADER</GridItem>
            <GridItem>STATUS</GridItem>
          </Grid>
          {
            files.map(file => {
              return (<Grid templateColumns="2fr 8fr 2fr" key={file.id} justifyContent="space-between">
                <GridItem>{file.id}</GridItem>
                <GridItem>{file.heading}</GridItem>
                <GridItem>{file.status}</GridItem>
              </Grid>)
            }
            )
          }
        </GridItem>
      </Grid>
    </Container>

  )
}
