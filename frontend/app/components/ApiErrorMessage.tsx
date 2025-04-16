'use client';

import { Alert, AlertIcon, AlertTitle, AlertDescription, Button, Box, Flex } from '@chakra-ui/react';
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

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const status = checkApiConfig();
      
      // Transformar o resultado para o formato esperado pelo estado
      const formattedStatus: ApiStatus = {
        fixed: status.fixed,
        url: status.fixed ? status.newUrl : status.url
      };
      
      setApiStatus(formattedStatus);
    }
  }, []);

  // Verificar se é um erro de conexão recusada
  const isConnectionError = 
    error.includes('conexão') || 
    error.includes('ECONNREFUSED') || 
    error.includes('Network Error');

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
          {isConnectionError ? "Erro de conexão" : "Erro ao carregar dados"}
        </AlertTitle>
        <AlertDescription maxWidth="md">
          {isConnectionError ? (
            <>
              <Box mb={4}>
                Não foi possível conectar ao servidor da API. 
                Isso pode ser causado por problemas na sua conexão 
                de internet ou o servidor da API pode estar temporariamente indisponível.
              </Box>
              <Box fontSize="sm" opacity={0.7} mb={4}>
                URL da API: {apiStatus.url || "Não definida"}
                {apiStatus.fixed && " (corrigida automaticamente)"}
              </Box>
            </>
          ) : (
            <Box mb={4}>{error}</Box>
          )}
          
          {onRetry && (
            <Flex justifyContent="center" mt={2}>
              <Button 
                colorScheme="blue" 
                onClick={onRetry}
                size="sm"
              >
                Tentar novamente
              </Button>
            </Flex>
          )}
        </AlertDescription>
      </Alert>
    </Box>
  );
} 