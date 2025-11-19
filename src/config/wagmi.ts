import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { sepolia, mainnet } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'Charity Platform',
  projectId: 'YOUR_WALLETCONNECT_PROJECT_ID', // 可选，从 cloud.walletconnect.com 获取
  chains: [sepolia, mainnet],
  ssr: false,
});
