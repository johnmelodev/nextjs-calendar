'use client';

import { Alert, AlertIcon, AlertTitle, AlertDescription, Button, Box, Flex, Text, Code, VStack, HStack, Divider, Link } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { checkApiConfig } from '../../src/services/checkApi';

interface ApiErrorMessageProps {
  error: string;
  onRetry?: () => void;
}

interface ApiStatus {
  fixed?: boolean;
  url?: string;
  oldUrl?: string;
  newUrl?: string;
}

export default function ApiErrorMessage({ error, onRetry }: ApiErrorMessageProps) {
  const [apiStatus, setApiStatus] = useState<ApiStatus>({
    url: ''
  });
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const status = checkApiConfig();
      
      // Transformar o resultado para o formato esperado pelo estado
      const formattedStatus: ApiStatus = {
        fixed: status.fixed,
        url: status.fixed ? status.newUrl : status.url,
        oldUrl: status.oldUrl,
        newUrl: status.newUrl
      };
      
      setApiStatus(formattedStatus);
    }
  }, []);

  // Verificar se é um erro de conexão recusada
  const isConnectionError = 
    error.includes('conexão') || 
    error.includes('ECONNREFUSED') || 
    error.includes('Network Error') ||
    error.includes('net::ERR_CONNECTION_REFUSED');

  // Função para tentar corrigir o problema automaticamente
  const handleAutoFix = () => {
    if (typeof window !== 'undefined') {
      // Forçar atualização da URL da API
      const correctUrl = "https://nextjs-calendar-production.up.railway.app";
      localStorage.setItem('api_url', correctUrl);
      (window as any).NEXT_PUBLIC_API_URL = correctUrl;
      
      // Recarregar a página para aplicar as mudanças
      window.location.reload();
    }
  };

  return (
    <Box my={4}>
      <Alert 
        status={isConnectionError ? "warning" : "error"} 
        variant="subtle"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        textAlign="center"
        borderRadius="md"
        py={6}
      >
        <AlertIcon boxSize="40px" mr={0} />
        <AlertTitle mt={4} mb={1} fontSize="lg">
          {isConnectionError ? "Erro de conexão com a API" : "Erro ao carregar dados"}
        </AlertTitle>
        <AlertDescription maxWidth="md">
          {isConnectionError ? (
            <>
              <Box mb={4}>
                Não foi possível conectar ao servidor da API. 
                Isso pode ser causado por:
                <VStack align="start" spacing={1} mt={2} px={4}>
                  <Text>• A API está tentando acessar <Code>localhost:3333</Code> em vez do servidor da Railway</Text>
                  <Text>• O servidor da API na Railway pode estar temporariamente indisponível</Text>
                  <Text>• Pode haver um problema com sua conexão de internet</Text>
                </VStack>
              </Box>
              
              <Divider my={3} />
              
              <Box fontSize="sm" mb={4} textAlign="left" px={2}>
                <Text fontWeight="bold" mb={1}>Configuração atual:</Text>
                <HStack fontSize="xs">
                  <Text>URL da API:</Text>
                  <Code>{apiStatus.url || "Não definida"}</Code>
                </HStack>
                {apiStatus.fixed && (
                  <HStack fontSize="xs" mt={1}>
                    <Text>URL anterior:</Text>
                    <Code>{apiStatus.oldUrl || "Desconhecida"}</Code>
                  </HStack>
                )}
              </Box>
              
              <Box mb={4}>
                <Button 
                  colorScheme="yellow" 
                  onClick={handleAutoFix}
                  size="sm"
                  mb={2}
                  width="full"
                >
                  Corrigir automaticamente
                </Button>
                
                {onRetry && (
                  <Button 
                    colorScheme="blue"
                    onClick={onRetry}
                    size="sm"
                    variant="outline"
                    width="full"
                  >
                    Tentar novamente
                  </Button>
                )}
              </Box>
              
              <Box mt={2}>
                <Button 
                  variant="link" 
                  size="xs" 
                  colorScheme="gray"
                  onClick={() => setShowDetails(!showDetails)}
                >
                  {showDetails ? "Ocultar detalhes técnicos" : "Mostrar detalhes técnicos"}
                </Button>
                
                {showDetails && (
                  <Box mt={2} p={3} bg="gray.50" borderRadius="md" fontSize="xs" textAlign="left">
                    <Text fontWeight="bold" mb={1}>Erro detalhado:</Text>
                    <Code p={2} display="block" whiteSpace="pre-wrap" fontSize="xs">
                      {error}
                    </Code>
                    <Text mt={3} fontWeight="bold" mb={1}>Solução recomendada:</Text>
                    <Text>
                      Verificar se o arquivo <Code>.env.local</Code> está configurado corretamente 
                      com a URL da Railway e não com localhost.
                    </Text>
                    <Text mt={2}>
                      <Link 
                        href="https://nextjs-calendar-production.up.railway.app" 
                        color="blue.500" 
                        isExternal
                      >
                        Verificar se o backend está online
                      </Link>
                    </Text>
                  </Box>
                )}
              </Box>
            </>
          ) : (
            <Box mb={4}>{error}</Box>
          )}
        </AlertDescription>
      </Alert>
    </Box>
  );
} 