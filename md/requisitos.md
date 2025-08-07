# Documentação da API - Sistema de Gestão CEGOR v1.0

## Visão Geral

Este documento descreve os endpoints, modelos de dados e regras de autorização para o backend do Sistema de Gestão CEGOR. Ele serve como um contrato técnico entre a equipe de frontend e backend, garantindo consistência e clareza no desenvolvimento.

---

## 1. Autenticação

O sistema utiliza autenticação baseada em token **JWT (JSON Web Token)**. Todas as rotas, exceto `/api/v1/auth/login`, devem ser protegidas e acessíveis apenas com um token JWT válido enviado no cabeçalho `Authorization: Bearer <token>`.

### 1.1. Endpoint de Login

Realiza a autenticação do usuário e retorna um token de acesso.

* **Método:** `POST`
* **URL:** `/api/v1/auth/login`
* **Corpo da Requisição (Payload):**
    ```json
    {
      "email": "string",
      "password": "string"
    }
    ```
* **Resposta (Sucesso `200 OK`):**
    Retorna o token de acesso e as informações essenciais do usuário logado.
    ```json
    {
      "token": "seu-jwt-token-aqui",
      "user": {
        "id": "string",
        "name": "string",
        "email": "string",
        "role": "cegor" | "regional" | "empresa" | "adm",
        "subrole": "gestor" | "operador" | "fiscal" | "supervisor" | "gerente" | null,
        "regional_id": "string" | null
      }
    }
    ```
* **Respostas de Erro:**
    * `401 Unauthorized`: Email ou senha incorretos.
    * `400 Bad Request`: Formato do email inválido ou campos faltando.

---

## 2. Modelos de Dados (Entidades)

Representações dos dados que serão armazenados no banco de dados.

* **`User`**: Representa um usuário do sistema.
* **`Regional`**: Representa uma secretaria regional.
* **`Bairro`**: Representa um bairro.
    * **Relacionamento:** Pertence a uma `Regional` (via `regional_id`).
* **`Territorio`**: Representa um território dentro de um bairro.
    * **Relacionamento:** Pertence a um `Bairro` (via `bairro_id`).
* **`Fiscal`**: Representa um fiscal.
    * **Relacionamento:** Associado a uma `Regional` (via `regional_id`).
* **`ZGL`**: Zona de Interesse de Limpeza.
    * **Relacionamento:** Pertence a um `Territorio` (via `territory_id`).
* **`EquipamentoPublico`**: Praças, parques, etc.
    * **Relacionamentos:** Pertence a um `Bairro` e a uma `Regional`.
* **`EmpresaContratada`**: Empresa terceirizada de limpeza.
* **`Equipe`**: Equipe de trabalho.
    * **Relacionamento:** Pertence a uma `EmpresaContratada` (via `empresa_id`).
* **`Ocorrencia`**: O registro principal do sistema, representando uma demanda de serviço.
    * **Relacionamentos:** Associada a `Regional`, `Fiscal`, `EquipamentoPublico`, `EmpresaContratada`, `Equipe`.

---

## 3. Autorização e Permissões

A lógica de permissões deve ser rigorosamente implementada no backend. O frontend nunca deve ser a única fonte de controle de acesso.

### 3.1. Princípio Geral

Para cada requisição a um endpoint protegido, o backend deve:
1.  Validar o JWT.
2.  Extrair as informações do usuário (`id`, `role`, `subrole`) do token.
3.  Verificar se o `role` e `subrole` do usuário têm permissão para a ação solicitada (GET, POST, PUT, DELETE) no recurso específico.

### 3.2. Mapeamento de Permissões por Ação

| Role | Subrole | Ações Permitidas no Backend |
| :--- | :--- | :--- |
| `cegor` | `gestor` | Visualizar dados, Gerenciar vistorias. |
| `cegor` | `fiscal` | Visualizar dados, Acompanhar ocorrências. |
| `cegor` | `operador` | Agendar ocorrências, Acompanhar, Visualizar, Detalhar execução. |
| `cegor` | `gerente` | Visualizar, Gerenciar vistorias, **Pausar/Retomar/Direcionar ocorrências**. |
| `regional` | `gestor` | Visualizar dados, Acompanhar ocorrências da sua regional. |
| `regional` | `fiscal` | Visualizar, Realizar vistoria, Acompanhar, Encerrar ocorrências da sua regional. |
| `regional` | `operador` | Acompanhar, Visualizar ocorrências da sua regional. |
| `empresa` | `supervisor` | Visualizar, Acompanhar ocorrências atribuídas à sua empresa. |
| `adm` | `null` | **Acesso total a todas as operações (Super Admin).** |

### 3.3. Lógica de Permissões por Status de Ocorrência

* **Se `Ocorrencia.status` for `pausada`:** Apenas um `cegor/gerente` pode executar as ações de "Retomar" ou "Direcionar".
* **Se `Ocorrencia.status` for `em_execucao`:** Apenas um `cegor/gerente` pode "Pausar".

---

## 4. Endpoints da API (Exemplo de CRUD)

O padrão RESTful deve ser seguido para todos os endpoints.

### Recurso: `/api/v1/regionais`

* **Descrição:** Gerencia as secretarias regionais.
* **Autorização Geral:** Apenas `role: 'adm'` pode criar, editar ou deletar. Todos os usuários autenticados podem visualizar.

#### **Listar todas as Regionais**
* **Método:** `GET`
* **URL:** `/api/v1/regionais`
* **Resposta (Sucesso `200 OK`):** `[Regional]`

#### **Obter uma Regional por ID**
* **Método:** `GET`
* **URL:** `/api/v1/regionais/{id}`
* **Resposta (Sucesso `200 OK`):** `Regional`

#### **Criar uma nova Regional**
* **Método:** `POST`
* **URL:** `/api/v1/regionais`
* **Autorização:** `role: 'adm'`
* **Corpo da Requisição:** `{ "name": "...", "code": "...", "address": "...", "phone": "...", "responsible": "..." }`
* **Resposta (Sucesso `201 Created`):** `Regional` (o objeto recém-criado)

#### **Atualizar uma Regional**
* **Método:** `PUT`
* **URL:** `/api/v1/regionais/{id}`
* **Autorização:** `role: 'adm'`
* **Corpo da Requisição:** Campos da regional a serem atualizados.
* **Resposta (Sucesso `200 OK`):** `Regional` (o objeto atualizado)

#### **Deletar uma Regional**
* **Método:** `DELETE`
* **URL:** `/api/v1/regionais/{id}`
* **Autorização:** `role: 'adm'`
* **Resposta (Sucesso `204 No Content`):** (sem corpo de resposta)

---

## 5. Próximos Passos

* [ ] Definir os endpoints de CRUD para as demais entidades (`Bairro`, `Fiscal`, `EmpresaContratada`, etc.).
* [ ] Detalhar o fluxo de trabalho completo da entidade `Ocorrencia`.
* [ ] Especificar endpoints para relatórios e dashboards.
* [ ] Detalhar a lógica de upload de arquivos para as ocorrências.