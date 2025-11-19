import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Heart, Shield, Users, Store, Search } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  const roles = [
    {
      id: "donor",
      title: "捐助人 Donor",
      description: "进行加密捐赠，支持慈善事业",
      icon: Heart,
      gradient: "bg-gradient-warm",
      path: "/donor"
    },
    {
      id: "beneficiary",
      title: "受助人 Beneficiary",
      description: "验证身份并领取援助凭证",
      icon: Users,
      gradient: "bg-gradient-success",
      path: "/beneficiary"
    },
    {
      id: "ngo",
      title: "NGO 机构",
      description: "审核身份，签发代金券，维护隐私",
      icon: Shield,
      gradient: "bg-gradient-trust",
      path: "/ngo"
    },
    {
      id: "merchant",
      title: "商户 Merchant",
      description: "提供物资，提交发货凭证",
      icon: Store,
      gradient: "bg-gradient-warm",
      path: "/merchant"
    },
    {
      id: "auditor",
      title: "审计员 Auditor",
      description: "验证交易，发起异常挑战",
      icon: Search,
      gradient: "bg-gradient-trust",
      path: "/auditor"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-warm py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            隐私保护的女性慈善平台
          </h1>
          <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
            基于区块链的透明、安全、隐私保护的多方协作慈善捐助系统
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-primary hover:bg-white/90 shadow-soft"
              onClick={() => navigate('/donor')}
            >
              立即捐助
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white/10"
              onClick={() => window.open('https://github.com/SHIEREN/trust-chain-aid/blob/main/contracts/CharityPlatform.sol', '_blank')}
            >
              查看合约
            </Button>
          </div>
        </div>
      </div>

      {/* Roles Section */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">选择您的角色</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            本平台支持5种角色参与，每个角色都有独特的功能和责任
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {roles.map((role) => {
            const Icon = role.icon;
            return (
              <Card 
                key={role.id}
                className="group hover:shadow-soft transition-all duration-300 cursor-pointer overflow-hidden"
                onClick={() => navigate(role.path)}
              >
                <div className={`${role.gradient} p-6 transition-all duration-300`}>
                  <div className="bg-white/20 backdrop-blur-sm rounded-full w-16 h-16 flex items-center justify-center mb-4">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {role.title}
                  </h3>
                  <p className="text-white/90">
                    {role.description}
                  </p>
                </div>
                <div className="p-6">
                  <Button 
                    className="w-full group-hover:shadow-soft transition-all"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(role.path);
                    }}
                  >
                    进入
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-muted py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">平台特性</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-gradient-warm w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">隐私保护</h3>
              <p className="text-muted-foreground">
                使用哈希加密保护受助人身份信息，确保隐私安全
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-gradient-trust w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">透明审计</h3>
              <p className="text-muted-foreground">
                区块链记录所有交易，审计员可验证并挑战异常
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-gradient-success w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">智能合约</h3>
              <p className="text-muted-foreground">
                自动执行规则，确保资金安全与流程透明
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-8 px-4 text-center text-muted-foreground">
        <p>基于 Solidity + React + TypeScript 构建</p>
        <p className="mt-2">部署到以太坊测试网络进行演示</p>
      </footer>
    </div>
  );
};

export default Index;
