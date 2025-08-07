# Documentação da API - Recurso: Equipes

## 1. Visão Geral e Análise do Frontend

O componente `EquipeLista.tsx` exibe uma lista de equipes com seu status atual ("Disponível" ou "Alocada"). Esta tela não se baseia apenas no modelo estático de `Equipe`, mas em um modelo de visualização derivado, que chamamos aqui de `TeamSnapshot`.

A API deve, portanto, fornecer um endpoint que já entregue os dados pré-processados, incluindo o status e a atividade atual de cada equipe. A lógica de filtrar por nome e paginar os resultados **deve ser responsabilidade do backend** para garantir a performance e escalabilidade.

## 2. Endpoint Principal: Listar Status das Equipes

Este é o endpoint principal que a página `ListaEquipes` irá consumir para buscar, filtrar e paginar as equipes.

* **Método:** `GET`
* **URL:** `/api/v1/equipes`
* **Funcionalidade:** Retorna uma lista paginada de todas as equipes com seu status atual (disponível ou alocada). Permite a busca por nome.
* **Autorização:** Rota autenticada. Acessível por todos os perfis (`cegor`, `regional`, `empresa`, `adm`).
* **Parâmetros de Query (Query Parameters):**
    * `search` (opcional): `string` - Texto para buscar no nome da equipe. A busca não deve ser case-sensitive.
    * `page` (opcional, padrão: `1`): `number` - O número da página desejada.
    * `limit` (opcional, padrão: `10`): `number` - A quantidade de itens por página.
* **Resposta de Sucesso (`200 OK`):**
    A resposta deve ser um objeto contendo os dados das equipes e as informações de paginação.

    ```json
    {
      "data": [
        {
          "id": "string-id-equipe-1",
          "nome": "Equipe Limpeza Urbana A",
          "atividade_atual": "Limpeza de praça",
          "quantidade_pessoas": 10,
          "status": "alocada",
          "ocorrencia_id": "string-id-da-ocorrencia-1"
        },
        {
          "id": "string-id-equipe-2",
          "nome": "Equipe Saneamento Leste",
          "atividade_atual": null,
          "quantidade_pessoas": 12,
          "status": "disponivel",
          "ocorrencia_id": null
        }
      ],
      "pagination": {
        "currentPage": 1,
        "itemsPerPage": 10,
        "totalItems": 25,
        "totalPages": 3
      }
    }
    ```

## 3. Modelo de Dados da Resposta (TeamSnapshot)

Cada objeto no array `data` deve ter a seguinte estrutura:

* **`id`**: `string` - O ID da entidade `Equipe`.
* **`nome`**: `string` - O nome da equipe (`Equipe.name`).
* **`atividade_atual`**: `string | null` - O tipo de serviço (`Ocorrencia.service_type`) da ocorrência em execução. Será `null` se o status for "disponivel".
* **`quantidade_pessoas`**: `number` - A capacidade da equipe (`Equipe.capacity`).
* **`status`**: `"disponivel" | "alocada"` - O status calculado da equipe.
* **`ocorrencia_id`**: `string | null` - O ID da ocorrência que a equipe está executando. Será `null` se o status for "disponivel".

## 4. Lógica de Negócio no Backend (Recomendação)

Para construir a resposta do endpoint `GET /api/v1/equipes`, o backend deve executar a seguinte lógica:

1.  **Buscar Ocorrências Ativas:** Identificar todas as ocorrências que estão com `status: "em_execucao"`. Mapear o `equipe_id` para a respectiva ocorrência.
2.  **Buscar Equipes:** Consultar as equipes no banco de dados, já aplicando o filtro de `search` (com uma cláusula `LIKE` ou similar) e a paginação (`LIMIT`/`OFFSET`).
3.  **Construir a Resposta:** Para cada equipe retornada pela consulta, verificar se seu `id` está no mapa de ocorrências ativas:
    * **Se sim:** O `status` é `"alocada"`. Preencher `atividade_atual` e `ocorrencia_id` com os dados da ocorrência correspondente.
    * **Se não:** O `status` é `"disponivel"`. Os campos `atividade_atual` e `ocorrencia_id` devem ser `null`.
4.  **Montar Objeto Final:** Empacotar o array de resultados e os metadados da paginação no formato de resposta especificado.

## 5. Endpoints de CRUD (Gerenciamento)

Além da listagem com status, o sistema precisará de endpoints para gerenciar as equipes (criar, editar, deletar).

* **Autorização:** Acesso restrito, provavelmente a perfis como `adm` ou `cegor/gestor`.

* `POST /api/v1/equipes`: Criar uma nova equipe.
* `GET /api/v1/equipes/{id}`: Obter os detalhes de uma única equipe.
* `PUT /api/v1/equipes/{id}`: Atualizar os dados de uma equipe.
* `DELETE /api/v1/equipes/{id}`: Deletar uma equipe.

# Documentação da API - Cadastro e Edição de Equipes

## 1. Visão Geral

Estes requisitos são baseados no componente React `CadastroEquipes.tsx`. O formulário é utilizado tanto para a criação de novas equipes quanto para a edição de equipes existentes, identificado pela presença de um `:id` na URL. A funcionalidade de upload de arquivos exige que a API aceite requisições do tipo `multipart/form-data`.

## 2. Modelo de Dados Principal: `Equipe`

Este é o modelo de dados que será usado para criar e atualizar uma equipe no banco de dados.

* **`id`**: `string` (UUID) - Chave primária.
* **`nome`**: `string` - Nome da equipe. (Corresponde a `Nome` no formulário)
* **`especialidade`**: `string` - A especialidade da equipe.
* **`unidade`**: `string` - A qual empresa ou unidade a equipe pertence.
* **`observations`**: `string` (opcional) - Observações adicionais.
* **`ativo`**: `boolean` - Status da equipe.
* **`attachments`**: `array de strings` (opcional) - Uma lista de URLs para os arquivos anexados, que serão armazenados em um serviço de storage.

## 3. Endpoints da API

### 3.1. Criar uma Nova Equipe

Cria um novo registro de equipe no sistema.

* **Método:** `POST`
* **URL:** `/api/v1/equipes`
* **Autorização:** Rota protegida. Requer perfil de `adm` ou `cegor/gestor`.
* **Corpo da Requisição (Payload):** `multipart/form-data`
    * `nome`: `string`
    * `especialidade`: `string`
    * `unidade`: `string`
    * `observations` (opcional): `string`
    * `ativo`: `boolean`
    * `attachments` (opcional): `array de arquivos`
* **Resposta de Sucesso (`201 Created`):**
    Retorna o objeto da equipe recém-criada, incluindo os links para os anexos salvos.
    ```json
    {
      "id": "novo-uuid-gerado",
      "nome": "Equipe Alfa",
      "especialidade": "Hídrica",
      "unidade": "Santos Dumont",
      "observations": "Equipe recém-formada.",
      "ativo": true,
      "attachments": [
        "[https://storage.servidor.com/anexos/arquivo1.jpg](https://storage.servidor.com/anexos/arquivo1.jpg)"
      ]
    }
    ```
* **Resposta de Erro (`400 Bad Request`):**
    Se a validação dos dados falhar (ex: campos obrigatórios ausentes).

### 3.2. Obter Dados de uma Equipe para Edição

Busca os dados completos de uma equipe específica para preencher o formulário no modo de edição.

* **Método:** `GET`
* **URL:** `/api/v1/equipes/{id}`
* **Autorização:** Rota protegida.
* **Resposta de Sucesso (`200 OK`):**
    Retorna o objeto completo da equipe.
    ```json
    {
      "id": "uuid-da-equipe",
      "nome": "Equipe Alfa",
      "especialidade": "Hídrica",
      "unidade": "Santos Dumont",
      "observations": "Equipe recém-formada.",
      "ativo": true,
      "attachments": [
        "[https://storage.servidor.com/anexos/arquivo1.jpg](https://storage.servidor.com/anexos/arquivo1.jpg)"
      ]
    }
    ```
* **Resposta de Erro (`404 Not Found`):**
    Se nenhuma equipe com o `{id}` fornecido for encontrada.

### 3.3. Atualizar uma Equipe Existente

Atualiza os dados de uma equipe existente.

* **Método:** `PUT` (ou `PATCH`)
* **URL:** `/api/v1/equipes/{id}`
* **Autorização:** Rota protegida. Requer perfil de `adm` ou `cegor/gestor`.
* **Corpo da Requisição (Payload):** `multipart/form-data`
    * Mesmos campos da criação. O backend deve ser capaz de lidar com a adição de novos arquivos e a remoção de arquivos existentes.
* **Resposta de Sucesso (`200 OK`):**
    Retorna o objeto da equipe atualizado.
* **Respostas de Erro:**
    * `404 Not Found`
    * `400 Bad Request`

## 4. Tratamento de Anexos (Arquivos)

* **Armazenamento:** O backend deve receber os arquivos da requisição `multipart/form-data`, salvá-los em um serviço de armazenamento persistente (como AWS S3, Google Cloud Storage, ou um diretório no servidor) e gerar uma URL de acesso para cada um.
* **Banco de Dados:** As URLs dos arquivos devem ser salvas no campo `attachments` (um array de texto) na tabela de equipes.
* **Atualização:** Ao editar uma equipe, o backend deve comparar a lista de anexos recebida com a existente. Se um anexo foi removido no frontend, o arquivo correspondente deve ser excluído do serviço de armazenamento para evitar o acúmulo de arquivos órfãos.