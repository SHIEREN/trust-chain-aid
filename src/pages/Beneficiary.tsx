import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Users, CheckCircle, Gift } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

const Beneficiary = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [identityHash, setIdentityHash] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const handleRegister = () => {
    if (!identityHash) {
      toast({
        title: "请输入身份哈希",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "注册成功！",
      description: "请等待NGO验证您的身份",
    });
    setIsRegistered(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          返回首页
        </Button>

        <div className="bg-gradient-success rounded-2xl p-8 mb-8 shadow-soft">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
              <Users className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">受助人面板</h1>
              <p className="text-white/90">验证身份并领取援助凭证</p>
            </div>
          </div>
        </div>

        {!isRegistered ? (
          <Card className="p-8 shadow-card">
            <h2 className="text-2xl font-bold mb-6">身份注册</h2>
            
            <div className="space-y-6">
              <div>
                <Label htmlFor="identityHash">身份信息哈希</Label>
                <Input
                  id="identityHash"
                  placeholder="0x..."
                  value={identityHash}
                  onChange={(e) => setIdentityHash(e.target.value)}
                  className="mt-2"
                />
                <p className="text-sm text-muted-foreground mt-2">
                  请线下联系NGO获取您的身份信息哈希值
                </p>
              </div>

              <div className="bg-muted p-4 rounded-lg">
                <h3 className="font-semibold mb-2">隐私保护机制</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• 您的真实身份信息不会上传到区块链</li>
                  <li>• 仅存储身份信息的哈希值用于验证</li>
                  <li>• NGO负责线下核实您的真实身份</li>
                  <li>• 验证通过后您将获得代金券</li>
                </ul>
              </div>

              <Button 
                className="w-full bg-gradient-success"
                size="lg"
                onClick={handleRegister}
              >
                提交注册
              </Button>
            </div>
          </Card>
        ) : (
          <div className="space-y-6">
            <Card className="p-6 shadow-card">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold mb-2">验证状态</h3>
                  <Badge variant={isVerified ? "default" : "secondary"} className="bg-gradient-success">
                    {isVerified ? "已验证" : "待验证"}
                  </Badge>
                </div>
                {isVerified && (
                  <CheckCircle className="w-12 h-12 text-accent" />
                )}
              </div>
            </Card>

            <Card className="p-8 shadow-card">
              <div className="flex items-center gap-3 mb-6">
                <Gift className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold">我的代金券</h2>
              </div>

              <div className="bg-gradient-warm rounded-lg p-6 mb-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-white mb-2">
                    {isVerified ? "500" : "0"} 元
                  </div>
                  <div className="text-white/90">可用余额</div>
                </div>
              </div>

              {!isVerified && (
                <div className="bg-muted p-4 rounded-lg text-center">
                  <p className="text-muted-foreground">
                    请等待NGO验证您的身份后，即可领取代金券
                  </p>
                </div>
              )}

              {isVerified && (
                <div className="space-y-4">
                  <h3 className="font-semibold">使用说明</h3>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li>• 代金券可在授权商户处使用</li>
                    <li>• 购买物资后需提交购买凭证</li>
                    <li>• 商户提交发货凭证后自动完成支付</li>
                    <li>• 所有交易记录链上可查</li>
                  </ul>
                  <Button className="w-full" onClick={() => navigate('/merchant')}>
                    查看授权商户
                  </Button>
                </div>
              )}
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Beneficiary;
