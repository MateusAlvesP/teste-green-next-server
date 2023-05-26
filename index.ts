import fastify from 'fastify';
import cors from '@fastify/cors';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';


const prisma = new PrismaClient();

async function main() {


  //DECLARANDO O SERVIDOR

  const server = fastify({ logger: true });

  await server.register(cors, {
    origin: true
  })
  

  //ROTAS

  //CLIENTE

  //CADASTRAR CLIENTE
  server.post('/cliente', async(request, reply) => {
  
    const createClienteBody = z.object({
      nome: z.string().max(45),
      cpf: z.string().length(11),
      rua: z.string().max(256),
      numero: z.string().max(10),
      cep: z.string().length(8),
      cidade: z.string().max(256),
      estado: z.string().max(256),
      complemento: z.string().max(256).optional()
    })
  
    const {nome, cpf, rua, numero, cep, cidade, estado, complemento} = createClienteBody.parse(request.body)
  
    const cliente = await prisma.cliente.create({
      data: {
        nome,
        cpf,
        endereco: {
          create:{
            rua,
            numero,
            cep,
            cidade,
            estado,
            complemento
          }
        }
      }
    })
  
    return reply.status(201).send({cliente})
  })
  
  
  //CONSULTAR CLIENTES ATRASADOS
  server.get('/atrasados', async (request, reply) => {
  
    const atrasados = await prisma.locacao.findMany({
      where: {
        vencimento: {
          lte: new Date()
        }
      }
    })
  
    const clientesIds = atrasados.map(a => a.cliente_id);
  
    const clientesAtrasados = await prisma.cliente.findMany({
      where: {
        id: { in: clientesIds}
      }
    })
  
    return {clientesAtrasados}
  
  })
  

  //VENDEDOR

  //CADASTRAR VENDEDOR
  server.post('/vendedor', async(request, reply) => {
  
    const createVendedorBody = z.object({
      nome: z.string().max(45),
      cpf: z.string().length(11),
    })
  
    const {nome, cpf} = createVendedorBody.parse(request.body);
  
    const vendedor = await prisma.vendedor.create({
      data: {
        nome,
        cpf
      }
    })
  
    return reply.status(201).send({vendedor})
  
  })

  //CONSULTAR TODOS VENDEDORES
  server.get('/vendedor', async (request, reply) => {
    const vendedores = await prisma.vendedor.findMany({})
    return vendedores;
  })
  

  //FILME

  //CATALOGAR FILME
  server.post('/filme', async(request, reply) => {
  
    const createFilmeBody = z.object({
      nome: z.string().max(45),
      diretor: z.string().max(45),
      genero: z.enum(['ACAO', 'AVENTURA', 'DRAMA', 'COMEDIA', 'TERROR']),
      copias: z.number()
    })
  
    const {nome, diretor, genero, copias} = createFilmeBody.parse(request.body);
  
    const filme = await prisma.filme.create({
      data: {
        nome,
        diretor,
        genero,
        copias
      }
    })
  
    return reply.status(201).send({filme})
  
  })
  

  //REGISTRAR LOCACAO
  server.post('/locacao', async(request, reply) => {
  
    const registerLocacaoBody = z.object({
      cpfCliente: z.string().length(11),
      cpfVendedor: z.string().length(11),
      nomeFilme: z.string().max(45),
      dias: z.number().min(1).max(7)
    })
  
    const { cpfCliente, cpfVendedor, nomeFilme, dias } = registerLocacaoBody.parse(request.body);
  
    const vendedor = await prisma.vendedor.findUnique({
      where: {
        cpf: cpfVendedor
      }
    });
  
    const cliente = await prisma.cliente.findUnique({
      where: {
        cpf: cpfCliente
      }
    });
  
    const filme = await prisma.filme.findUnique({
      where: {
        nome: nomeFilme
      }
    });
  
    if(!cliente || !filme || !vendedor) return;
  
    if(filme.copias <= 0) return;
  
    const date = new Date()
    date.setDate(date.getDate() + dias);
  
    const locacao = await prisma.locacao.create({
      data: {
        cliente_id: cliente.id,
        vendedor_id: vendedor.id,
        filme_id: filme.id,
        vencimento: date,
      }
    })
  
    await prisma.filme.update({
      where: {
        nome: filme.nome
      },
      data: {
        copias: {increment: -1}
      }
    })
  
    return reply.status(201).send({locacao})
  
  })
  
  
  
  
  //INICIANDO O SERVIDOR
  server.listen({ port: 8080 }, (err, address) => {
    if (err) {
      console.error(err)
      process.exit(1)
    }
    console.log(`Server listening at ${address}`)
  })

}

main()