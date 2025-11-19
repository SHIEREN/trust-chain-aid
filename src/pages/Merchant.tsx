import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Store, Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const Merchant = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [businessName, setBusinessName] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);

  const transactions = [
    { id: "1", beneficiary: "0x1234...5678", amount: "200", status: "pending" },
    { id: "2", beneficiary: "0x8765...4321", amount: "350", status: "pending" },
  ];

  const handleRegister = () => {
    if (!businessName) {
      toast({
        title: "请输入商户名称",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "注册成功！",
      description: "请等待NGO审核批准",
    });
    setIsRegistered(true);
  };

  const handleSubmitProof = (txId: string) => {
    toast({
      title: "凭证提交成功",
      description: `交易 #${txId} 的发货凭证已提交`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          返回首页
        </Button>

        <div className="bg-gradient-warm rounded-2xl p-8 mb-8 shadow-soft">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
              <Store className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">商户面板</h1>
              <p className="text-white/90">提供物资，提交发货凭证</p>
            </div>
          </div>
        </div>

        {!isRegistered ? (
          <Card className="p-8 shadow-card">
            <h2 className="text-2xl font-bold mb-6">商户注册</h2>
            
            <div className="space-y-6">
              <div>
                <Label htmlFor="businessName">商户名称</Label>
                <Input
                  id="businessName"
                  placeholder="输入您的商户名称"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="mt-2"
                />
              </div>

              <div className="bg-muted p-4 rounded-lg">
                <h3 className="font-semibold mb-2">商户要求</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• 需要提供合法的营业执照</li>
                  <li>• 能够提供女性生活必需品</li>
                  <li>• 承诺按时发货并提交凭证</li>
                  <li>• 接受平台审计监督</li>
                </ul>
              </div>

              <Button 
                className="w-full bg-gradient-warm"
                size="lg"
                onClick={handleRegister}
              >
                提交注册
              </Button>
            </div>
          </Card>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="p-6 shadow-card">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">5</div>
                  <div className="text-muted-foreground">待处理订单</div>
                </div>
              </Card>
              <Card className="p-6 shadow-card">
                <div className="text-center">
                  <div className="text-3xl font-bold text-accent mb-2">42</div>
                  <div className="text-muted-foreground">已完成订单</div>
                </div>
              </Card>
              <Card className="p-6 shadow-card">
                <div className="text-center">
                  <div className="text-3xl font-bold text-secondary mb-2">12,580</div>
                  <div className="text-muted-foreground">总销售额 (元)</div>
                </div>
              </Card>
            </div>

            <Card className="p-6 shadow-card">
              <div className="flex items-center gap-3 mb-6">
                <Upload className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold">待处理交易</h2>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>交易ID</TableHead>
                    <TableHead>受助人</TableHead>
                    <TableHead>金额</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead>操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((tx) => (
                    <TableRow key={tx.id}>
                      <TableCell className="font-mono">#{tx.id}</TableCell>
                      <TableCell className="font-mono">{tx.beneficiary}</TableCell>
                      <TableCell>{tx.amount} 元</TableCell>
                      <TableCell>
                        <Badge variant="secondary">待发货</Badge>
                      </TableCell>
                      <TableCell>
                        <Button 
                          size="sm"
                          onClick={() => handleSubmitProof(tx.id)}
                        >
                          提交凭证
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>

            <Card className="p-6 bg-muted border-none">
              <h3 className="font-semibold mb-4">发货凭证要求</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• 提供清晰的发货照片或物流单号</li>
                <li>• 将凭证哈希值提交到区块链</li>
                <li>• 确保商品质量符合标准</li>
                <li>• 凭证经审计验证后自动完成支付</li>
              </ul>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Merchant;
