import axios, { AxiosInstance } from 'axios'
import config from '../services/config'
import Accounts from './accounts'
import Users from './users'
import Projects from './projects'
import Checks from './checks'
import Assets from './assets'
import Runtimes from './runtimes'
import PrivateLocations from './private-locations'
import Locations from './locations'

export function getDefaults () {
  const environments = {
    production: {
      apiUrl: 'https://api.checklyhq.com',
    },

    development: {
      apiUrl: 'http://localhost:3000',
    },

    test: {
      apiUrl: 'https://api-test.checklyhq.com',
    },

    staging: {
      apiUrl: 'https://api-test.checklyhq.com',
    },
  }

  const env = config.getEnv()
  const apiKey = config.getApiKey()
  const accountId = config.getAccountId()
  const baseURL = environments[env].apiUrl
  const Authorization = `Bearer ${apiKey}`

  return { baseURL, accountId, Authorization, apiKey }
}

export async function isAuthenticated (): Promise<boolean> {
  if (!config.hasValidCredentials()) {
    throw new Error('Run `npx checkly login` or manually set `CHECKLY_API_KEY` ' +
      '& `CHECKLY_ACCOUNT_ID` environment variables to setup authentication.')
  }

  const accountId = config.getAccountId()
  const apiKey = config.getApiKey()

  try {
    // check if credentials works
    await accounts.get(accountId)
    return true
  } catch (err: any) {
    const { status } = err.response
    if (status === 401) {
      throw new Error(`Authentication failed with Account ID "${accountId}" ` +
        `and API key "...${apiKey?.slice(-4)}"`)
    }
  }
  return false
}

function init (): AxiosInstance {
  const { baseURL } = getDefaults()
  const api = axios.create({ baseURL })

  api.interceptors.request.use(function (config) {
    const { Authorization, accountId } = getDefaults()
    if (Authorization && config.headers) {
      config.headers.Authorization = Authorization
    }

    if (accountId && config.headers) {
      config.headers['x-checkly-account'] = accountId
    }

    return config
  })
  return api
}
export const api = init()

export const accounts = new Accounts(api)
export const user = new Users(api)
export const projects = new Projects(api)
export const checks = new Checks(api)
export const assets = new Assets(api)
export const runtimes = new Runtimes(api)
export const locations = new Locations(api)
export const privateLocations = new PrivateLocations(api)