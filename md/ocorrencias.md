# Documentação da API - Recurso: Ocorrências

## 1. Visão Geral e Modelo de Dados

Este documento define os endpoints da API para gerenciar Ocorrências, com base nos componentes `ListaOcorrencias.tsx`, `actionButtons.tsx` e `OcorrenciaFormPage.tsx`. A API deve suportar a listagem com filtragem avançada, criação, visualização detalhada e modificação de estado das ocorrências. Toda a lógica de filtragem, paginação e autorização **deve ser implementada no backend**.

### 1.1. Modelo de Dados Principal: `Ocorrencia`

| Campo | Tipo | Obrigatório | Descrição |
| :--- | :--- | :--- | :--- |
| `id` | `string` | - | Chave primária (UUID). |
| `protocol` | `string` | - | Protocolo único gerado pelo sistema (ex: OCR-2025-XXXX). |
| `status` | `enum` | Sim | Status atual da ocorrência (ex: 'criada', 'em_execucao'). |
| `priority` | `enum` | Sim | 'baixa', 'media' ou 'alta'. |
| `occurrence_date` | `string` | Sim | Data da ocorrência no formato `YYYY-MM-DD`. |
| `occurrence_type` | `string` | Sim | Tipo da ocorrência (ex: 'limp_canal', 'Especial'). |
| `origin` | `string` | Sim | Origem da solicitação (ex: 'Presencial', 'Ofício'). |
| `origin_number` | `string` | Sim | Protocolo/número do sistema de origem. |
| `description` | `string` | Sim | Descrição detalhada da ocorrência. |
| `public_equipment_id` | `string` | Sim | ID do equipamento público. |
| `fiscal_id` | `string` | Sim | ID do fiscal responsável pela vistoria. |
| `regional_id` | `string` | Sim | ID da regional à qual a ocorrência pertence. |
| `equipe_id` | `string` | Não | ID da equipe designada. |
| `observations` | `string` | Não | Observações adicionais. |
| `attachments` | `array` | Não | Lista de objetos contendo URLs de anexos. |
| `should_schedule`| `boolean`| Sim | Se um agendamento manual é necessário. |
| `schedule_date`| `string` | Condicional | Obrigatório se `should_schedule` for `true`. |
| `special_schedule_date`| `string` | Condicional | Obrigatório se `occurrence_type` for `'Especial'`. |
| ... | ... | ... | Outros campos de endereço, data e aprovação. |

## 2. Endpoints de Leitura (GET)

### 2.1. Listar Ocorrências (com filtros)

Este é o endpoint principal para a tela de listagem, retornando ocorrências de forma paginada e filtrada.

* **Método:** `GET`
* **URL:** `/api/v1/ocorrencias`
* **Autorização (Regras Críticas):**
    * **Perfil `regional`:** Retorna APENAS as ocorrências onde `ocorrencia.regional_id` corresponde ao `regional_id` do usuário.
    * **Perfil `empresa`:** Retorna APENAS as ocorrências com status `autorizada`, `agendada`, `em_execucao` ou `executada`.
    * **Perfis `cegor` e `adm`:** Visibilidade total, sujeita aos filtros.
* **Parâmetros de Query (Filtros):**
    | Parâmetro | Tipo | Descrição |
    | :--- | :--- | :--- |
    | `search` | `string` | Busca textual em `protocolo` e `descricao`. |
    | `status` | `string` | Filtra por um status específico. |
    | `priority`| `string` | Filtra por prioridade. |
    | `regionalId`| `string` | Filtra por ID da Regional. |
    | `bairroId` | `string` | Filtra por ID do Bairro. |
    | `equipeId` | `string` | Filtra por ID da Equipe. |
    | `tipoServico`| `string` | Filtra pelo tipo de serviço. |
    | `origem` | `string` | Filtra pela origem da ocorrência. |
    | `dataInicio`| `string` | Data inicial para filtrar `updated_at` (Formato `YYYY-MM-DD`).|
    | `dataFim` | `string` | Data final para filtrar `updated_at` (Formato `YYYY-MM-DD`).|
    | `page` | `number` | Número da página (padrão: 1). |
    | `limit` | `number` | Itens por página (padrão: 10). |
* **Resposta de Sucesso (`200 OK`):**
    ```json
    {
      "data": [
        {
          "id": "1",
          "protocol": "OCR-2024-009",
          "service_type": "Manutenção",
          "priority": "media",
          "status": "em_execucao",
          "updated_at": "2025-07-23T09:30:00Z",
          "bairro_name": "Parangaba",
          "regional_name": "Regional II",
          "equipe_name": "Equipe Manutenção Sul"
        }
      ],
      "pagination": {
        "currentPage": 1,
        "itemsPerPage": 10,
        "totalItems": 18,
        "totalPages": 2
      }
    }
    ```

### 2.2. Visualizar Ocorrência Única

Busca os dados detalhados de uma ocorrência, incluindo histórico e anexos.

* **Método:** `GET`
* **URL:** `/api/v1/ocorrencias/{id}`
* **Autorização:** Rota autenticada. As mesmas regras de visibilidade da listagem se aplicam.
* **Resposta de Sucesso (`200 OK`):** Retorna um objeto rico com todos os detalhes.
    ```json
    {
      "id": "1",
      "protocol": "OCR-2024-001",
      "status": "criada",
      // ...todos os campos da ocorrência
      "regional_name": "Centro-Sul",
      "fiscal_name": "João Silva (Fiscal)",
      "territory_name": "Centro",
      "attachments": [
        { "id": "anexo-1", "url": "[https://storage.servidor.com/path/to/foto1.jpg](https://storage.servidor.com/path/to/foto1.jpg)", "type": "image", "category": "Iniciais" }
      ],
      "timeline": [
        { "timestamp": "2025-07-14T10:00:00Z", "user": "Operador CEGOR", "action": "Ocorrência criada." }
      ]
    }
    ```

## 3. Endpoint de Escrita (POST)

### 3.1. Criar Nova Ocorrência

Cria um novo registro de ocorrência a partir do formulário de cadastro.

* **Método:** `POST`
* **URL:** `/api/v1/ocorrencias`
* **Autorização:** Rota protegida. O perfil (ex: `cegor/operador`) deve ser validado.
* **Corpo da Requisição:** `multipart/form-data` (ver campos na Seção 1.1).
* **Lógica de Negócio do Backend:**
    1.  **Validação:** Replicar todas as validações do frontend, incluindo as condicionais.
    2.  **Geração de Protocolo:** Criar um protocolo único.
    3.  **Status Inicial:** Salvar com status `'criada'`.
    4.  **Tratamento de Anexos:** Salvar arquivos em storage e associar as URLs à ocorrência.
* **Resposta de Sucesso (`201 Created`):** Retorna o objeto da ocorrência recém-criada.

## 4. Endpoints de Ações (PUT/PATCH)

Endpoints para modificar o estado de uma ocorrência existente.

### 4.1. Direcionar Ocorrência

* **URL:** `/api/v1/ocorrencias/{id}/direcionar`
* **Corpo da Requisição:** `{ "equipeId": "string-id-da-equipe" }`
* **Lógica:** Atribui `equipe_id` e atualiza o `status` (ex: para `encaminhada`).

### 4.2. Pausar Execução

* **URL:** `/api/v1/ocorrencias/{id}/pausar`
* **Corpo da Requisição:** `{ "motivo": "Aguardando material." }` (opcional)
* **Lógica:** Altera o `status` para `pausada` e registra o motivo.

### 4.3. Retomar Execução

* **URL:** `/api/v1/ocorrencias/{id}/retomar`
* **Lógica:** Altera o `status` de `pausada` para `em_execucao`.

### 4.4. Atualização de Status Genérica

* **URL:** `/api/v1/ocorrencias/{id}/status`
* **Corpo da Requisição:** `{ "status": "autorizada" }`
* **Lógica:** Altera o status, validando se a transição é permitida pela "máquina de estados".

## 5. Modelos de Dados Auxiliares

* **Attachment:** O objeto de anexo retornado pela API.
    ```json
    {
      "id": "string",
      "url": "string",
      "type": "'image' | 'pdf' | ...",
      "category": "'Iniciais' | 'Vistoria' | ..."
    }
    ```
* **TimelineEvent:** O objeto de evento da linha do tempo.
    ```json
    {
      "timestamp": "string (ISO 8601)",
      "user": "string",
      "action": "string",
      "details": "string (opcional)"
    }
    ```