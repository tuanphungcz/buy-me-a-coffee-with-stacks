import { StacksMainnet, StacksMocknet, StacksTestnet } from '@stacks/network';

const mainnet = new StacksMainnet();
const testnet = new StacksTestnet();
const devnet = new StacksMocknet();

export const getNetworkConfig = () => {
  if (process.env.NEXT_PUBLIC_NETWORK === 'mainnet') {
    return {
      network: mainnet,
      explorerUrl: 'https://explorer.stacks.co',
      contractAddress: 'SP2PNJSEDHK8HZ0DE44JDT9T2Q429D86F4KJ9J5NM'
    };
  }

  if (process.env.NEXT_PUBLIC_NETWORK === 'testnet') {
    return {
      network: testnet,
      explorerUrl: 'https://explorer.stacks.co',
      contractAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM'
    };
  }

  return {
    network: devnet,
    explorerUrl: 'http://localhost:8000',
    contractAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM'
  };
};
