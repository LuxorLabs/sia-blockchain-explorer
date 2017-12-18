import axios from 'axios'

export const makeApiBlockLink = height => `/api/blocks/${height}`
export const makeApiHashLink = hash => `/api/hashes/${hash}`

// TO DO Error handling
export const fetchBlock = (height: number) => axios.get(makeApiBlockLink(height))

export const fetchHash = (hash: string) => axios.get(makeApiHashLink(hash))

export const fetchPending = () => axios.get('/api/pending')

export const fetchLatest = () => axios.get('/api/latest')
