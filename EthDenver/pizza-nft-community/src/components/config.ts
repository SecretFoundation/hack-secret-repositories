import { http, createConfig } from '@wagmi/core'
import { baseSepolia } from '@wagmi/core/chains'

 const config1 = createConfig({
  chains: [baseSepolia],
  transports: {
    [baseSepolia.id]: http()
  },
})

export {config1}