const { writeFile, readFileSync } = require('fs')
const { resolve } = require('path')
require('dotenv').config({ path: '.env' })

const environments = ['DEFAULT']

const variables = [
  'FIREBASE_API_KEY',
  'FIREBASE_AUTH_DOMAIN',
  'FIREBASE_PROJECT_ID',
  'FIREBASE_STORAGE_BUCKET',
  'FIREBASE_MESSAGING_SENDER_ID',
  'FIREBASE_APP_ID',
  'FIREBASE_MEASUREMENT_ID',
]

const paths = {
  DEFAULT: './src/environments/environment.ts',
}

const packageJson = readFileSync(resolve(__dirname, '..', 'package.json'))
const version = JSON.parse(packageJson).version

environments.forEach(env => {
  // const isProd = env === 'PROD'
  let variableList = ''
  variables.forEach(key => {
    variableList += `  ${key}: '${process.env[key]}',\n`
  })
  const content = `
import { Environment } from './environment.types'

export const environment: Environment = {
  VERSION: '${version}',
${variableList}
}
  `
  writeFile(paths[env], content, err => {
    if (err) {
      console.log(`[setenv] Error while setting frontend ${env} environment variables:`, err)
      return
    }
    console.log(`[setenv] Wrote ${env} environment variables to ${paths[env]}`)
  })
})
