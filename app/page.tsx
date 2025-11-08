"use client";
import { useState } from "react";
import { ProductCard } from "@/components/product-card";
import { products, inyectorProducts, moduleProducts, modsProducts, codmProducts } from "@/lib/products";
import type { Product } from "@/lib/products";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { ShoppingCart, User, X, ShieldCheck, Youtube, Send, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useAuth, useUser } from "@/firebase";
import { signInAnonymously } from "firebase/auth";

// Custom Icon for TikTok
const TikTokIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M16.5 5.5c-3.3 0-6 2.7-6 6v8.5a2.5 2.5 0 1 0 5 0V14c0-2.2 1.8-4 4-4s4 1.8 4 4v.5a2.5 2.5 0 1 0-5 0V14c0-.8-.7-1.5-1.5-1.5S16.5 12.7 16.5 14V5.5z" />
  </svg>
);


export default function Home() {
  const [cart, setCart] = useState<Product[]>([]);
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { toast } = useToast();
  const [activeGame, setActiveGame] = useState<string | null>(null);

  const addToCart = (product: Product) => {
    if (product.id === 'injector-elite-personal' || product.id === 'set-ultra-elit') {
      toast({
        title: "Producto no disponible",
        description: "Este producto estará disponible pronto.",
      });
      return;
    }
    if (!user) {
      setIsAuthOpen(true);
      return;
    }
    setCart((prevCart) => [...prevCart, product]);
    toast({
      title: "Producto añadido",
      description: `${product.name} ha sido añadido al carrito.`,
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string) => {
    setCart((prevCart) => {
        const foundIndex = prevCart.findIndex(p => p.id === productId);
        if (foundIndex > -1) {
            const newCart = [...prevCart];
            newCart.splice(foundIndex, 1);
            return newCart;
        }
        return prevCart;
    });
  };

  const total = cart.reduce((acc, product) => acc + product.price, 0);

  const handleLogin = async () => {
    try {
        await signInAnonymously(auth);
        setIsAuthOpen(false);
        toast({
            title: `¡Bienvenido!`,
            description: "Ahora puedes añadir productos al carrito.",
        });
    } catch (error) {
        console.error("Anonymous sign-in failed", error);
        toast({
            variant: "destructive",
            title: "Error de autenticación",
            description: "No se pudo iniciar sesión. Inténtalo de nuevo.",
        });
    }
  };
  
  const telegramMessage = `Hola, estoy interesado en adquirir los siguientes productos:\n${cart.map(p => `- ${p.name}`).join('\n')}\nTotal: $${total.toFixed(2)}\n\nMis datos:\nID de Usuario: ${user?.uid}`;
  const telegramUrl = `https://t.me/IamBiird?text=${encodeURIComponent(telegramMessage)}`;

  return (
    <main className="flex min-h-screen flex-col items-center bg-background text-foreground">
      <div className="container mx-auto px-4 py-12 md:py-24">
        <header className="text-center mb-12">
          <div className="flex justify-center items-center gap-3">
            <h1 className="text-5xl md:text-7xl font-bold font-headline tracking-tighter bg-gradient-to-r from-yellow-400 via-yellow-600 to-yellow-400 bg-clip-text text-transparent animated-gold notranslate">
              IamBird Shop
            </h1>
            <ShieldCheck className="h-10 w-10 md:h-12 md:w-12 text-yellow-500 animated-gold-icon" />
          </div>
          <div className="absolute top-4 right-4 flex items-center gap-4">
            {isUserLoading ? (
              <div className="text-sm text-muted-foreground">Cargando...</div>
            ) : user ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="h-5 w-5"/>
                <span className="notranslate truncate max-w-20" title={user.uid}>Usuario: {user.uid.substring(0, 6)}...</span>
                <Button variant="ghost" size="icon" onClick={() => setIsCartOpen(true)}>
                  <ShoppingCart className="h-5 w-5" />
                  {cart.length > 0 && <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">{cart.length}</span>}
                </Button>
              </div>
            ) : (
              <Button onClick={() => setIsAuthOpen(true)}>Iniciar Sesión</Button>
            )}
          </div>
        </header>

        <Tabs defaultValue="archivos" className="w-full">
           <ScrollArea className="w-full whitespace-nowrap rounded-md">
            <TabsList className="grid w-full grid-cols-5 bg-card/70 backdrop-blur-sm mb-8 md:grid-cols-5">
                <TabsTrigger
                value="archivos"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600 data-[state=active]:via-black data-[state=active]:to-red-600 data-[state=active]:text-white data-[state=active]:animated-background"
                >
                Archivos
                </TabsTrigger>
                <TabsTrigger
                value="modulos"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600 data-[state=active]:via-black data-[state=active]:to-red-600 data-[state=active]:text-white data-[state=active]:animated-background"
                >
                TypeScript
                </TabsTrigger>
                <TabsTrigger
                value="inyector"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600 data-[state=active]:via-black data-[state=active]:to-red-600 data-[state=active]:text-white data-[state=active]:animated-background"
                >
                Inyector
                </TabsTrigger>
                <TabsTrigger
                value="mods"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600 data-[state=active]:via-black data-[state=active]:to-red-600 data-[state=active]:text-white data-[state=active]:animated-background"
                >
                MODS
                </TabsTrigger>
                <TabsTrigger
                value="otros-juegos"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600 data-[state=active]:via-black data-[state=active]:to-red-600 data-[state=active]:text-white data-[state=active]:animated-background"
                >
                Otros juegos
                </TabsTrigger>
            </TabsList>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
          <TabsContent value="archivos">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} productType="file" onAddToCart={addToCart} />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="modulos">
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {moduleProducts.map((product) => (
                <ProductCard key={product.id} product={product} productType="module" onAddToCart={addToCart}/>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="inyector">
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {inyectorProducts.map((product) => (
                <ProductCard key={product.id} product={product} productType="injector" onAddToCart={addToCart}/>
              ))}
            </div>
          </TabsContent>
           <TabsContent value="mods">
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {modsProducts.map((product) => (
                <ProductCard key={product.id} product={product} productType="module" onAddToCart={addToCart}/>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="otros-juegos">
            {activeGame === 'codm' ? (
                <div>
                    <Button onClick={() => setActiveGame(null)} variant="outline" className="mb-4">Volver</Button>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {codmProducts.map((product) => (
                            <ProductCard key={product.id} product={product} productType="codm" onAddToCart={addToCart} />
                        ))}
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center h-48 gap-4">
                    <p className="text-muted-foreground">Selecciona un juego para ver los productos disponibles.</p>
                    <Button onClick={() => setActiveGame('codm')}>CODM</Button>
                </div>
            )}
          </TabsContent>
        </Tabs>

        <footer className="text-center mt-16 pt-8 border-t border-border/20">
          <div className="flex justify-center items-center gap-2 mb-4">
              <Info className="h-5 w-5 text-muted-foreground" />
              <p className="text-sm text-muted-foreground notranslate">©Creador©byIamBird</p>
          </div>
          <div className="flex justify-center gap-6 mb-4">
            <Link href="https://youtube.com/@iambiird?si=GikejoyPsYmp_qq2" target="_blank" rel="noopener noreferrer">
              <Youtube className="h-6 w-6 text-muted-foreground hover:text-primary transition-colors" />
            </Link>
             <Link href="https://t.me/+ms9tmkM-PqAzMmIx" target="_blank" rel="noopener noreferrer">
               <Send className="h-6 w-6 text-muted-foreground hover:text-primary transition-colors" />
            </Link>
             <Link href="https://vt.tiktok.com/ZSyrTpVVG/" target="_blank" rel="noopener noreferrer">
              <TikTokIcon className="h-6 w-6 text-muted-foreground hover:text-primary transition-colors" />
            </Link>
          </div>
          <p className="text-xs text-muted-foreground">
            Browse our curated selection of products. Click "Adquiere Aquí" to
            contact us directly on Telegram.
          </p>
        </footer>
      </div>

      {/* Auth Modal */}
      <Dialog open={isAuthOpen} onOpenChange={setIsAuthOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Regístrate Primero</DialogTitle>
            <DialogDescription>
              Necesitas una cuenta para añadir productos y comprar. Haz clic en continuar para crear una cuenta de invitado.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Button onClick={handleLogin}>Continuar</Button>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Cart Sheet */}
      {isCartOpen && (
        <div className="fixed inset-0 bg-black/60 z-40" onClick={() => setIsCartOpen(false)} />
      )}
      <div className={`fixed top-0 right-0 h-full w-full max-w-sm bg-card z-50 transform transition-transform ${isCartOpen ? "translate-x-0" : "translate-x-full"} shadow-2xl flex flex-col`}>
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold">Carrito de Compras</h2>
          <Button variant="ghost" size="icon" onClick={() => setIsCartOpen(false)}><X/></Button>
        </div>
        {cart.length > 0 ? (
          <>
            <div className="flex-grow p-4 overflow-y-auto">
              {cart.map((item, index) => (
                <div key={`${item.id}-${index}`} className="flex items-center justify-between mb-4">
                  <div>
                    <p className="font-semibold notranslate">{item.name}</p>
                    <p className="text-sm text-muted-foreground">${item.price.toFixed(2)}</p>
                  </div>
                  <Button variant="destructive" size="icon" onClick={() => removeFromCart(item.id)}><X className="h-4 w-4"/></Button>
                </div>
              ))}
            </div>
            <div className="p-4 border-t">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-bold">Total:</span>
                <span className="text-lg font-bold">${total.toFixed(2)}</span>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="lg" className="w-full text-lg py-6 bg-gradient-to-r from-green-500 via-green-700 to-green-500 text-white font-bold animated-green">
                    Pagar
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Seleccionar Método de Pago</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <Button asChild variant="outline">
                      <Link
                        href="https://www.paypal.me/MORALESARREDONDO161"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Pagar con PayPal
                      </Link>
                    </Button>
                    <Dialog>
                       <DialogTrigger asChild>
                        <Button variant="outline">Transferencia Bancaria</Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md bg-gray-900 border-yellow-500">
                        <DialogHeader>
                          <DialogTitle className="text-yellow-400">Datos para Transferencia</DialogTitle>
                          <DialogDescription>
                            Realiza tu pago a cualquiera de las siguientes cuentas.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 text-gray-300 py-4">
                          <div>
                            <h3 className="font-bold text-yellow-500">Transferencia interbancaria (CLABE)</h3>
                            <p className="font-mono text-sm break-all">722969010524343131</p>
                            <p className="text-xs text-gray-400">Institución: Mercado pago W Mastercard</p>
                          </div>
                          <Separator className="bg-gray-700"/>
                          <div>
                             <h3 className="font-bold text-yellow-500">Transferencia interbancaria (CLABE)</h3>
                            <p className="font-mono text-sm break-all">646180401609832109</p>
                            <p className="text-xs text-gray-400">Institución: Openbank SPEI Santander</p>
                          </div>
                          <Separator className="bg-gray-700"/>
                           <div>
                            <h3 className="font-bold text-yellow-500">Con tarjeta 💳</h3>
                            <p className="font-mono text-sm break-all">5428785198079906</p>
                            <p className="text-xs text-gray-400">Banco: Mercado pago W Mastercard</p>
                          </div>
                           <Separator className="bg-gray-700"/>
                           <div>
                            <h3 className="font-bold text-yellow-500">Número de cuenta 🏦</h3>
                            <p className="font-mono text-sm break-all">4000983210</p>
                            <p className="text-xs text-gray-400">Banco: Santander, Institución: Openbank</p>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                     <Button asChild variant="outline">
                      <Link
                        href={telegramUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Otro Método de Pago
                      </Link>
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </>
        ) : (
           <div className="flex-grow flex items-center justify-center">
            <p className="text-muted-foreground">Tu carrito está vacío.</p>
          </div>
        )}
      </div>

    </main>
  );
}
