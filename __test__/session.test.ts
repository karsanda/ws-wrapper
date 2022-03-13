import { Session } from '../src/session'
import { WebSocketAdapter } from '../src/adapter'

describe('Session', () => {
  const url = 'ws://stub-url'
  const onOpen = () => {}
  const onClose = () => {}
  const onMessage = () => {}
  const onError = () => {}
  const events = { onOpen, onClose, onMessage, onError }

  describe('#constructor', () => {
    test('it should call WebSocketAdapter.create', () => {
      jest.spyOn(WebSocketAdapter, 'create')
      const session = new Session(url, events)

      expect(WebSocketAdapter.create).toHaveBeenCalledWith(url, events)

      jest.spyOn(session.adapter, 'readyState', 'get').mockReturnValue(1)
      session.close()
    })
  })

  describe('#close', () => {
    test('it should call Session.adapter.close', () => {
      const session = new Session(url, events)
      jest.spyOn(session.adapter, 'close')
      jest.spyOn(session.adapter, 'readyState', 'get').mockReturnValue(1)

      session.close()
      expect(session.adapter.close).toHaveBeenCalled()
    })

    test('it should return console.error if readyState is not 1', () => {
      const session = new Session(url, events)
      jest.spyOn(console, 'error').mockImplementation(() => {})

      session.close()
      expect(console.error).toHaveBeenCalledWith('Connection to WebSocket has not been opened yet.')
    })
  })

  describe('#sendMessage', () => {
    test('it should call Session.adapter.send', () => {
      const session = new Session(url, events)
      jest.spyOn(session.adapter, 'send').mockImplementation(() => {})
      jest.spyOn(session.adapter, 'readyState', 'get').mockReturnValue(1)

      session.sendMessage('stub-data')
      expect(session.adapter.send).toHaveBeenCalledWith('stub-data')
    })

    test('it should return console.error if readyState is not 1', () => {
      const session = new Session(url, events)
      jest.spyOn(console, 'error').mockImplementation(() => {})

      session.sendMessage('stub-data')
      expect(console.error).toHaveBeenCalledWith('Connection to WebSocket has not been opened yet.')
    })
  })

  describe('#readyState', () => {
    test('it should return ready state from WebSocket', () => {
      const session = new Session(url, events)
      expect(session.readyState()).toBe(0)
    })
  })

  describe('#adapter', () => {
    test('returns undefined if NODE_ENV is not test', () => {
      const OLD_ENV = process.env

      const session = new Session(url, events)
      process.env.NODE_ENV = 'development'
      expect(session.adapter).toBe(undefined)

      process.env = OLD_ENV
    })
  })
})