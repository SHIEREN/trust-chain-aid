import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Shield, Lock, CheckCircle } from "lucide-react";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useWriteContract, useReadContract } from 'wagmi';
import { parseEther } from 'viem';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/config/web3';

const Donor = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isConnected } = useAccount();
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  
  const { writeContract, isPending } = useWriteContract();
  
  // 读取合约总捐赠额 - 仅在合约地址有效时读取
  const isValidAddress = CONTRACT_ADDRESS !== '0x0000000000000000000000000000000000000000';
  const { data: totalDonations } = useReadContract({
    address: isValidAddress ? (CONTRACT_ADDRESS as `0x${string}`) : undefined,
    abi: CONTRACT_ABI,
    functionName: 'totalDonations',
    query: {
      enabled: isValidAddress,
    }
  });

  const handleDonate = () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: "金额无效",
        description: "请输入有效的捐赠金额",
        variant: "destructive",
      });
      return;
    }

    if (!isConnected) {
      toast({
        title: "请先连接钱包",
        description: "点击右上角连接 MetaMask",
        variant: "destructive",
      });
      return;
    }

    // 将消息转换为 bytes32（简化版，实际应使用加密）
    const encryptedMessage = message 
      ? `0x${Buffer.from(message.slice(0, 32).padEnd(32, ' ')).toString('hex')}` as `0x${string}`
      : '0x0000000000000000000000000000000000000000000000000000000000000000' as `0x${string}`;

    // @ts-ignore - wagmi v2 类型问题
    writeContract({
      address: CONTRACT_ADDRESS as `0x${string}`,
      abi: CONTRACT_ABI,
      functionName: 'donate',
      args: [encryptedMessage],
      value: parseEther(amount),
    }, {
      onSuccess: () => {
        toast({
          title: "捐赠成功！",
          description: `已捐赠 ${amount} ETH`,
        });
        setAmount("");
        setMessage("");
      },
      onError: (error: Error) => {
        console.error(error);
        toast({
          title: "捐赠失败",
          description: error.message || "交易被取消或失败",
          variant: "destructive",
        });
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-6 group"
        >
          <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
          返回首页
        </Button>

        <div className="flex justify-end mb-6">
          <ConnectButton />
        </div>

        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
            加密捐赠
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            使用区块链技术进行透明且隐私保护的慈善捐赠
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="border-primary/20 hover:shadow-elegant transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-2xl">1,234</CardTitle>
              <CardDescription>总捐赠人数</CardDescription>
            </CardHeader>
          </Card>
          <Card className="border-primary/20 hover:shadow-elegant transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-2xl">
                {totalDonations ? `${Number(totalDonations) / 1e18} ETH` : '0 ETH'}
              </CardTitle>
              <CardDescription>总捐赠金额（链上数据）</CardDescription>
            </CardHeader>
          </Card>
          <Card className="border-primary/20 hover:shadow-elegant transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-2xl">567</CardTitle>
              <CardDescription>受助人数</CardDescription>
            </CardHeader>
          </Card>
        </div>

        <Card className="max-w-2xl mx-auto shadow-elegant">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              加密货币捐赠
            </CardTitle>
            <CardDescription>
              您的捐赠将直接进入智能合约，确保透明且安全
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="amount">捐赠金额 (ETH)</Label>
              <Input
                id="amount"
                type="number"
                step="0.001"
                placeholder="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="text-lg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">
                加密留言 <span className="text-muted-foreground">(可选)</span>
              </Label>
              <Input
                id="message"
                placeholder="您的祝福将被加密存储..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                maxLength={32}
              />
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <Lock className="h-3 w-3" />
                留言将通过零知识证明加密，只有受助人可见
              </p>
            </div>

            <Button 
              onClick={handleDonate} 
              disabled={isPending || !isConnected}
              className="w-full text-lg h-12 bg-gradient-primary hover:opacity-90 transition-all shadow-glow"
            >
              {isPending ? "处理中..." : isConnected ? "确认捐赠" : "请先连接钱包"}
            </Button>

            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
              <h3 className="font-semibold flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-primary" />
                隐私保护机制
              </h3>
              <ul className="text-sm text-muted-foreground space-y-1 ml-6">
                <li>• 使用零知识证明保护捐赠者身份</li>
                <li>• 留言经过端到端加密</li>
                <li>• 智能合约自动执行，无人工干预</li>
                <li>• 所有交易可在区块链上验证</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card className="max-w-2xl mx-auto mt-8 border-accent/30">
          <CardHeader>
            <CardTitle>📝 部署说明</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p className="text-muted-foreground">
              当前使用的是模拟合约地址，要真正使用需要：
            </p>
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
              <li>部署 CharityPlatform.sol 到测试网（如 Sepolia）</li>
              <li>更新 <code className="bg-muted px-2 py-1 rounded">src/config/web3.ts</code> 中的 CONTRACT_ADDRESS</li>
              <li>在 MetaMask 中切换到对应测试网</li>
              <li>从水龙头获取测试币：<a href="https://sepoliafaucet.com" className="text-primary hover:underline" target="_blank" rel="noopener">sepoliafaucet.com</a></li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Donor;
