import http from 'http'
import { createApp } from './app'

export function startServer(port: number) {
  const app = createApp()
  const server = http.createServer(app)

  server.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`)
  })
}
