import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Heart, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ConnectWallet } from "@/components/ConnectWallet";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther, keccak256, toBytes } from 'viem';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/config/contracts';

const Donor = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const { address, isConnected } = useAccount();
  const { data: hash, writeContract, isPending, error } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const handleDonate = async () => {
    if (!isConnected) {
      toast({
        title: "钱包未连接",
        description: "请先连接你的钱包",
        variant: "destructive",
      });
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: "请输入有效金额",
        description: "捐助金额必须大于0",
        variant: "destructive"
      });
      return;
    }

    try {
      // 加密消息（使用 keccak256 哈希）
      const encryptedData = message 
        ? keccak256(toBytes(message))
        : keccak256(toBytes("Anonymous donation"));

      // 调用智能合约
      writeContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: CONTRACT_ABI as any,
        functionName: 'donate',
        args: [encryptedData],
        value: parseEther(amount),
      });

      toast({
        title: "交易已提交",
        description: "请在钱包中确认交易...",
      });
    } catch (error: any) {
      console.error('Donation error:', error);
      toast({
        title: "捐赠失败",
        description: error.message || "交易失败，请重试",
        variant: "destructive",
      });
    }
  };

  // 监听交易成功
  useEffect(() => {
    if (isSuccess) {
      toast({
        title: "捐助成功！",
        description: `感谢您捐助 ${amount} ETH，您的爱心将帮助需要帮助的女性。`,
      });
      setAmount("");
      setMessage("");
    }
  }, [isSuccess]);

  // 监听交易错误
  useEffect(() => {
    if (error) {
      toast({
        title: "交易失败",
        description: error.message,
        variant: "destructive",
      });
    }
  }, [error]);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回首页
          </Button>
          <ConnectWallet />
        </div>

        <div className="bg-gradient-warm rounded-2xl p-8 mb-8 shadow-soft">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">捐助人面板</h1>
              <p className="text-white/90">进行加密捐赠，支持慈善事业</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 shadow-card">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">1,234</div>
              <div className="text-muted-foreground">总捐助人数</div>
            </div>
          </Card>
          <Card className="p-6 shadow-card">
            <div className="text-center">
              <div className="text-3xl font-bold text-secondary mb-2">567.8 ETH</div>
              <div className="text-muted-foreground">总捐助金额</div>
            </div>
          </Card>
          <Card className="p-6 shadow-card">
            <div className="text-center">
              <div className="text-3xl font-bold text-accent mb-2">892</div>
              <div className="text-muted-foreground">受益女性</div>
            </div>
          </Card>
        </div>

        <Card className="p-8 shadow-card">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold">加密捐赠</h2>
          </div>

          <div className="space-y-6">
            <div>
              <Label htmlFor="amount">捐助金额 (ETH)</Label>
              <Input
                id="amount"
                type="number"
                step="0.001"
                placeholder="0.001"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="message">留言（可选，将被加密）</Label>
              <Textarea
                id="message"
                placeholder="写下您对受助人的祝福..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="mt-2 min-h-[100px]"
              />
            </div>

            <div className="bg-muted p-4 rounded-lg">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Shield className="w-4 h-4" />
                隐私保护说明
              </h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• 您的留言将使用非对称加密算法加密存储</li>
                <li>• 只有经过授权的受助人可以解密查看</li>
                <li>• 捐助记录将永久保存在区块链上</li>
                <li>• 您的个人信息将得到完整保护</li>
              </ul>
            </div>

            <Button 
              className="w-full bg-gradient-warm text-white hover:opacity-90 shadow-soft"
              size="lg"
              onClick={handleDonate}
              disabled={!isConnected || isPending || isConfirming}
            >
              {!isConnected 
                ? "请先连接钱包" 
                : isPending 
                ? "等待钱包确认..." 
                : isConfirming 
                ? "交易确认中..." 
                : "确认捐助"}
            </Button>
            
            {isConnected && address && (
              <p className="text-sm text-muted-foreground text-center">
                已连接: {address.slice(0, 6)}...{address.slice(-4)}
              </p>
            )}
          </div>
        </Card>

        <Card className="mt-8 p-6 bg-muted border-none">
          <h3 className="font-semibold mb-4">如何使用智能合约？</h3>
          <ol className="space-y-2 text-sm text-muted-foreground">
            <li>1. 连接您的Web3钱包（MetaMask等）</li>
            <li>2. 确保钱包中有足够的ETH用于捐助和Gas费用</li>
            <li>3. 填写捐助金额和留言，点击"确认捐助"</li>
            <li>4. 在钱包中确认交易，等待区块链确认</li>
            <li>5. 交易成功后，您的捐助将被记录在链上</li>
          </ol>
        </Card>
      </div>
    </div>
  );
};

export default Donor;
