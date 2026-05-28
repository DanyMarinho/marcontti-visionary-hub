import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-[#0a0a0a]">404</h1>
        <p className="text-xl text-muted-foreground">Página não encontrada</p>
        <Button onClick={() => navigate("/")} className="bg-orange-500 hover:bg-orange-600 text-white">
          Voltar para o Dashboard
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
