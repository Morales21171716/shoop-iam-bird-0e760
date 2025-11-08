
import Link from "next/link";
import { useState, useEffect } from "react";
import { CheckCircle2, ShoppingCart, Tag, X, Globe, PlusCircle, ShieldCheck } from "lucide-react";
import type { Product, ProductOption } from "@/lib/products";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Separator } from "./ui/separator";

type ProductCardProps = {
  product: Product;
  productType: 'file' | 'injector' | 'module' | 'codm';
  onAddToCart: (product: Product) => void;
};

const coupons: {
  [key: string]: { discount: number; type: "percentage" | "fixed" };
} = {
  // 10% OFF
  IAMBIRD10A: { discount: 0.1, type: "percentage" },
  IAMBIRD10B: { discount: 0.1, type: "percentage" },
  IAMBIRD10C: { discount: 0.1, type: "percentage" },
  IAMBIRD10D: { discount: 0.1, type: "percentage" },
  IAMBIRD10E: { discount: 0.1, type: "percentage" },
  IAMBIRD10F: { discount: 0.1, type: "percentage" },
  IAMBIRD10G: { discount: 0.1, type: "percentage" },
  IAMBIRD10H: { discount: 0.1, type: "percentage" },
  IAMBIRD10I: { discount: 0.1, type: "percentage" },
  IAMBIRD10J: { discount: 0.1, type: "percentage" },
  // 20% OFF
  IAMBIRD20_01: { discount: 0.2, type: "percentage" },
  IAMBIRD20_02: { discount: 0.2, type: "percentage" },
  IAMBIRD20_03: { discount: 0.2, type: "percentage" },
  IAMBIRD20_04: { discount: 0.2, type: "percentage" },
  IAMBIRD20_05: { discount: 0.2, type: "percentage" },
  IAMBIRD20_06: { discount: 0.2, type: "percentage" },
  IAMBIRD20_07: { discount: 0.2, type: "percentage" },
  IAMBIRD20_08: { discount: 0.2, type: "percentage" },
  IAMBIRD20_09: { discount: 0.2, type: "percentage" },
  IAMBIRD20_10: { discount: 0.2, type: "percentage" },
  // 30% OFF
  IAMBIRD30X1: { discount: 0.3, type: "percentage" },
  IAMBIRD30X2: { discount: 0.3, type: "percentage" },
  IAMBIRD30X3: { discount: 0.3, type: "percentage" },
  IAMBIRD30X4: { discount: 0.3, type: "percentage" },
  IAMBIRD30X5: { discount: 0.3, type: "percentage" },
  IAMBIRD30X6: { discount: 0.3, type: "percentage" },
  IAMBIRD30X7: { discount: 0.3, type: "percentage" },
  IAMBIRD30X8: { discount: 0.3, type: "percentage" },
  IAMBIRD30X9: { discount: 0.3, type: "percentage" },
  IAMBIRD30X0: { discount: 0.3, type: "percentage" },
  // 50% OFF
  IAMBIRDHALF1: { discount: 0.5, type: "percentage" },
  IAMBIRDHALF2: { discount: 0.5, type: "percentage" },
  IAMBIRDHALF3: { discount: 0.5, type: "percentage" },
  IAMBIRDHALF4: { discount: 0.5, type: "percentage" },
  IAMBIRDHALF5: { discount: 0.5, type: "percentage" },
};


// A simplified list of currencies for the user to choose from.
const currencies = [
    { code: 'USD', name: 'US Dollar' },
    { code: 'EUR', name: 'Euro' },
    { code: 'GBP', name: 'British Pound' },
    { code: 'JPY', name: 'Japanese Yen' },
    { code: 'CAD', name: 'Canadian Dollar' },
    { code: 'AUD', name: 'Australian Dollar' },
    { code: 'MXN', name: 'Mexican Peso' },
    { code: 'BRL', name: 'Brazilian Real' },
    { code: 'COP', name: 'Colombian Peso' },
    { code: 'AED', name: 'UAE Dirham' },
    { code: 'ALL', name: 'Albanian Lek' },
    { code: 'AMD', name: 'Armenian Dram' },
    { code: 'ANG', name: 'Netherlands Antillean Guilder' },
    { code: 'AOA', name: 'Angolan Kwanza' },
    { code: 'ARS', name: 'Argentine Peso' },
    { code: 'AWG', name: 'Aruban Florin' },
    { code: 'AZN', name: 'Azerbaijani Manat' },
    { code: 'BAM', name: 'Bosnia-Herzegovina Convertible Mark' },
    { code: 'BBD', name: 'Barbadian Dollar' },
    { code: 'BDT', name: 'Bangladeshi Taka' },
    { code: 'BGN', name: 'Bulgarian Lev' },
    { code: 'BHD', name: 'Bahraini Dinar' },
    { code: 'BMD', name: 'Bermudan Dollar' },
    { code: 'BND', name: 'Brunei Dollar' },
    { code: 'BOB', name: 'Bolivian Boliviano' },
    { code: 'BSD', name: 'Bahamian Dollar' },
    { code: 'BTN', name: 'Bhutanese Ngultrum' },
    { code: 'BWP', name: 'Botswanan Pula' },
    { code: 'BZD', name: 'Belize Dollar' },
    { code: 'CHF', name: 'Swiss Franc' },
    { code: 'CLP', name: 'Chilean Peso' },
    { code: 'CNY', name: 'Chinese Yuan' },
    { code: 'CRC', name: 'Costa Rican Colón' },
    { code: 'CVE', name: 'Cape Verdean Escudo' },
    { code: 'CZK', name: 'Czech Republic Koruna' },
    { code: 'DJF', name: 'Djiboutian Franc' },
    { code: 'DKK', name: 'Danish Krone' },
    { code: 'DOP', name: 'Dominican Peso' },
    { code: 'DZD', name: 'Algerian Dinar' },
    { code: 'EGP', name: 'Egyptian Pound' },
    { code: 'ETB', name: 'Ethiopian Birr' },
    { code: 'FJD', name: 'Fijian Dollar' },
    { code: 'FKP', name: 'Falkland Islands Pound' },
    { code: 'GEL', name: 'Georgian Lari' },
    { code: 'GGP', name: 'Guernsey Pound' },
    { code: 'GHS', name: 'Ghanaian Cedi' },
    { code: 'GIP', name: 'Gibraltar Pound' },
    { code: 'GMD', name: 'Gambian Dalasi' },
    { code: 'GNF', name: 'Guinean Franc' },
    { code: 'GTQ', name: 'Guatemalan Quetzal' },
    { code: 'GYD', name: 'Guyanaese Dollar' },
    { code: 'HKD', name: 'Hong Kong Dollar' },
    { code: 'HNL', name: 'Honduran Lempira' },
    { code: 'HRK', name: 'Croatian Kuna' },
    { code: 'HTG', name: 'Haitian Gourde' },
    { code: 'HUF', name: 'Hungarian Forint' },
    { code: 'IDR', name: 'Indonesian Rupiah' },
    { code: 'ILS', name: 'Israeli New Sheqel' },
    { code: 'IMP', name: 'Manx pound' },
    { code: 'INR', name: 'Indian Rupee' },
    { code: 'ISK', name: 'Icelandic Króna' },
    { code: 'JEP', name: 'Jersey Pound' },
    { code: 'JMD', name: 'Jamaican Dollar' },
    { code: 'JOD', name: 'Jordanian Dinar' },
    { code: 'KES', name: 'Kenyan Shilling' },
    { code: 'KGS', name: 'Kyrgystani Som' },
    { code: 'KHR', name: 'Cambodian Riel' },
    { code: 'KMF', name: 'Comorian Franc' },
    { code: 'KRW', name: 'South Korean Won' },
    { code: 'KWD', name: 'Kuwaiti Dinar' },
    { code: 'KYD', name: 'Cayman Islands Dollar' },
    { code: 'KZT', name: 'Kazakhstani Tenge' },
    { code: 'LAK', name: 'Laotian Kip' },
    { code: 'LBP', name: 'Lebanese Pound' },
    { code: 'LKR', name: 'Sri Lankan Rupee' },
    { code: 'LRD', name: 'Liberian Dollar' },
    { code: 'LSL', name: 'Lesotho Loti' },
    { code: 'MAD', name: 'Moroccan Dirham' },
    { code: 'MDL', name: 'Moldovan Leu' },
    { code: 'MGA', name: 'Malagasy Ariary' },
    { code: 'MKD', name: 'Macedonian Denar' },
    { code: 'MNT', name: 'Mongolian Tugrik' },
    { code: 'MOP', name: 'Macanese Pataca' },
    { code: 'MRU', name: 'Mauritanian Ouguiya' },
    { code: 'MUR', name: 'Mauritian Rupee' },
    { code: 'MVR', name: 'Maldivian Rufiyaa' },
    { code: 'MWK', name: 'Malawian Kwacha' },
    { code: 'MYR', name: 'Malaysian Ringgit' },
    { code: 'MZN', name: 'Mozambican Metical' },
    { code: 'NAD', name: 'Namibian Dollar' },
    { code: 'NGN', name: 'Nigerian Naira' },
    { code: 'NIO', name: 'Nicaraguan Córdoba' },
    { code: 'NOK', name: 'Norwegian Krone' },
    { code: 'NPR', name: 'Nepalese Rupee' },
    { code: 'NZD', name: 'New Zealand Dollar' },
    { code: 'OMR', name: 'Omani Rial' },
    { code: 'PAB', name: 'Panamanian Balboa' },
    { code: 'PEN', name: 'Peruvian Nuevo Sol' },
    { code: 'PGK', name: 'Papua New Guinean Kina' },
    { code: 'PHP', name: 'Philippine Peso' },
    { code: 'PKR', name: 'Pakistani Rupee' },
    { code: 'PLN', name: 'Polish Zloty' },
    { code: 'PYG', name: 'Paraguayan Guarani' },
    { code: 'QAR', name: 'Qatari Rial' },
    { code: 'RON', name: 'Romanian Leu' },
    { code: 'RSD', name: 'Serbian Dinar' },
    { code: 'RWF', name: 'Rwandan Franc' },
    { code: 'SAR', name: 'Saudi Riyal' },
    { code: 'SBD', name: 'Solomon Islands Dollar' },
    { code: 'SCR', name: 'Seychellois Rupee' },
    { code: 'SEK', name: 'Swedish Krona' },
    { code: 'SGD', name: 'Singapore Dollar' },
    { code: 'SHP', name: 'Saint Helena Pound' },
    { code: 'SLL', name: 'Sierra Leonean Leone' },
    { code: 'SRD', name: 'Surinamese Dollar' },
    { code: 'SVC', name: 'Salvadoran Colón' },
    { code: 'SZL', name: 'Swazi Lilangeni' },
    { code: 'THB', name: 'Thai Baht' },
    { code: 'TMT', name: 'Turkmenistani Manat' },
    { code: 'TND', name: 'Tunisian Dinar' },
    { code: 'TOP', name: 'Tongan Paʻanga' },
    { code: 'TRY', name: 'Turkish Lira' },
    { code: 'TTD', name: 'Trinidad and Tobago Dollar' },
    { code: 'TWD', name: 'New Taiwan Dollar' },
    { code: 'TZS', name: 'Tanzanian Shilling' },
    { code: 'UAH', name: 'Ukrainian Hryvnia' },
    { code: 'UGX', name: 'Ugandan Shilling' },
    { code: 'UYU', name: 'Uruguayan Peso' },
    { code: 'UZS', name: 'Uzbekistan Som' },
    { code: 'VND', name: 'Vietnamese Dong' },
    { code: 'VUV', name: 'Vanuatu Vatu' },
    { code: 'WST', name: 'Samoan Tala' },
    { code: 'XCD', name: 'East Caribbean Dollar' },
    { code: 'XOF', name: 'CFA Franc BCEAO' },
    { code: 'XPF', name: 'CFP Franc' },
    { code: 'ZAR', name: 'South African Rand' },
    { code: 'ZMW', name: 'Zambian Kwacha' },
  ];

export function ProductCard({ product, productType, onAddToCart }: ProductCardProps) {
  const [isCouponOpen, setIsCouponOpen] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discount: number;
    type: "percentage" | "fixed";
  } | null>(null);

  const [selectedOption, setSelectedOption] = useState(product.options ? product.options[0].label : '');
  const [currentOption, setCurrentOption] = useState<ProductOption | undefined>(product.options ? product.options[0] : undefined);
  
  const basePrice = currentOption?.price ?? product.price;

  const [finalPrice, setFinalPrice] = useState(basePrice);
  const [error, setError] = useState("");
  
  const { toast } = useToast();

  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [convertedPrice, setConvertedPrice] = useState<string | null>(null);
  const [isConverting, setIsConverting] = useState(false);

  useEffect(() => {
    const newOption = product.options?.find(o => o.label === selectedOption);
    setCurrentOption(newOption);
    const newBasePrice = newOption?.price ?? product.price;
    setFinalPrice(newBasePrice);
    setAppliedCoupon(null);
    setCouponCode("");
  }, [product, selectedOption]);


  useEffect(() => {
    let isCancelled = false;
    const convertCurrency = async () => {
      if (selectedCurrency === 'USD') {
        setConvertedPrice(null);
        return;
      }
      setIsConverting(true);
      try {
        const response = await fetch(`https://api.exchangerate-api.com/v4/latest/USD`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        if (isCancelled) return;

        const rate = data.rates[selectedCurrency];
        if (rate) {
          const newConvertedPrice = (finalPrice * rate).toFixed(2);
          setConvertedPrice(`${newConvertedPrice} ${selectedCurrency}`);
        } else {
           throw new Error(`Currency ${selectedCurrency} not found`);
        }
      } catch (e) {
        if (isCancelled) return;
        console.error(e);
        toast({
          variant: "destructive",
          title: "Error de conversión",
          description: "No se pudo obtener la tasa de cambio. Por favor, inténtalo de nuevo más tarde.",
        });
        setConvertedPrice(null);
        setSelectedCurrency('USD');
      } finally {
        if (!isCancelled) {
          setIsConverting(false);
        }
      }
    };
    convertCurrency();
    return () => { isCancelled = true; };
  }, [selectedCurrency, finalPrice, toast]);


  const handleApplyCoupon = () => {
    if (product.couponsDisabled) {
      setError("Los cupones no son válidos para este producto.");
      return;
    }
    const coupon = coupons[couponCode.toUpperCase()];
    if (coupon) {
      let newPrice;
      const currentPrice = currentOption?.price ?? product.price;
      if (coupon.type === "percentage") {
        newPrice = currentPrice * (1 - coupon.discount);
      } else {
        newPrice = currentPrice - coupon.discount;
      }
      setFinalPrice(Math.max(0, newPrice));
      setAppliedCoupon({ code: couponCode.toUpperCase(), ...coupon });
      setError("");
      setIsCouponOpen(false);
    } else {
      setError("Cupón no válido");
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setFinalPrice(currentOption?.price ?? product.price);
    setCouponCode("");
    setError("");
  };

  const handleAddToCart = () => {
    const productToAdd = {
      ...product,
      price: finalPrice,
      name: product.options ? `${product.name} - ${selectedOption}` : product.name,
      id: product.options ? `${product.id}-${selectedOption}` : product.id,
    };
    onAddToCart(productToAdd);
  };

  const telegramMessage = `Hola, estoy interesado en adquirir el producto "${product.name}${currentOption ? ` - ${currentOption.label}` : ''}".`;
  const telegramUrl = `https://t.me/IamBiird?text=${encodeURIComponent(telegramMessage)}`;

  const astroPayLinks: { [key: number]: string } = {
    5: 'https://onetouch.astropay.com/payment?external_reference_id=your_id_for_5_usd',
    10: 'https://onetouch.astropay.com/payment?external_reference_id=pGG7RUvP6u6jRAOuTmg9SNgVecqkabtp',
    15: 'https://onetouch.astropay.com/payment?external_reference_id=6KIaUPI6Krbk0rpslvUkR2JTgFI2Ml3Q',
    20: 'https://onetouch.astropay.com/payment?external_reference_id=WhdzmQU71DAFbarrtbW0a0b6Bku54xRX',
    25: 'https://onetouch.astropay.com/payment?external_reference_id=nI0fFrZEAMzSi37N0aT4i3xsgRapPjqg',
    30: 'https://onetouch.astropay.com/payment?external_reference_id=gpL0QPwPPsTPrOHZwMr2RB91NT2FS901',
    50: 'https://onetouch.astropay.com/payment?external_reference_id=4dz1l51Vz8Fuam4XJ6f0VO3TBKRXQXIe',
  };

  const astroPayUrl = product.astroPayId ? `https://onetouch.astropay.com/payment?external_reference_id=${product.astroPayId}` : (astroPayLinks[basePrice as keyof typeof astroPayLinks] || 'https://onetouch.astropay.com/payment?external_reference_id=pGG7RUvP6u6jRAOuTmg9SNgVecqkabtp');


  const getProductIcon = () => {
    switch(productType) {
        case 'file':
            return '📂';
        case 'injector':
            return '💉';
        case 'module':
            return '⚙️';
        case 'codm':
            return '🎯'
        default:
            return '📦';
    }
  }
  
  const cardClasses = cn(
    "flex flex-col bg-card/70 backdrop-blur-sm border-border hover:border-primary/50 transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-primary/20 relative overflow-hidden",
    {
      "border-yellow-500/50 hover:border-yellow-400 hover:shadow-yellow-500/30 animated-border-gold": product.theme === 'gold',
      "border-red-500/50 hover:border-red-400 hover:shadow-red-500/30 animated-border-gold-red": product.theme === 'gold-red',
    }
  );

  const titleClasses = cn(
    "font-headline text-2xl bg-clip-text text-transparent h-16 flex items-center justify-center text-center notranslate",
    {
      "bg-gradient-to-r from-red-600 via-black to-red-600 animated-background": !product.theme,
      "bg-gradient-to-r from-yellow-400 via-yellow-600 to-yellow-400 animated-gold": product.theme === 'gold',
      "bg-gradient-to-r from-red-500 via-yellow-400 to-red-700 animated-gold-red": product.theme === 'gold-red',
    }
  );

  const renderFeature = (feature: string) => {
    if (product.options && currentOption?.features) {
      const replacedFeature = Object.entries(currentOption.features).reduce(
        (acc, [key, value]) => acc.replace(`{${key}}`, value),
        feature
      );
      return replacedFeature;
    }
    return feature;
  };

  return (
    <Card className={cardClasses}>
      <CardHeader>
        <CardTitle className={titleClasses}>
          {product.name}
        </CardTitle>
        {product.options && (
          <div className="px-6">
            <Select value={selectedOption} onValueChange={setSelectedOption}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona una opción" />
              </SelectTrigger>
              <SelectContent>
                {product.options.map(option => (
                  <SelectItem key={option.label} value={option.label}>
                    {option.label} - ${option.price.toFixed(2)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        <CardDescription className="text-3xl font-bold text-primary text-center">
          <div className="flex justify-center items-center gap-2">
            <div>
                {appliedCoupon && (
                <span className="text-base line-through text-muted-foreground mr-2">
                    ${basePrice.toFixed(2)}
                </span>
                )}
                ${finalPrice.toFixed(2)}{product.isMonthly && <span className="text-base font-normal text-muted-foreground">/mes</span>}
                 {convertedPrice && <span className="block text-lg font-medium text-muted-foreground">{isConverting ? 'Convirtiendo...' : convertedPrice}</span>}
            </div>
             <Select value={selectedCurrency} onValueChange={setSelectedCurrency} disabled={isConverting}>
                <SelectTrigger className="w-auto h-8 px-2 border-0 bg-transparent">
                    <Globe className="h-4 w-4"/>
                </SelectTrigger>
                <SelectContent>
                    {currencies.map(c => <SelectItem key={c.code} value={c.code}>{c.code} - {c.name}</SelectItem>)}
                </SelectContent>
            </Select>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow space-y-4">
        <div className="relative w-full h-40 rounded-md overflow-hidden group bg-black flex items-center justify-center">
          <p className={cn("text-2xl font-bold flex items-center gap-2", {
            "animated-text-green": !product.theme,
            "animated-gold-text": product.theme === 'gold',
            "animated-gold-red-text": product.theme === 'gold-red'
          })}>
            {product.status ? (
              <>
                <ShieldCheck className="h-6 w-6" />
                <span>{product.status}</span>
              </>
            ) : (
               <>
                <span>{getProductIcon()}</span>
                <span>
                    {productType === 'codm' ? 'Producto Disponible CODM' : 'Producto Disponible Bloodstrike'}
                </span>
              </>
            )}
          </p>
        </div>
        <ul className="space-y-2 text-muted-foreground">
          {product.features.map((feature, index) => (
            <li key={index} className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500 mt-1 shrink-0" />
              <span className="notranslate">{renderFeature(feature)}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        {isCouponOpen && (
          <div className="w-full flex flex-col gap-2 mb-2">
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Código de cupón"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="bg-background/80"
              />
              <Button onClick={handleApplyCoupon} size="sm">
                Aplicar
              </Button>
            </div>
            {error && (
              <p className="text-red-500 text-xs text-center">{error}</p>
            )}
          </div>
        )}
        {appliedCoupon && (
          <div className="w-full flex justify-center items-center gap-2 mb-2 text-sm text-green-400">
            <Tag className="h-4 w-4" />
            <span>Cupón "{appliedCoupon.code}" aplicado.</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={removeCoupon}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
        <div className="w-full grid grid-cols-2 gap-2">
          <Dialog>
            <DialogTrigger asChild>
               <Button
                size="lg"
                disabled={!!product.status}
                className="w-full text-lg py-6 bg-gradient-to-r from-green-500 via-green-700 to-green-500 text-white font-bold animated-green"
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Adquiere Aquí
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Seleccionar Método de Pago</DialogTitle>
                <DialogDescription>
                  Elige tu opción de pago preferida para el producto:{" "}
                  {product.name} - {selectedOption}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                 <Button asChild variant="outline">
                  <Link
                    href={astroPayUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Pagar con AstroPay
                  </Link>
                </Button>
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
           <Button
              onClick={handleAddToCart}
              className="w-full text-lg py-6"
              size="lg"
              variant="secondary"
               disabled={!!product.status}
            >
              <PlusCircle className="mr-2 h-5 w-5" />
              Añadir
            </Button>
        </div>
         <div className="w-full mt-2">
          {!product.couponsDisabled && !product.status && (
            <Button
                onClick={() => setIsCouponOpen(!isCouponOpen)}
                className="w-full"
                size="sm"
                variant="outline"
            >
                <Tag className="mr-2 h-5 w-5" />
                {isCouponOpen ? "Cerrar Cupón" : "Aplicar Cupón"}
            </Button>
            )}
        </div>
      </CardFooter>
    </Card>
  );
}

    