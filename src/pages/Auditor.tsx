import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Search, AlertTriangle, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const Auditor = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const transactions = [
    { 
      id: "1", 
      beneficiary: "0x1234...5678", 
      merchant: "0x9999...8888",
      amount: "200", 
      status: "completed",
      suspicious: false 
    },
    { 
      id: "2", 
      beneficiary: "0x8765...4321", 
      merchant: "0x7777...6666",
      amount: "950", 
      status: "pending",
      suspicious: true 
    },
    { 
      id: "3", 
      beneficiary: "0x1111...2222", 
      merchant: "0x9999...8888",
      amount: "350", 
      status: "completed",
      suspicious: false 
    },
  ];

  const handleChallenge = (txId: string) => {
    toast({
      title: "挑战成功",
      description: `交易 #${txId} 已被标记为异常`,
      variant: "destructive"
    });
  };

  const handleApprove = (txId: string) => {
    toast({
      title: "验证通过",
      description: `交易 #${txId} 验证通过`,
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
              <Search className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">审计员面板</h1>
              <p className="text-white/90">验证交易，发起异常挑战</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 shadow-card">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">156</div>
              <div className="text-muted-foreground">总交易数</div>
            </div>
          </Card>
          <Card className="p-6 shadow-card">
            <div className="text-center">
              <div className="text-3xl font-bold text-accent mb-2">148</div>
              <div className="text-muted-foreground">验证通过</div>
            </div>
          </Card>
          <Card className="p-6 shadow-card">
            <div className="text-center">
              <div className="text-3xl font-bold text-destructive mb-2">5</div>
              <div className="text-muted-foreground">异常交易</div>
            </div>
          </Card>
          <Card className="p-6 shadow-card">
            <div className="text-center">
              <div className="text-3xl font-bold text-secondary mb-2">3</div>
              <div className="text-muted-foreground">待审核</div>
            </div>
          </Card>
        </div>

        <Card className="p-6 shadow-card mb-6">
          <div className="flex items-center gap-3 mb-6">
            <Search className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold">交易监控</h2>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>交易ID</TableHead>
                <TableHead>受助人</TableHead>
                <TableHead>商户</TableHead>
                <TableHead>金额</TableHead>
                <TableHead>状态</TableHead>
                <TableHead>风险</TableHead>
                <TableHead>操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((tx) => (
                <TableRow key={tx.id}>
                  <TableCell className="font-mono">#{tx.id}</TableCell>
                  <TableCell className="font-mono text-sm">{tx.beneficiary}</TableCell>
                  <TableCell className="font-mono text-sm">{tx.merchant}</TableCell>
                  <TableCell>{tx.amount} 元</TableCell>
                  <TableCell>
                    <Badge variant={tx.status === "completed" ? "default" : "secondary"}>
                      {tx.status === "completed" ? "已完成" : "待处理"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {tx.suspicious ? (
                      <Badge variant="destructive" className="gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        可疑
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="gap-1">
                        <CheckCircle className="w-3 h-3" />
                        正常
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {tx.suspicious ? (
                        <Button 
                          size="sm"
                          variant="destructive"
                          onClick={() => handleChallenge(tx.id)}
                        >
                          挑战
                        </Button>
                      ) : (
                        <Button 
                          size="sm"
                          variant="outline"
                          onClick={() => handleApprove(tx.id)}
                        >
                          通过
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>

        <Card className="p-6 bg-muted border-none">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="w-6 h-6 text-destructive" />
            <h3 className="font-semibold">异常检测规则</h3>
          </div>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• 单笔交易金额异常高于平均水平</li>
            <li>• 同一受助人短时间内多笔交易</li>
            <li>• 商户发货凭证不完整或可疑</li>
            <li>• 受助人与商户之间可能存在关联</li>
            <li>• 交易时间模式异常</li>
          </ul>
        </Card>
      </div>
    </div>
  );
};

export default Auditor;
