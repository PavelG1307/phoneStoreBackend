export const getEnvFilePath = () => process.env.NODE_ENV ? `./.env.${process.env.NODE_ENV}` : './.env.prod'
