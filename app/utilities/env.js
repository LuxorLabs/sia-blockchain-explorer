const isServer = typeof window === 'undefined'
const isClient = !isServer
const isProduction = process.env.NODE_ENV === 'production'
const isStaging = process.env.ENV === 'staging'
const isTest = process.env.NODE_ENV === 'test'
const isDevelopment = !isProduction && !isTest
const isDevelopmentClient = isDevelopment && isClient
const isProductionClient = isProduction && isClient
const isDevelopmentServer = isDevelopment && isServer
const isProductionServer = isProduction && isServer
const port = parseInt(process.env.PORT, 10) || 40154
const protocol = process.env.PROTOCOL || 'https'

module.exports = {
  isServer,
  isClient,
  isProduction,
  isStaging,
  isDevelopment,
  isTest,
  isDevelopmentClient,
  isProductionClient,
  isDevelopmentServer,
  isProductionServer,
  port,
  protocol
}
