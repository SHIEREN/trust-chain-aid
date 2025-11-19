import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Shield, CheckCircle, Gift } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const NGO = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const pendingBeneficiaries = [
    { address: "0x1234...5678", identityHash: "0xabcd...efgh", status: "pending" },
    { address: "0x8765...4321", identityHash: "0xhgfe...dcba", status: "pending" },
  ];

  const pendingMerchants = [
    { address: "0x9999...8888", businessName: "爱心超市", status: "pending" },
    { address: "0x7777...6666", businessName: "母婴用品店", status: "pending" },
  ];

  const handleVerify = (address: string) => {
    toast({
      title: "验证成功",
      description: `已验证受助人 ${address}`,
    });
  };

  const handleApproveMerchant = (address: string) => {
    toast({
      title: "批准成功",
      description: `已批准商户 ${address}`,
    });
  };

  const handleIssueVoucher = () => {
    toast({
      title: "发放成功",
      description: "代金券已发放",
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

        <div className="bg-gradient-trust rounded-2xl p-8 mb-8 shadow-soft">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">NGO 管理面板</h1>
              <p className="text-white/90">审核身份，签发代金券，维护隐私</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 shadow-card">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">23</div>
              <div className="text-muted-foreground">待验证受助人</div>
            </div>
          </Card>
          <Card className="p-6 shadow-card">
            <div className="text-center">
              <div className="text-3xl font-bold text-secondary mb-2">8</div>
              <div className="text-muted-foreground">待批准商户</div>
            </div>
          </Card>
          <Card className="p-6 shadow-card">
            <div className="text-center">
              <div className="text-3xl font-bold text-accent mb-2">156</div>
              <div className="text-muted-foreground">已发放代金券</div>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6 shadow-card">
            <div className="flex items-center gap-3 mb-6">
              <CheckCircle className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold">待验证受助人</h2>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>钱包地址</TableHead>
                  <TableHead>身份哈希</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingBeneficiaries.map((beneficiary) => (
                  <TableRow key={beneficiary.address}>
                    <TableCell className="font-mono">{beneficiary.address}</TableCell>
                    <TableCell className="font-mono text-sm">{beneficiary.identityHash}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">待验证</Badge>
                    </TableCell>
                    <TableCell>
                      <Button 
                        size="sm"
                        onClick={() => handleVerify(beneficiary.address)}
                      >
                        验证通过
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>

          <Card className="p-6 shadow-card">
            <div className="flex items-center gap-3 mb-6">
              <Gift className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold">发放代金券</h2>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input placeholder="受助人地址" />
                <Input placeholder="金额" type="number" />
              </div>
              <Button 
                className="w-full bg-gradient-success"
                onClick={handleIssueVoucher}
              >
                发放代金券
              </Button>
            </div>
          </Card>

          <Card className="p-6 shadow-card">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold">待批准商户</h2>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>钱包地址</TableHead>
                  <TableHead>商户名称</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingMerchants.map((merchant) => (
                  <TableRow key={merchant.address}>
                    <TableCell className="font-mono">{merchant.address}</TableCell>
                    <TableCell>{merchant.businessName}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">待批准</Badge>
                    </TableCell>
                    <TableCell>
                      <Button 
                        size="sm"
                        onClick={() => handleApproveMerchant(merchant.address)}
                      >
                        批准
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default NGO;
