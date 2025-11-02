import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link, useLocation } from "wouter";
import { ShoppingBag, Clock, CheckCircle, Package, Calendar } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { format, isToday, isYesterday, isThisWeek, startOfWeek } from "date-fns";

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

interface Order {
  id: string;
  items: OrderItem[];
  customerInfo: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    notes?: string;
  };
  userId: string | null;
  isGuest: boolean;
  subtotal: number;
  tax: number;
  total: number;
  status: string;
  createdAt: any;
}

export default function OrderHistory() {
  const { userData, loading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!loading && !userData) {
      setLocation("/login");
      return;
    }

    if (userData && userData.role === "customer") {
      fetchOrders();
    }
  }, [userData, loading]);

  const fetchOrders = async () => {
    if (!userData) return;

    try {
      const ordersRef = collection(db, "orders");
      const q = query(
        ordersRef,
        where("userId", "==", userData.uid)
      );

      const querySnapshot = await getDocs(q);
      const fetchedOrders: Order[] = [];

      querySnapshot.forEach((doc) => {
        fetchedOrders.push({
          id: doc.id,
          ...doc.data(),
        } as Order);
      });

      fetchedOrders.sort((a, b) => {
        const aTime = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
        const bTime = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
        return bTime - aTime;
      });

      console.log("Fetched orders:", fetchedOrders.length);
      setOrders(fetchedOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      console.error("Error details:", JSON.stringify(error, null, 2));
    } finally {
      setIsLoading(false);
    }
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg text-muted-foreground">Loading your orders...</div>
        </div>
      </div>
    );
  }

  if (!userData || userData.role !== "customer") {
    return null;
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "confirmed":
        return <CheckCircle className="w-4 h-4" />;
      case "delivered":
        return <Package className="w-4 h-4" />;
      default:
        return <ShoppingBag className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const groupOrdersByDate = () => {
    const today: Order[] = [];
    const yesterday: Order[] = [];
    const thisWeek: Order[] = [];
    const earlier: Order[] = [];

    orders.forEach((order) => {
      if (!order.createdAt?.toDate) {
        earlier.push(order);
        return;
      }

      const orderDate = order.createdAt.toDate();
      
      if (isToday(orderDate)) {
        today.push(order);
      } else if (isYesterday(orderDate)) {
        yesterday.push(order);
      } else if (isThisWeek(orderDate, { weekStartsOn: 0 })) {
        thisWeek.push(order);
      } else {
        earlier.push(order);
      }
    });

    return { today, yesterday, thisWeek, earlier };
  };

  const { today, yesterday, thisWeek, earlier } = groupOrdersByDate();

  const renderOrderCard = (order: Order) => (
    <Card key={order.id} className="border-[#D4AF37]/20" data-testid={`order-${order.id}`}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="font-serif flex items-center gap-2 mb-2">
              Order #{order.id.slice(0, 8).toUpperCase()}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {order.createdAt?.toDate ? format(order.createdAt.toDate(), "PPP 'at' p") : "Recently placed"}
            </p>
          </div>
          <Badge className={`${getStatusColor(order.status)} flex items-center gap-1`}>
            {getStatusIcon(order.status)}
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Order Items */}
          <div className="space-y-3">
            {order.items.map((item, index) => (
              <div key={index} className="flex gap-3">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded"
                />
                <div className="flex-1">
                  <h4 className="font-serif font-semibold">{item.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    Quantity: {item.quantity}
                  </p>
                  <p className="text-sm font-semibold text-[#D4AF37]">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Delivery Info */}
          <div className="border-t pt-4">
            <h4 className="font-semibold mb-2">Delivery Information</h4>
            <p className="text-sm text-muted-foreground">
              <strong>Name:</strong> {order.customerInfo.fullName}
            </p>
            <p className="text-sm text-muted-foreground">
              <strong>Address:</strong> {order.customerInfo.address}
            </p>
            <p className="text-sm text-muted-foreground">
              <strong>Phone:</strong> {order.customerInfo.phone}
            </p>
          </div>

          {/* Order Total */}
          <div className="border-t pt-4 flex justify-between items-center">
            <span className="font-semibold">Order Total</span>
            <span className="text-xl font-bold text-[#D4AF37]" data-testid={`total-${order.id}`}>
              ${order.total.toFixed(2)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAF7F2] to-white py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-serif font-bold mb-2">Order History</h1>
          <p className="text-muted-foreground">
            View and track all your previous orders
          </p>
        </div>

        {orders.length === 0 ? (
          <Card className="border-[#D4AF37]/20">
            <CardContent className="py-12 text-center">
              <div className="flex justify-center mb-6">
                <div className="p-8 rounded-full bg-muted/50">
                  <ShoppingBag className="w-16 h-16 text-muted-foreground" />
                </div>
              </div>
              <h2 className="text-2xl font-serif font-bold mb-4">No Orders Yet</h2>
              <p className="text-muted-foreground mb-8">
                You haven't placed any orders. Browse our menu and order your favorite dishes!
              </p>
              <Link href="/menu">
                <Button className="bg-[#D4AF37] hover:bg-[#D4AF37]/90 text-white">
                  Browse Menu
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-5 mb-6" data-testid="tabs-order-filter">
              <TabsTrigger value="all" data-testid="tab-all">
                All ({orders.length})
              </TabsTrigger>
              <TabsTrigger value="today" data-testid="tab-today">
                Today ({today.length})
              </TabsTrigger>
              <TabsTrigger value="yesterday" data-testid="tab-yesterday">
                Yesterday ({yesterday.length})
              </TabsTrigger>
              <TabsTrigger value="thisWeek" data-testid="tab-week">
                This Week ({thisWeek.length})
              </TabsTrigger>
              <TabsTrigger value="earlier" data-testid="tab-earlier">
                Earlier ({earlier.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-6">
              {orders.map((order) => renderOrderCard(order))}
            </TabsContent>

            <TabsContent value="today" className="space-y-6">
              {today.length === 0 ? (
                <Card className="border-[#D4AF37]/20">
                  <CardContent className="py-12 text-center">
                    <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No orders placed today</p>
                  </CardContent>
                </Card>
              ) : (
                today.map((order) => renderOrderCard(order))
              )}
            </TabsContent>

            <TabsContent value="yesterday" className="space-y-6">
              {yesterday.length === 0 ? (
                <Card className="border-[#D4AF37]/20">
                  <CardContent className="py-12 text-center">
                    <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No orders placed yesterday</p>
                  </CardContent>
                </Card>
              ) : (
                yesterday.map((order) => renderOrderCard(order))
              )}
            </TabsContent>

            <TabsContent value="thisWeek" className="space-y-6">
              {thisWeek.length === 0 ? (
                <Card className="border-[#D4AF37]/20">
                  <CardContent className="py-12 text-center">
                    <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No orders placed this week</p>
                  </CardContent>
                </Card>
              ) : (
                thisWeek.map((order) => renderOrderCard(order))
              )}
            </TabsContent>

            <TabsContent value="earlier" className="space-y-6">
              {earlier.length === 0 ? (
                <Card className="border-[#D4AF37]/20">
                  <CardContent className="py-12 text-center">
                    <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No earlier orders</p>
                  </CardContent>
                </Card>
              ) : (
                earlier.map((order) => renderOrderCard(order))
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}
