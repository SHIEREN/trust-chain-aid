# 如何部署智能合约到测试网（新手指南）

## 📝 准备工作

### 1. 安装 MetaMask 钱包
1. 访问 https://metamask.io/
2. 点击 "Download" 下载浏览器插件
3. 创建钱包并**安全保存助记词**（非常重要！）

### 2. 切换到 Sepolia 测试网
1. 打开 MetaMask
2. 点击顶部网络下拉菜单
3. 点击 "显示测试网络"
4. 选择 "Sepolia 测试网络"

### 3. 获取测试币（免费）
访问以下任意一个水龙头获取测试 ETH：
- https://sepoliafaucet.com/
- https://www.alchemy.com/faucets/ethereum-sepolia
- https://cloud.google.com/application/web3/faucet/ethereum/sepolia

通常需要等待几分钟，测试币会自动转到你的钱包。

---

## 🚀 使用 Remix IDE 部署合约（最简单）

### 步骤 1: 打开 Remix
访问 https://remix.ethereum.org/

### 步骤 2: 创建合约文件
1. 在左侧文件浏览器中，点击 "contracts" 文件夹
2. 点击 "新建文件" 图标
3. 命名为 `CharityPlatform.sol`
4. 将项目中的 `contracts/CharityPlatform.sol` 文件内容复制粘贴进去

### 步骤 3: 编译合约
1. 点击左侧 "Solidity Compiler" 图标（第二个图标）
2. 选择编译器版本：`0.8.20`
3. 点击 "Compile CharityPlatform.sol" 按钮
4. 看到绿色勾号表示编译成功

### 步骤 4: 部署合约
1. 点击左侧 "Deploy & Run Transactions" 图标（第三个图标）
2. **Environment** 选择：`Injected Provider - MetaMask`
3. MetaMask 会弹出，点击 "连接"
4. 确认你的钱包显示在 "Account" 下方
5. **Contract** 选择：`CharityPlatform`
6. 点击橙色的 "Deploy" 按钮
7. MetaMask 会弹出交易确认，点击 "确认"
8. 等待几秒钟，交易确认后会在下方看到已部署的合约

### 步骤 5: 复制合约地址
1. 在 "Deployed Contracts" 部分，你会看到已部署的合约
2. 点击复制图标，复制合约地址（类似 `0x123abc...`）
3. **保存这个地址！后面会用到**

---

## 🔗 连接前端到合约

### 1. 更新合约地址
在你的项目中，打开 `src/config/contracts.ts` 文件，将：

```typescript
export const CONTRACT_ADDRESS = "0x0000000000000000000000000000000000000000";
```

替换为你刚才复制的合约地址：

```typescript
export const CONTRACT_ADDRESS = "0x你的合约地址";
```

### 2. 推送代码到 GitHub
在 Lovable 界面：
1. 点击右上角 "GitHub" 按钮
2. 点击 "Push to GitHub"
3. 代码会自动同步到你的 GitHub 仓库

### 3. 重新发布网站
1. 点击 "Publish" 按钮
2. 点击 "Update" 更新线上网站
3. 等待几分钟部署完成

---

## ✅ 测试捐赠功能

1. 访问你的网站：https://sheaide.lovable.app
2. 点击 "Donor" 进入捐赠页面
3. 点击右上角 "Connect Wallet" 连接 MetaMask
4. 输入捐赠金额（例如 0.001 ETH）
5. 点击 "确认捐赠"
6. MetaMask 会弹出，点击 "确认"
7. 等待交易确认（约 15-30 秒）
8. 看到成功提示！

---

## 🔍 查看交易记录

访问 Sepolia 区块浏览器：
https://sepolia.etherscan.io/

在搜索框输入你的合约地址或交易哈希，可以看到所有交易记录。

---

## ❓ 常见问题

### Q: 交易失败，提示 "insufficient funds"
**A**: 你的钱包没有足够的测试币，请重新访问水龙头获取。

### Q: MetaMask 没有弹出
**A**: 
1. 确保 MetaMask 已解锁
2. 刷新页面
3. 检查是否切换到了 Sepolia 测试网

### Q: 合约部署失败
**A**: 
1. 确认钱包有足够的测试 ETH（至少 0.05 ETH）
2. 检查网络是否正确（Sepolia）
3. 尝试增加 Gas 费用

### Q: 如何查看合约余额？
**A**: 在 Remix 中，找到已部署的合约，点击 "getContractBalance" 按钮查看。

---

## 🎉 完成！

恭喜！你已经成功：
✅ 部署了智能合约到区块链
✅ 连接了前端到合约
✅ 可以接收真实的测试币捐赠

接下来可以继续完善其他功能（受助人注册、商户系统等）。

---

## 📚 进阶资源

- [Solidity 官方文档](https://docs.soliditylang.org/)
- [Remix 使用教程](https://remix-ide.readthedocs.io/)
- [MetaMask 使用指南](https://support.metamask.io/)
- [Etherscan 浏览器](https://etherscan.io/)
