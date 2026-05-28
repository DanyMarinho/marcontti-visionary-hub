import { useAuthStore } from '../store/authStore';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

export default function Login() {
  const login = useAuthStore((state) => state.login);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md border-[#1e3a5f]/20">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-[#1e3a5f] dark:text-white">Marcontti Hub</CardTitle>
          <CardDescription>Gestão comercial inteligente</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Button 
            className="w-full bg-[#1e3a5f] hover:bg-[#1e3a5f]/90" 
            onClick={() => login('admin')}
          >
            Acessar como Admin
          </Button>
          <Button 
            variant="outline" 
            className="w-full border-[#f97316] text-[#f97316] hover:bg-[#f97316]/10" 
            onClick={() => login('shop')}
          >
            Acessar como Loja
          </Button>
          <Button 
            variant="secondary" 
            className="w-full" 
            onClick={() => login('vendor')}
          >
            Acessar como Vendedor
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
