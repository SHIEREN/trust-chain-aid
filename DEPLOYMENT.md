# 区块链慈善平台部署指南

## 📋 项目概述

这是一个基于以太坊智能合约的女性慈善捐助平台，支持多方参与（捐助人、受助人、NGO、商户、审计员），实现隐私保护的透明捐赠流程。

## 🛠 技术栈

- **前端**: React + TypeScript + Tailwind CSS + Vite
- **智能合约**: Solidity ^0.8.20
- **Web3库**: ethers.js, wagmi, RainbowKit
- **区块链**: 以太坊测试网（Sepolia推荐）

## 🚀 快速开始

### 1. 本地开发

```bash
# 克隆项目
git clone <your-repo-url>
cd charity-platform

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

访问 http://localhost:8080 查看应用

### 2. 智能合约部署

#### 准备工作

1. 安装 [MetaMask](https://metamask.io/) 钱包
2. 获取测试网ETH（从水龙头获取）:
   - Sepolia: https://sepoliafaucet.com/
   - Goerli: https://goerlifaucet.com/

3. 安装 Hardhat 或 Foundry

#### 使用 Hardhat 部署

```bash
# 安装 Hardhat
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox

# 初始化 Hardhat 项目
npx hardhat init

# 创建部署脚本
mkdir -p scripts
```

创建 `scripts/deploy.js`:

```javascript
const hre = require("hardhat");

async function main() {
  console.log("开始部署 CharityPlatform 合约...");

  const CharityPlatform = await hre.ethers.getContractFactory("CharityPlatform");
  const charityPlatform = await CharityPlatform.deploy();

  await charityPlatform.waitForDeployment();

  const address = await charityPlatform.getAddress();
  console.log("CharityPlatform 部署成功！");
  console.log("合约地址:", address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
```

创建 `hardhat.config.js`:

```javascript
require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config();

module.exports = {
  solidity: "0.8.20",
  networks: {
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL || "",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    }
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY
  }
};
```

创建 `.env` 文件:

```env
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID
PRIVATE_KEY=your_wallet_private_key_here
ETHERSCAN_API_KEY=your_etherscan_api_key
```

⚠️ **重要**: 将 `.env` 添加到 `.gitignore`，不要上传私钥！

部署合约:

```bash
# 复制合约文件
cp contracts/CharityPlatform.sol contracts/

# 编译合约
npx hardhat compile

# 部署到 Sepolia 测试网
npx hardhat run scripts/deploy.js --network sepolia

# 验证合约（可选）
npx hardhat verify --network sepolia DEPLOYED_CONTRACT_ADDRESS
```

### 3. 连接前端与合约

部署成功后，更新前端配置：

1. 创建 `src/config/contracts.ts`:

```typescript
export const CONTRACT_ADDRESS = "0x你的合约地址";

export const CONTRACT_ABI = [
  // 从 artifacts/contracts/CharityPlatform.sol/CharityPlatform.json 复制 ABI
];
```

2. 在前端页面中使用 ethers.js 或 wagmi 与合约交互

## 📤 部署到 GitHub Pages

### 1. GitHub 仓库设置

```bash
# 初始化 git（如果还没有）
git init

# 添加远程仓库
git remote add origin https://github.com/yourusername/charity-platform.git

# 提交代码
git add .
git commit -m "Initial commit"
git push -u origin main
```

### 2. 配置 GitHub Pages

1. 进入 GitHub 仓库设置
2. 找到 "Pages" 部分
3. Source 选择 "GitHub Actions"

### 3. 创建部署工作流

创建 `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout
      uses: actions/checkout@v3
      
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Build
      run: npm run build
      
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist
```

### 4. 更新 vite.config.ts

```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  base: '/charity-platform/', // 替换为你的仓库名
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
```

### 5. 推送并部署

```bash
git add .
git commit -m "Add GitHub Pages deployment"
git push origin main
```

几分钟后，访问: `https://yourusername.github.io/charity-platform/`

## 🌐 部署到 Vercel（推荐）

Vercel 提供更好的性能和更简单的部署流程：

1. 访问 [Vercel](https://vercel.com/)
2. 点击 "Import Project"
3. 导入你的 GitHub 仓库
4. Vercel 会自动识别 Vite 项目并部署
5. 完成！你将获得一个 `.vercel.app` 域名

## 📝 合约交互示例

### 捐助（Donate）

```typescript
import { ethers } from "ethers";

const donate = async (amount: string, message: string) => {
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
  
  // 加密消息（简化版，实际应使用更强的加密）
  const encryptedData = ethers.keccak256(ethers.toUtf8Bytes(message));
  
  const tx = await contract.donate(encryptedData, {
    value: ethers.parseEther(amount)
  });
  
  await tx.wait();
  console.log("捐助成功！");
};
```

### 注册受助人

```typescript
const registerBeneficiary = async (identityData: string) => {
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
  
  const identityHash = ethers.keccak256(ethers.toUtf8Bytes(identityData));
  
  const tx = await contract.registerBeneficiary(identityHash);
  await tx.wait();
  console.log("注册成功！");
};
```

## 🔐 安全注意事项

1. **永远不要**将私钥提交到 Git
2. 在生产环境使用环境变量管理敏感信息
3. 部署前审计智能合约
4. 使用多签钱包管理合约所有权
5. 为合约添加暂停功能以应对紧急情况

## 🧪 测试

```bash
# 运行前端测试
npm run test

# 测试智能合约
npx hardhat test
```

## 📚 相关资源

- [Solidity 文档](https://docs.soliditylang.org/)
- [Hardhat 文档](https://hardhat.org/docs)
- [ethers.js 文档](https://docs.ethers.org/)
- [Sepolia 测试网浏览器](https://sepolia.etherscan.io/)

## 🐛 故障排查

### MetaMask 连接失败

确保：
- MetaMask 已安装并解锁
- 切换到正确的网络（Sepolia）
- 网站已获得连接权限

### 合约部署失败

检查：
- 钱包中有足够的测试 ETH
- RPC URL 正确
- 私钥格式正确（以 0x 开头）

### 交易失败

确认：
- Gas 费用足够
- 合约地址正确
- 函数参数类型匹配

## 📞 支持

如有问题，请提交 GitHub Issue 或联系开发团队。

---

**祝您部署顺利！** 🎉
