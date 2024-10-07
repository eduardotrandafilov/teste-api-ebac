/// <reference types="cypress" />

import contrato from "../contracts/usuarios.contract";
import { faker } from "@faker-js/faker"

describe('Testes da Funcionalidade Usuários', () => {

  beforeEach(() => {

  });

  it('Deve validar contrato de usuários', () => {
    cy.request('usuarios').then(response => {
      return contrato.validateAsync(response.body)
    })
  })

  it('Deve listar usuários cadastrados com sucesso', () => {
    cy.request({
      method: 'GET',
      url: 'usuarios'
    }).then((response) => {
      expect(response.body).to.have.property('usuarios')
      expect(response.status).to.equal(200)
      expect(response.duration).to.be.lessThan(24)
    })
  });

  it('Deve cadastrar um usuário com sucesso usando faker', () => {
    cy.request({
      method: 'POST',
      url: 'usuarios',
      body: {
        "nome": faker.internet.userName(),
        "email": faker.internet.email(),
        "password": "teste",
        "administrador": "true"
      }
    }).then((response) => {
      expect(response.body.message).to.equal('Cadastro realizado com sucesso')
      expect(response.status).to.equal(201)
    })
  });

  it('Deve cadastrar um usuário com sucesso usando Math', () => {
    let nome = 'Usuario EBAC ' + Math.floor(Math.random() * 100000000000000)
    let email = nome.replace(/ /g, '').toLowerCase()

    cy.request({
      method: 'POST',
      url: 'usuarios',
      body: {
        "nome": nome,
        "email": `${email}@qa.com`,
        "password": "teste",
        "administrador": "true"
      }
    }).then((response) => {
      expect(response.body.message).to.equal('Cadastro realizado com sucesso')
      expect(response.status).to.equal(201)
    })
  });

  it('Deve validar busca de um usuário com sucesso', () => {
    let nome = 'Usuario EBAC ' + Math.floor(Math.random() * 100000000000000)
    let email = nome.replace(/ /g, '').toLowerCase()

    cy.cadastrarUsuario(nome,`${email}@qa.com`, 'teste', 'true')
      .then((response)=>{
        let id = response.body._id
        cy.request({
          method:'GET',
          url: `usuarios/${id}`
        }).then((response)=>{
          expect(response.body).to.have.property('nome')
          expect(response.status).to.equal(200)
        })
      })
  });

  it('Deve validar cadastro de um usuário com email inválido', () => {
    cy.request({
      method: 'POST',
      url: 'usuarios',
      body: {
        "nome": faker.internet.userName(),
        "email": faker.internet.userName(),
        "password": "teste",
        "administrador": "true"
      },
      failOnStatusCode: false
    }).should((response) => {
      expect(response.body.email).to.equal('email deve ser um email válido')
      expect(response.status).to.equal(400)
    })
  });
  
  it('Deve validar cadastro de um usuário com email já cadastrado', () => {
    let nome = 'Usuario EBAC ' + Math.floor(Math.random() * 100000000000000)
    let email = nome.replace(/ /g, '').toLowerCase()

    cy.cadastrarUsuario(nome,`${email}@qa.com`,'teste', 'true')
    cy.cadastrarUsuario('Novo Usuario',`${email}@qa.com`,'teste', 'true')
     .then((response)=>{
      expect(response.body.message).to.equal('Este email já está sendo usado')
      expect(response.status).to.equal(400)
    })
  })

  it('Deve editar um usuário previamente cadastrado', () => {
    let nome = 'Usuario EBAC ' + Math.floor(Math.random() * 100000000000000)
    let email = nome.replace(/ /g, '').toLowerCase()

    cy.cadastrarUsuario(nome,`${email}@qa.com`, 'teste', 'true')
    .then((response)=>{
      let id = response.body._id
      cy.request({
        method:'PUT',
        url: `usuarios/${id}`,
        body:{
          "nome": "Usuario EBAC Editado",
          "email": `${email}@qa.com`,
          "password": "teste",
          "administrador": "true"
        }
      }).then((response)=>{
        expect(response.body.message).to.equal('Registro alterado com sucesso')
        expect(response.status).to.equal(200)
      })
    })
  });
  
  it('Deve deletar um usuário previamente cadastrado', () => {
    let nome = 'Usuario EBAC ' + Math.floor(Math.random() * 100000000000000)
    let email = nome.replace(/ /g, '').toLowerCase()

    cy.cadastrarUsuario(nome,`${email}@qa.com`, 'teste', 'true')
    .then((response)=>{
      let id = response.body._id
      cy.request({
        method:'DELETE',
        url: `usuarios/${id}`,
      }).then((response)=>{
        expect(response.body.message).to.equal('Registro excluído com sucesso')
        expect(response.status).to.equal(200)
      })
    })
  });
});
