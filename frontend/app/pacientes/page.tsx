'use client';

import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Center,
  Flex,
  FormControl,
  FormLabel,
  Icon,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { FaPen, FaPlus, FaSearch, FaTrash } from "react-icons/fa";
import { useRouter } from "next/navigation";
import InputMask from "react-input-mask";
import { usePatientStore } from "../stores/patientStore";

// Componente para o Modal de adicionar paciente
function AddPatientModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [cpf, setCpf] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const { createPatient } = usePatientStore();
  const toast = useToast();

  const resetForm = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setPhone("");
    setCpf("");
    setBirthDate("");
    setErrors({});
  };

  const formatPhone = (value: string) => {
    return value.replace(/\D/g, "");
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!firstName) newErrors.firstName = "Primeiro nome é obrigatório";
    if (!lastName) newErrors.lastName = "Sobrenome é obrigatório";
    if (!email) newErrors.email = "Email é obrigatório";
    if (email && !/\S+@\S+\.\S+/.test(email)) newErrors.email = "Email inválido";
    if (!phone) newErrors.phone = "Telefone é obrigatório";
    if (!cpf) newErrors.cpf = "CPF é obrigatório";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    
    try {
      const data = {
        firstName,
        lastName,
        email,
        phone: formatPhone(phone),
        cpf: cpf.replace(/\D/g, ""),
        birthDate: birthDate || null,
      };
      
      const result = await createPatient(data);
      
      if (result) {
        toast({
          title: "Paciente adicionado",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        resetForm();
        onClose();
      }
    } catch (error) {
      toast({
        title: "Erro ao adicionar paciente",
        description: "Não foi possível adicionar o paciente. Tente novamente.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Adicionar Paciente</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4}>
            <FormControl isInvalid={!!errors.firstName}>
              <FormLabel>Primeiro Nome</FormLabel>
              <Input
                placeholder="Digite o primeiro nome"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              {errors.firstName && (
                <Text color="red.500" fontSize="sm">
                  {errors.firstName}
                </Text>
              )}
            </FormControl>

            <FormControl isInvalid={!!errors.lastName}>
              <FormLabel>Sobrenome</FormLabel>
              <Input
                placeholder="Digite o sobrenome"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
              {errors.lastName && (
                <Text color="red.500" fontSize="sm">
                  {errors.lastName}
                </Text>
              )}
            </FormControl>

            <FormControl isInvalid={!!errors.email}>
              <FormLabel>Email</FormLabel>
              <Input
                placeholder="Digite o email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.email && (
                <Text color="red.500" fontSize="sm">
                  {errors.email}
                </Text>
              )}
            </FormControl>

            <FormControl isInvalid={!!errors.phone}>
              <FormLabel>Telefone</FormLabel>
              <Input
                as={InputMask}
                mask="(99) 99999-9999"
                placeholder="(00) 00000-0000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              {errors.phone && (
                <Text color="red.500" fontSize="sm">
                  {errors.phone}
                </Text>
              )}
            </FormControl>

            <FormControl isInvalid={!!errors.cpf}>
              <FormLabel>CPF</FormLabel>
              <Input
                as={InputMask}
                mask="999.999.999-99"
                placeholder="000.000.000-00"
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
              />
              {errors.cpf && (
                <Text color="red.500" fontSize="sm">
                  {errors.cpf}
                </Text>
              )}
            </FormControl>

            <FormControl>
              <FormLabel>Data de Nascimento</FormLabel>
              <Input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
              />
            </FormControl>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="gray" mr={3} onClick={onClose}>
            Cancelar
          </Button>
          <Button colorScheme="blue" onClick={handleSubmit}>
            Adicionar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default function PacientesPage() {
  const { patients, loading, fetchPatients, deletePatient } = usePatientStore();
  const [searchTerm, setSearchTerm] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();
  const toast = useToast();
  
  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  const handleSearch = () => {
    fetchPatients(searchTerm);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleEdit = (id: string) => {
    router.push(`/pacientes/${id}`);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Tem certeza que deseja remover este paciente?")) {
      const success = await deletePatient(id);
      
      if (success) {
        toast({
          title: "Paciente removido",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Erro ao remover paciente",
          description: "Não foi possível remover o paciente. Tente novamente.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };

  const textColor = useColorModeValue("gray.700", "white");
  const bgColor = useColorModeValue("white", "gray.800");

  return (
    <Box pt={{ base: "90px", md: "80px", xl: "80px" }}>
      <Flex
        mb="24px"
        justifyContent="space-between"
        align="center"
        direction={{ base: "column", md: "row" }}
      >
        <Text color={textColor} fontSize="2xl" fontWeight="700" lineHeight="100%">
          Pacientes
        </Text>
        <Flex align="center" gap={4}>
          <Box
            borderRadius="10px"
            bg={bgColor}
            p="8px"
            display="flex"
            alignItems="center"
          >
            <Input
              placeholder="Buscar paciente..."
              fontSize="sm"
              py="11px"
              placeholder-color="gray.400"
              w={{ base: "100%", md: "258px" }}
              borderRadius="10px"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <Button
              variant="primary"
              ml={2}
              p="0px"
              h="32px"
              w="32px"
              onClick={handleSearch}
            >
              <Icon h="16px" w="16px" as={FaSearch} />
            </Button>
          </Box>
          <Button
            variant="primary"
            leftIcon={<Icon as={FaPlus} h="16px" w="16px" />}
            onClick={onOpen}
          >
            Adicionar
          </Button>
        </Flex>
      </Flex>

      {loading ? (
        <Center mt={10}>
          <Text>Carregando pacientes...</Text>
        </Center>
      ) : patients.length === 0 ? (
        <Center mt={10}>
          <Text>Nenhum paciente encontrado.</Text>
        </Center>
      ) : (
        <TableContainer bg={bgColor} p={4} borderRadius="10px">
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Nome</Th>
                <Th>Email</Th>
                <Th>Telefone</Th>
                <Th>CPF</Th>
                <Th>Ações</Th>
              </Tr>
            </Thead>
            <Tbody>
              {patients.map((patient) => (
                <Tr key={patient.id}>
                  <Td>{patient.name}</Td>
                  <Td>{patient.email}</Td>
                  <Td>
                    {patient.phone.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3")}
                  </Td>
                  <Td>
                    {patient.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")}
                  </Td>
                  <Td>
                    <Flex gap={2}>
                      <Button
                        variant="primary"
                        p="0px"
                        h="32px"
                        w="32px"
                        onClick={() => handleEdit(patient.id)}
                      >
                        <Icon h="16px" w="16px" as={FaPen} />
                      </Button>
                      <Button
                        variant="danger"
                        p="0px"
                        h="32px"
                        w="32px"
                        onClick={() => handleDelete(patient.id)}
                      >
                        <Icon h="16px" w="16px" as={FaTrash} />
                      </Button>
                    </Flex>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      )}

      <AddPatientModal isOpen={isOpen} onClose={onClose} />
    </Box>
  );
} 