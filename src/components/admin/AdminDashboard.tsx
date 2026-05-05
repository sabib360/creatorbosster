import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import { 
  Users, 
  TrendingUp, 
  DollarSign, 
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  User
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '../ui/table';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '../ui/dropdown-menu';
import { collection, query, orderBy, limit, onSnapshot, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { cn } from '../../lib/utils';
import Analytics from './Analytics';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalRevenue: 0,
    activeSubscriptions: 0,
    creditsUsed: 0,
    userGrowth: 12,
    revenueGrowth: 8
  });
  const [recentUsers, setRecentUsers] = useState<any[]>([]);
  const [recentPayments, setRecentPayments] = useState<any[]>([]);

  useEffect(() => {
    // Fetch stats
    const fetchStats = async () => {
      const usersSnap = await getDocs(collection(db, 'users'));
      const paymentsSnap = await getDocs(collection(db, 'payments'));
      
      const successfulPayments = paymentsSnap.docs.filter(doc => doc.data().status === 'success');
      const totalRevenue = successfulPayments.reduce((acc, doc) => acc + (doc.data().amount || 0), 0);
      
      setStats(prev => ({
        ...prev,
        totalUsers: usersSnap.size,
        totalRevenue: totalRevenue,
        activeSubscriptions: usersSnap.docs.filter(doc => doc.data().plan_id !== 'free').length
      }));
    };

    fetchStats();

    // Real-time recent users
    const usersQuery = query(collection(db, 'users'), limit(5));
    const unsubUsers = onSnapshot(usersQuery, (snap) => {
      setRecentUsers(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    // Real-time recent payments
    const paymentsQuery = query(collection(db, 'payments'), orderBy('createdAt', 'desc'), limit(5));
    const unsubPayments = onSnapshot(paymentsQuery, (snap) => {
      setRecentPayments(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => {
      unsubUsers();
      unsubPayments();
    };
  }, []);

  const renderOverview = () => (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Users" 
          value={stats.totalUsers.toLocaleString()} 
          icon={Users} 
          trend={stats.userGrowth} 
          trendType="up"
        />
        <StatCard 
          title="Total Revenue" 
          value={`৳${stats.totalRevenue.toLocaleString()}`} 
          icon={DollarSign} 
          trend={stats.revenueGrowth} 
          trendType="up"
        />
        <StatCard 
          title="Active Subs" 
          value={stats.activeSubscriptions.toLocaleString()} 
          icon={TrendingUp} 
          trend={5} 
          trendType="up"
        />
        <StatCard 
          title="Credits Used" 
          value="12,450" 
          icon={Zap} 
          trend={2} 
          trendType="down"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Users */}
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-white">Recent Users</CardTitle>
              <CardDescription className="text-slate-400">New creators joining the platform</CardDescription>
            </div>
            <Button variant="outline" size="sm" className="border-slate-700 hover:bg-slate-800" onClick={() => setActiveTab('users')}>
              View All
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-slate-800 hover:bg-transparent">
                  <TableHead className="text-slate-400">User</TableHead>
                  <TableHead className="text-slate-400">Plan</TableHead>
                  <TableHead className="text-slate-400 text-right">Credits</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentUsers.map((user) => (
                  <TableRow key={user.id} className="border-slate-800 hover:bg-slate-800/50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center overflow-hidden">
                          {user.photoURL ? (
                            <img src={user.photoURL} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          ) : (
                            <Users className="w-4 h-4 text-slate-500" />
                          )}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-white">{user.displayName}</span>
                          <span className="text-xs text-slate-500">{user.email}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn(
                        "capitalize",
                        user.plan_id === 'free' ? "border-slate-700 text-slate-400" : "border-primary/50 text-primary"
                      )}>
                        {user.plan_id}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-mono text-slate-300">
                      Unlimited
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Recent Payments */}
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-white">Recent Payments</CardTitle>
              <CardDescription className="text-slate-400">Latest subscription transactions</CardDescription>
            </div>
            <Button variant="outline" size="sm" className="border-slate-700 hover:bg-slate-800" onClick={() => setActiveTab('payments')}>
              View All
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-slate-800 hover:bg-transparent">
                  <TableHead className="text-slate-400">Amount</TableHead>
                  <TableHead className="text-slate-400">Status</TableHead>
                  <TableHead className="text-slate-400 text-right">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentPayments.map((payment) => (
                  <TableRow key={payment.id} className="border-slate-800 hover:bg-slate-800/50">
                    <TableCell className="font-bold text-white">
                      ৳{payment.amount}
                    </TableCell>
                    <TableCell>
                      <Badge className={cn(
                        "capitalize",
                        payment.status === 'success' ? "bg-green-500/10 text-green-500" : "bg-yellow-500/10 text-yellow-500"
                      )}>
                        {payment.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right text-slate-500 text-xs">
                      {payment.createdAt?.toDate ? payment.createdAt.toDate().toLocaleDateString() : 'Pending'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  return (
    <AdminLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      {activeTab === 'overview' && renderOverview()}
      {activeTab === 'users' && <UsersManagement />}
      {activeTab === 'payments' && <PaymentsManagement />}
      {activeTab === 'analytics' && <Analytics />}
    </AdminLayout>
  );
}

function StatCard({ title, value, icon: Icon, trend, trendType }: any) {
  return (
    <Card className="bg-slate-900/50 border-slate-800 hover:border-slate-700 transition-all group">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="p-2 rounded-lg bg-slate-800 group-hover:bg-primary/20 transition-colors">
            <Icon className="w-5 h-5 text-slate-400 group-hover:text-primary transition-colors" />
          </div>
          <div className={cn(
            "flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full",
            trendType === 'up' ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
          )}>
            {trendType === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            {trend}%
          </div>
        </div>
        <div>
          <p className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-1">{title}</p>
          <h3 className="text-3xl font-display font-black text-white">{value}</h3>
        </div>
      </CardContent>
    </Card>
  );
}

function UsersManagement() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'users'), (snap) => {
      setUsers(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const handleUpdateCredits = async (userId: string, amount: number) => {
    try {
      const response = await fetch('/api/admin/update-credits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, amount })
      });
      if (!response.ok) throw new Error('Failed to update credits');
    } catch (error) {
      console.error(error);
      alert('Failed to update credits');
    }
  };

  const handleUpdatePlan = async (userId: string, planId: string) => {
    try {
      const response = await fetch('/api/admin/update-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, planId })
      });
      if (!response.ok) throw new Error('Failed to update plan');
    } catch (error) {
      console.error(error);
      alert('Failed to update plan');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-display font-black text-white uppercase tracking-tight">User Management</h2>
          <p className="text-slate-400">Manage creator accounts, credits, and subscriptions.</p>
        </div>
        <Button className="bg-primary text-black font-bold">Export CSV</Button>
      </div>

      <Card className="bg-slate-900/50 border-slate-800">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-800 hover:bg-transparent">
                <TableHead className="text-slate-400">User</TableHead>
                <TableHead className="text-slate-400">Plan</TableHead>
                <TableHead className="text-slate-400">Credits</TableHead>
                <TableHead className="text-slate-400">Status</TableHead>
                <TableHead className="text-slate-400 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id} className="border-slate-800 hover:bg-slate-800/50">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center overflow-hidden">
                        {user.photoURL ? (
                          <img src={user.photoURL} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        ) : (
                          <User className="w-5 h-5 text-slate-500" />
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-white">{user.displayName}</span>
                        <span className="text-xs text-slate-500">{user.email}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <Button variant="ghost" className="h-8 px-2 hover:bg-slate-800">
                          <Badge className={cn(
                            "capitalize",
                            user.plan_id === 'free' ? "bg-slate-800 text-slate-400" : "bg-primary/10 text-primary"
                          )}>
                            {user.plan_id}
                          </Badge>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="bg-slate-900 border-slate-800 text-slate-200">
                        <DropdownMenuLabel>Change Plan</DropdownMenuLabel>
                        <DropdownMenuSeparator className="bg-slate-800" />
                        <DropdownMenuItem onClick={() => handleUpdatePlan(user.id, 'free')}>Free</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleUpdatePlan(user.id, 'premium')}>Premium</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleUpdatePlan(user.id, 'pro')}>Pro</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleUpdatePlan(user.id, 'agency')}>Agency</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                  <TableCell className="font-mono text-slate-300">
                    Unlimited
                  </TableCell>
                  <TableCell>
                    <Badge className="bg-green-500/10 text-green-500">Active</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
                          <MoreHorizontal className="w-5 h-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-slate-900 border-slate-800 text-slate-200">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator className="bg-slate-800" />
                        <DropdownMenuItem onClick={() => handleUpdateCredits(user.id, 50)}>Add 50 Credits</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleUpdateCredits(user.id, 100)}>Add 100 Credits</DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-slate-800" />
                        <DropdownMenuItem className="text-red-400">Suspend Account</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function PaymentsManagement() {
  const [payments, setPayments] = useState<any[]>([]);

  useEffect(() => {
    const unsub = onSnapshot(query(collection(db, 'payments'), orderBy('createdAt', 'desc')), (snap) => {
      setPayments(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsub();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-display font-black text-white uppercase tracking-tight">Payment Logs</h2>
        <p className="text-slate-400">Monitor all transactions and subscription payments.</p>
      </div>

      <Card className="bg-slate-900/50 border-slate-800">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-800 hover:bg-transparent">
                <TableHead className="text-slate-400">Transaction ID</TableHead>
                <TableHead className="text-slate-400">User ID</TableHead>
                <TableHead className="text-slate-400">Amount</TableHead>
                <TableHead className="text-slate-400">Method</TableHead>
                <TableHead className="text-slate-400">Status</TableHead>
                <TableHead className="text-slate-400 text-right">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((p) => (
                <TableRow key={p.id} className="border-slate-800 hover:bg-slate-800/50">
                  <TableCell className="font-mono text-xs text-slate-400">{p.tran_id}</TableCell>
                  <TableCell className="font-mono text-xs text-slate-500">{p.userId}</TableCell>
                  <TableCell className="font-bold text-white">৳{p.amount}</TableCell>
                  <TableCell className="capitalize text-slate-300">{p.method}</TableCell>
                  <TableCell>
                    <Badge className={cn(
                      "capitalize",
                      p.status === 'success' ? "bg-green-500/10 text-green-500" : "bg-yellow-500/10 text-yellow-500"
                    )}>
                      {p.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right text-slate-500 text-xs">
                    {p.createdAt?.toDate ? p.createdAt.toDate().toLocaleString() : 'Pending'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}


