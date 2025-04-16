"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Box,
  Button,
  Center,
  Flex,
  FormControl,
  FormLabel,
  Icon,
  Input,
  Spinner,
  Text,
  useColorModeValue,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { FaArrowLeft, FaSave, FaTrash } from "react-icons/fa";
import InputMask from "react-input-mask";
import { usePatientStore } from "../../stores/patientStore";

type PatientFormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  cpf: string;
  birthDate: string | null;
};

export default function PatientDetailsPage() {
  const params = useParams();
  const patientId = params.id as string;
  const router = useRouter();
  const toast = useToast();
  const { fetchPatients, updatePatient, deletePatient, patients } = usePatientStore();
  
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState<PatientFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    cpf: "",
    birthDate: null,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const loadPatient = async () => {
      setIsLoading(true);
      
      try {
        // Tentar buscar a lista de pacientes se ainda não estiver carregada
        if (patients.length === 0) {
          await fetchPatients();
        }
        
        // Encontrar o paciente pelo ID
        const patient = patients.find(p => p.id === patientId);
        
        if (patient) {
          setFormData({
            firstName: patient.firstName,
            lastName: patient.lastName,
            email: patient.email,
            phone: patient.phone,
            cpf: patient.cpf,
            birthDate: patient.birthDate,
          });
        } else {
          toast({
            title: "Paciente não encontrado",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
          router.push("/pacientes");
        }
      } catch (error) {
        console.error("Erro ao carregar paciente:", error);
        toast({
          title: "Erro ao carregar paciente",
          description: "Não foi possível carregar os dados do paciente",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadPatient();
  }, [patientId, fetchPatients, patients, router, toast]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const formatPhone = (value: string) => {
    return value.replace(/\D/g, "");
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.firstName) newErrors.firstName = "Primeiro nome é obrigatório";
    if (!formData.lastName) newErrors.lastName = "Sobrenome é obrigatório";
    if (!formData.email) newErrors.email = "Email é obrigatório";
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email inválido";
    if (!formData.phone) newErrors.phone = "Telefone é obrigatório";
    if (!formData.cpf) newErrors.cpf = "CPF é obrigatório";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;

    try {
      setIsLoading(true);
      const data = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formatPhone(formData.phone),
        cpf: formData.cpf.replace(/\D/g, ""),
        birthDate: formData.birthDate,
      };
      
      try {
        await updatePatient(patientId, data);
        toast({
          title: "Paciente atualizado",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } catch (error) {
        // O erro já será tratado pelo try/catch externo
        throw error;
      }
    } catch (error) {
      console.error("Erro ao atualizar paciente:", error);
      toast({
        title: "Erro ao atualizar paciente",
        description: "Não foi possível atualizar os dados do paciente",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Tem certeza que deseja excluir este paciente?")) {
      try {
        setIsLoading(true);
        
        try {
          await deletePatient(patientId);
          toast({
            title: "Paciente excluído",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
          router.push("/pacientes");
        } catch (error) {
          // O erro já será tratado pelo try/catch externo
          throw error;
        }
      } catch (error) {
        console.error("Erro ao excluir paciente:", error);
        toast({
          title: "Erro ao excluir paciente",
          description: "Não foi possível excluir o paciente",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const textColor = useColorModeValue("gray.700", "white");
  const bgColor = useColorModeValue("white", "gray.800");

  if (isLoading) {
    return (
      <Center pt={{ base: "90px", md: "80px", xl: "80px" }} h="50vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  return (
    <Box pt={{ base: "90px", md: "80px", xl: "80px" }}>
      <Flex mb={6} alignItems="center">
        <Button
          variant="outline"
          leftIcon={<Icon as={FaArrowLeft} />}
          onClick={() => router.push("/pacientes")}
          mr={4}
        >
          Voltar
        </Button>
        <Text fontSize="2xl" fontWeight="700" color={textColor}>
          Detalhes do Paciente
        </Text>
      </Flex>

      <Box bg={bgColor} borderRadius="10px" p={6} shadow="sm">
        <VStack spacing={6} align="stretch">
          <Flex gap={4} direction={{ base: "column", md: "row" }}>
            <FormControl isInvalid={!!errors.firstName} flex="1">
              <FormLabel>Primeiro Nome</FormLabel>
              <Input
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Digite o primeiro nome"
              />
              {errors.firstName && (
                <Text color="red.500" fontSize="sm">
                  {errors.firstName}
                </Text>
              )}
            </FormControl>

            <FormControl isInvalid={!!errors.lastName} flex="1">
              <FormLabel>Sobrenome</FormLabel>
              <Input
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Digite o sobrenome"
              />
              {errors.lastName && (
                <Text color="red.500" fontSize="sm">
                  {errors.lastName}
                </Text>
              )}
            </FormControl>
          </Flex>

          <FormControl isInvalid={!!errors.email}>
            <FormLabel>Email</FormLabel>
            <Input
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Digite o email"
              type="email"
            />
            {errors.email && (
              <Text color="red.500" fontSize="sm">
                {errors.email}
              </Text>
            )}
          </FormControl>

          <Flex gap={4} direction={{ base: "column", md: "row" }}>
            <FormControl isInvalid={!!errors.phone} flex="1">
              <FormLabel>Telefone</FormLabel>
              <Input
                as={InputMask}
                mask="(99) 99999-9999"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="(00) 00000-0000"
              />
              {errors.phone && (
                <Text color="red.500" fontSize="sm">
                  {errors.phone}
                </Text>
              )}
            </FormControl>

            <FormControl isInvalid={!!errors.cpf} flex="1">
              <FormLabel>CPF</FormLabel>
              <Input
                as={InputMask}
                mask="999.999.999-99"
                name="cpf"
                value={formData.cpf}
                onChange={handleChange}
                placeholder="000.000.000-00"
              />
              {errors.cpf && (
                <Text color="red.500" fontSize="sm">
                  {errors.cpf}
                </Text>
              )}
            </FormControl>
          </Flex>

          <FormControl>
            <FormLabel>Data de Nascimento</FormLabel>
            <Input
              type="date"
              name="birthDate"
              value={formData.birthDate || ""}
              onChange={handleChange}
            />
          </FormControl>

          <Flex justify="space-between" mt={4}>
            <Button
              colorScheme="red"
              variant="outline"
              leftIcon={<Icon as={FaTrash} />}
              onClick={handleDelete}
            >
              Excluir Paciente
            </Button>
            <Button
              colorScheme="blue"
              leftIcon={<Icon as={FaSave} />}
              onClick={handleSave}
            >
              Salvar Alterações
            </Button>
          </Flex>
        </VStack>
      </Box>
    </Box>
  );
} 