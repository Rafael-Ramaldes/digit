// JavaScript Principal Unificado

$(document).ready(function() {
    console.log("Sistema inicializando...");

    const digitalizeApp = {
        currentUser: null,
        currentPage: null,
        empresas: [],
        empresaAtual: null,

        init() {
            console.log("Inicializando aplicação...");
            this.checkAuthStatus();
            this.setupEventListeners();
            this.loadInitialPage();
        },

        checkAuthStatus() {
            const userInfo = localStorage.getItem('userInfo');
            if (userInfo) {
                this.currentUser = JSON.parse(userInfo);
                console.log("Usuário logado:", this.currentUser);
            }
        },

        setupEventListeners() {
            // Event listeners para navegação
            $(document).on('click', 'a[href^="#"]', (e) => {
                e.preventDefault();
                const page = $(e.target).attr('href').substring(1);
                this.loadPage(page);
            });

            // Event listeners para formulários
            $(document).on('submit', '#empresaForm', (e) => {
                e.preventDefault();
                this.handleEmpresaSubmit(e);
            });

            // Event listeners para login/logout
            $(document).on('click', '#loginBtn', () => this.showLoginModal());
            $(document).on('click', '#logoutBtn', () => this.logout());

            // Event listeners para botões de empresa
            $(document).on('click', '#btn-editar', () => this.editarEmpresa());
            $(document).on('click', '#btn-excluir', () => this.confirmarExclusao());
            $(document).on('click', '#confirmar-exclusao', () => this.excluirEmpresa());
            $(document).on('click', '#salvar-edicao', () => this.salvarEdicao());
        },

        loadInitialPage() {
            const hash = window.location.hash.substring(1);
            const page = hash || 'home';
            this.loadPage(page);
        },

        loadPage(page) {
            console.log("Carregando página:", page);
            this.currentPage = page;
            window.location.hash = page;

            const container = $('#main-content');

            switch(page) {
                case 'home':
                    this.renderHomePage(container);
                    break;
                case 'cadastro':
                    this.renderCadastroPage(container);
                    break;
                case 'minha-empresa':
                    this.renderMinhaEmpresaPage(container);
                    break;
                case 'admin':
                    this.renderAdminPage(container);
                    break;
                case 'favoritos':
                    this.renderFavoritosPage(container);
                    break;
                default:
                    this.renderHomePage(container);
            }

            this.updateNavigation();
        },

        renderMinhaEmpresaPage(container) {
            if (!this.currentUser) {
                container.html(`
                    <div class="section fade-in">
                        <div class="container text-center">
                            <h2>Acesso Restrito</h2>
                            <p>Você precisa estar logado para ver sua empresa.</p>
                            <button class="btn btn-primary" onclick="digitalizeApp.showLoginModal()">Fazer Login</button>
                        </div>
                    </div>
                `);
                return;
            }

            container.html(`
                <div class="section fade-in">
                    <div class="container">
                        <div class="page-header">
                            <h2>Minha Empresa</h2>
                            <p>Visualize e gerencie os dados da sua empresa</p>
                        </div>

                        <div id="empresa-loading" class="text-center">
                            <div class="spinner-border" role="status">
                                <span class="visually-hidden">Carregando...</span>
                            </div>
                            <p>Carregando dados da empresa...</p>
                        </div>

                        <div id="empresa-content" style="display: none;">
                            <div class="card empresa-detalhes">
                                <div class="card-header d-flex justify-content-between align-items-center">
                                    <h3>Informações da Empresa</h3>
                                    <div class="empresa-actions">
                                        <button type="button" id="btn-editar" class="btn btn-primary me-2">
                                            <i class="fas fa-edit"></i> Editar Informações
                                        </button>
                                        <button type="button" id="btn-excluir" class="btn btn-danger">
                                            <i class="fas fa-trash"></i> Excluir Empresa
                                        </button>
                                    </div>
                                </div>
                                <div class="card-body">
                                    <div class="info-grid">
                                        <div class="info-item">
                                            <label>Razão Social:</label>
                                            <span id="razaoSocial">-</span>
                                        </div>
                                        <div class="info-item">
                                            <label>Nome Fantasia:</label>
                                            <span id="nomeFantasia">-</span>
                                        </div>
                                        <div class="info-item">
                                            <label>CNPJ:</label>
                                            <span id="cnpj">-</span>
                                        </div>
                                        <div class="info-item">
                                            <label>Segmento:</label>
                                            <span id="segmento">-</span>
                                        </div>
                                        <div class="info-item">
                                            <label>Estado:</label>
                                            <span id="estado">-</span>
                                        </div>
                                        <div class="info-item">
                                            <label>Cidade:</label>
                                            <span id="cidade">-</span>
                                        </div>
                                        <div class="info-item">
                                            <label>Endereço:</label>
                                            <span id="endereco">-</span>
                                        </div>
                                        <div class="info-item">
                                            <label>CEP:</label>
                                            <span id="cep">-</span>
                                        </div>
                                        <div class="info-item">
                                            <label>Responsável:</label>
                                            <span id="responsavelNome">-</span>
                                        </div>
                                        <div class="info-item">
                                            <label>Cargo:</label>
                                            <span id="responsavelCargo">-</span>
                                        </div>
                                        <div class="info-item">
                                            <label>E-mail:</label>
                                            <span id="responsavelEmail">-</span>
                                        </div>
                                        <div class="info-item">
                                            <label>Telefone:</label>
                                            <span id="responsavelTelefone">-</span>
                                        </div>
                                        <div class="info-item">
                                            <label>Serviços:</label>
                                            <span id="servicos">-</span>
                                        </div>
                                        <div class="info-item">
                                            <label>Status:</label>
                                            <span id="status" class="status-badge">-</span>
                                        </div>
                                        <div class="info-item">
                                            <label>Observações:</label>
                                            <span id="observacoes">-</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div id="no-empresa" style="display: none;" class="text-center">
                            <div class="alert alert-info">
                                <h4>Nenhuma empresa cadastrada</h4>
                                <p>Você ainda não tem uma empresa cadastrada.</p>
                                <button class="btn btn-primary" onclick="digitalizeApp.loadPage('cadastro')">
                                    Cadastrar Empresa
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Modal de confirmação de exclusão -->
                <div class="modal fade" id="modalConfirmacao" tabindex="-1">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title">Confirmar Exclusão</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                            </div>
                            <div class="modal-body">
                                <p>Tem certeza que deseja excluir permanentemente os dados da sua empresa?</p>
                                <p class="text-danger"><strong>Esta ação não pode ser desfeita!</strong></p>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                                <button type="button" id="confirmar-exclusao" class="btn btn-danger">Confirmar Exclusão</button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Modal de edição -->
                <div class="modal fade" id="modalEdicao" tabindex="-1">
                    <div class="modal-dialog modal-lg">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title">Editar Informações da Empresa</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                            </div>
                            <div class="modal-body">
                                <form id="form-edicao">
                                    <div class="row g-3">
                                        <div class="col-md-6">
                                            <label class="form-label">Razão Social *</label>
                                            <input type="text" class="form-control" id="edit-razaoSocial" required>
                                        </div>
                                        <div class="col-md-6">
                                            <label class="form-label">Nome Fantasia *</label>
                                            <input type="text" class="form-control" id="edit-nomeFantasia" required>
                                        </div>
                                        <div class="col-md-6">
                                            <label class="form-label">CNPJ *</label>
                                            <input type="text" class="form-control" id="edit-cnpj" required>
                                        </div>
                                        <div class="col-md-6">
                                            <label class="form-label">Segmento *</label>
                                            <select class="form-control" id="edit-segmento" required>
                                                <option value="">Selecione o segmento</option>
                                                <option value="Tecnologia">Tecnologia</option>
                                                <option value="Comércio">Comércio</option>
                                                <option value="Serviços">Serviços</option>
                                                <option value="Saúde">Saúde</option>
                                                <option value="Educação">Educação</option>
                                                <option value="Outros">Outros</option>
                                            </select>
                                        </div>
                                        <div class="col-md-6">
                                            <label class="form-label">Estado *</label>
                                            <input type="text" class="form-control" id="edit-estado" required>
                                        </div>
                                        <div class="col-md-6">
                                            <label class="form-label">Cidade *</label>
                                            <input type="text" class="form-control" id="edit-cidade" required>
                                        </div>
                                        <div class="col-md-6">
                                            <label class="form-label">Endereço *</label>
                                            <input type="text" class="form-control" id="edit-endereco" required>
                                        </div>
                                        <div class="col-md-6">
                                            <label class="form-label">CEP *</label>
                                            <input type="text" class="form-control" id="edit-cep" required>
                                        </div>
                                        <div class="col-md-6">
                                            <label class="form-label">Nome do Responsável *</label>
                                            <input type="text" class="form-control" id="edit-responsavelNome" required>
                                        </div>
                                        <div class="col-md-6">
                                            <label class="form-label">Cargo *</label>
                                            <input type="text" class="form-control" id="edit-responsavelCargo" required>
                                        </div>
                                        <div class="col-md-6">
                                            <label class="form-label">E-mail *</label>
                                            <input type="email" class="form-control" id="edit-responsavelEmail" required>
                                        </div>
                                        <div class="col-md-6">
                                            <label class="form-label">Telefone *</label>
                                            <input type="text" class="form-control" id="edit-responsavelTelefone" required>
                                        </div>
                                        <div class="col-12">
                                            <label class="form-label">Serviços de Interesse</label>
                                            <div class="form-check-group">
                                                <div class="form-check">
                                                    <input class="form-check-input" type="checkbox" id="edit-servicoSite" value="site">
                                                    <label class="form-check-label" for="edit-servicoSite">Criação de Site</label>
                                                </div>
                                                <div class="form-check">
                                                    <input class="form-check-input" type="checkbox" id="edit-servicoMarketing" value="marketing">
                                                    <label class="form-check-label" for="edit-servicoMarketing">Marketing Digital</label>
                                                </div>
                                                <div class="form-check">
                                                    <input class="form-check-input" type="checkbox" id="edit-servicoSEO" value="seo">
                                                    <label class="form-check-label" for="edit-servicoSEO">SEO</label>
                                                </div>
                                                <div class="form-check">
                                                    <input class="form-check-input" type="checkbox" id="edit-servicoRedes" value="redes">
                                                    <label class="form-check-label" for="edit-servicoRedes">Gestão de Redes Sociais</label>
                                                </div>
                                                <div class="form-check">
                                                    <input class="form-check-input" type="checkbox" id="edit-servicoSistema" value="sistema">
                                                    <label class="form-check-label" for="edit-servicoSistema">Sistema Personalizado</label>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-12">
                                            <label class="form-label">Observações</label>
                                            <textarea class="form-control" id="edit-observacoes" rows="3"></textarea>
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                                <button type="button" id="salvar-edicao" class="btn btn-primary">Salvar Alterações</button>
                            </div>
                        </div>
                    </div>
                </div>
            `);

            this.carregarDadosEmpresa();
        },

        carregarDadosEmpresa() {
            if (!this.currentUser) return;

            $('#empresa-loading').show();
            $('#empresa-content').hide();
            $('#no-empresa').hide();

            $.ajax({
                url: `/api/empresas/usuario/${this.currentUser.email}`,
                method: 'GET',
                success: (data) => {
                    console.log("Dados carregados:", data);

                    if (data.empresas && data.empresas.length > 0) {
                        // Pegar a empresa mais recente
                        const empresa = data.empresas.sort((a, b) => 
                            new Date(b.dataCadastro) - new Date(a.dataCadastro)
                        )[0];

                        this.empresaAtual = empresa;
                        this.preencherDadosEmpresa(empresa);
                        $('#empresa-loading').hide();
                        $('#empresa-content').show();
                    } else {
                        $('#empresa-loading').hide();
                        $('#no-empresa').show();
                    }
                },
                error: (xhr, status, error) => {
                    console.error("Erro ao carregar empresa:", error);
                    $('#empresa-loading').hide();
                    $('#no-empresa').show();
                }
            });
        },

        preencherDadosEmpresa(empresa) {
            console.log("Preenchendo dados:", empresa);

            $('#razaoSocial').text(empresa.razaoSocial || empresa.nome || '-');
            $('#nomeFantasia').text(empresa.nomeFantasia || empresa.nome || '-');
            $('#cnpj').text(empresa.cnpj || '-');
            $('#segmento').text(empresa.segmento || empresa.categoria || '-');

            // Endereço
            const endereco = empresa.endereco || {};
            $('#estado').text(endereco.estado || endereco.uf || empresa.estado || '-');
            $('#cidade').text(endereco.cidade || empresa.cidade || '-');
            $('#endereco').text(endereco.logradouro || endereco.rua || empresa.endereco || '-');
            $('#cep').text(endereco.cep || empresa.cep || '-');

            // Responsável
            const responsavel = empresa.responsavel || {};
            $('#responsavelNome').text(responsavel.nome || empresa.responsavelNome || '-');
            $('#responsavelCargo').text(responsavel.cargo || empresa.responsavelCargo || '-');
            $('#responsavelEmail').text(responsavel.email || empresa.responsavelEmail || empresa.email || '-');
            $('#responsavelTelefone').text(responsavel.telefone || empresa.responsavelTelefone || empresa.telefone || '-');

            // Serviços
            let servicos = '-';
            if (empresa.servicosInteresse && Array.isArray(empresa.servicosInteresse)) {
                servicos = empresa.servicosInteresse.join(', ');
            }
            $('#servicos').text(servicos);

            // Status
            const status = empresa.status || 'pendente';
            $('#status').text(status.charAt(0).toUpperCase() + status.slice(1))
                      .removeClass()
                      .addClass(`status-badge status-${status}`);

            // Observações
            $('#observacoes').text(empresa.observacoes || empresa.descricao || '-');
        },

        editarEmpresa() {
            if (!this.empresaAtual) {
                alert("Nenhuma empresa para editar.");
                return;
            }

            this.preencherModalEdicao(this.empresaAtual);
            $('#modalEdicao').modal('show');
        },

        preencherModalEdicao(empresa) {
            const endereco = empresa.endereco || {};
            const responsavel = empresa.responsavel || {};

            $('#edit-razaoSocial').val(empresa.razaoSocial || empresa.nome || '');
            $('#edit-nomeFantasia').val(empresa.nomeFantasia || empresa.nome || '');
            $('#edit-cnpj').val(empresa.cnpj || '');
            $('#edit-segmento').val(empresa.segmento || empresa.categoria || '');
            $('#edit-estado').val(endereco.estado || endereco.uf || empresa.estado || '');
            $('#edit-cidade').val(endereco.cidade || empresa.cidade || '');
            $('#edit-endereco').val(endereco.logradouro || endereco.rua || empresa.endereco || '');
            $('#edit-cep').val(endereco.cep || empresa.cep || '');
            $('#edit-responsavelNome').val(responsavel.nome || empresa.responsavelNome || '');
            $('#edit-responsavelCargo').val(responsavel.cargo || empresa.responsavelCargo || '');
            $('#edit-responsavelEmail').val(responsavel.email || empresa.responsavelEmail || empresa.email || '');
            $('#edit-responsavelTelefone').val(responsavel.telefone || empresa.responsavelTelefone || empresa.telefone || '');
            $('#edit-observacoes').val(empresa.observacoes || empresa.descricao || '');

            // Limpar checkboxes
            $('#modalEdicao input[type="checkbox"]').prop('checked', false);

            // Marcar serviços selecionados
            if (empresa.servicosInteresse && Array.isArray(empresa.servicosInteresse)) {
                empresa.servicosInteresse.forEach(servico => {
                    $(`#edit-servico${servico.charAt(0).toUpperCase() + servico.slice(1)}`).prop('checked', true);
                });
            }
        },

        salvarEdicao() {
            if (!this.empresaAtual) {
                alert("Nenhuma empresa para editar.");
                return;
            }

            // Validar formulário
            if (!$('#form-edicao')[0].checkValidity()) {
                $('#form-edicao')[0].reportValidity();
                return;
            }

            // Coletar serviços selecionados
            const servicosInteresse = [];
            $('#modalEdicao input[type="checkbox"]:checked').each(function() {
                servicosInteresse.push($(this).val());
            });

            const dadosAtualizados = {
                razaoSocial: $('#edit-razaoSocial').val(),
                nomeFantasia: $('#edit-nomeFantasia').val(),
                cnpj: $('#edit-cnpj').val(),
                segmento: $('#edit-segmento').val(),
                endereco: {
                    estado: $('#edit-estado').val(),
                    cidade: $('#edit-cidade').val(),
                    logradouro: $('#edit-endereco').val(),
                    cep: $('#edit-cep').val()
                },
                responsavel: {
                    nome: $('#edit-responsavelNome').val(),
                    cargo: $('#edit-responsavelCargo').val(),
                    email: $('#edit-responsavelEmail').val(),
                    telefone: $('#edit-responsavelTelefone').val()
                },
                servicosInteresse: servicosInteresse,
                observacoes: $('#edit-observacoes').val(),
                status: 'pendente' // Status volta para pendente após edição
            };

            $.ajax({
                url: `/api/empresas/${this.empresaAtual.id}`,
                method: 'PUT',
                contentType: 'application/json',
                data: JSON.stringify(dadosAtualizados),
                success: (response) => {
                    alert("Empresa atualizada com sucesso! O status foi alterado para 'pendente' e aguarda nova aprovação.");
                    $('#modalEdicao').modal('hide');
                    this.carregarDadosEmpresa(); // Recarregar dados
                },
                error: (xhr, status, error) => {
                    console.error("Erro ao atualizar empresa:", error);
                    alert("Erro ao atualizar empresa. Tente novamente.");
                }
            });
        },

        confirmarExclusao() {
            if (!this.empresaAtual) {
                alert("Nenhuma empresa para excluir.");
                return;
            }
            $('#modalConfirmacao').modal('show');
        },

        excluirEmpresa() {
            if (!this.empresaAtual) {
                alert("Nenhuma empresa para excluir.");
                return;
            }

            $('#modalConfirmacao').modal('hide');

            $.ajax({
                url: `/api/empresas/${this.empresaAtual.id}`,
                method: 'DELETE',
                success: (response) => {
                    alert("Empresa excluída com sucesso!");
                    this.empresaAtual = null;
                    this.loadPage('cadastro'); // Redirecionar para cadastro
                },
                error: (xhr, status, error) => {
                    console.error("Erro ao excluir empresa:", error);
                    alert("Erro ao excluir empresa. Tente novamente.");
                }
            });
        },

        renderHomePage(container) {
            container.html(`
                <div class="hero-section">
                    <div class="container">
                        <div class="hero-content">
                            <h1>Digitalize sua Empresa</h1>
                            <p>Transforme seu negócio com nossas soluções digitais completas</p>
                            <div class="hero-buttons">
                                <button class="btn btn-primary btn-lg" onclick="digitalizeApp.loadPage('cadastro')">
                                    Começar Agora
                                </button>
                                ${!this.currentUser ? `
                                <button class="btn btn-outline-primary btn-lg" onclick="digitalizeApp.showLoginModal()">
                                    Fazer Login
                                </button>
                                ` : ''}
                            </div>
                        </div>
                    </div>
                </div>
            `);
        },

        renderCadastroPage(container) {
            if (!this.currentUser) {
                container.html(`
                    <div class="section fade-in">
                        <div class="container text-center">
                            <h2>Acesso Restrito</h2>
                            <p>Você precisa estar logado para cadastrar uma empresa.</p>
                            <button class="btn btn-primary" onclick="digitalizeApp.showLoginModal()">Fazer Login</button>
                        </div>
                    </div>
                `);
                return;
            }

            container.html(`
                <div class="section fade-in">
                    <div class="container">
                        <div class="page-header">
                            <h2>Cadastro de Empresa</h2>
                            <p>Preencha os dados da sua empresa para começar a digitalização</p>
                        </div>

                        <div class="form-container">
                            <form id="empresaForm">
                                <div class="form-section">
                                    <h3>Dados da Empresa</h3>
                                    <div class="form-grid">
                                        <div class="form-group">
                                            <label for="razaoSocial">Razão Social *</label>
                                            <input type="text" id="razaoSocial" name="razaoSocial" required>
                                        </div>
                                        <div class="form-group">
                                            <label for="nomeFantasia">Nome Fantasia *</label>
                                            <input type="text" id="nomeFantasia" name="nomeFantasia" required>
                                        </div>
                                        <div class="form-group">
                                            <label for="cnpj">CNPJ *</label>
                                            <input type="text" id="cnpj" name="cnpj" required>
                                        </div>
                                        <div class="form-group">
                                            <label for="segmento">Segmento *</label>
                                            <select id="segmento" name="segmento" required>
                                                <option value="">Selecione o segmento</option>
                                                <option value="Tecnologia">Tecnologia</option>
                                                <option value="Comércio">Comércio</option>
                                                <option value="Serviços">Serviços</option>
                                                <option value="Saúde">Saúde</option>
                                                <option value="Educação">Educação</option>
                                                <option value="Outros">Outros</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div class="form-section">
                                    <h3>Endereço</h3>
                                    <div class="form-grid">
                                        <div class="form-group">
                                            <label for="cep">CEP *</label>
                                            <input type="text" id="cep" name="cep" required>
                                        </div>
                                        <div class="form-group">
                                            <label for="estado">Estado *</label>
                                            <input type="text" id="estado" name="estado" required>
                                        </div>
                                        <div class="form-group">
                                            <label for="cidade">Cidade *</label>
                                            <input type="text" id="cidade" name="cidade" required>
                                        </div>
                                        <div class="form-group">
                                            <label for="endereco">Endereço *</label>
                                            <input type="text" id="endereco" name="endereco" required>
                                        </div>
                                    </div>
                                </div>

                                <div class="form-section">
                                    <h3>Responsável</h3>
                                    <div class="form-grid">
                                        <div class="form-group">
                                            <label for="responsavelNome">Nome *</label>
                                            <input type="text" id="responsavelNome" name="responsavelNome" required>
                                        </div>
                                        <div class="form-group">
                                            <label for="responsavelCargo">Cargo *</label>
                                            <input type="text" id="responsavelCargo" name="responsavelCargo" required>
                                        </div>
                                        <div class="form-group">
                                            <label for="responsavelEmail">E-mail *</label>
                                            <input type="email" id="responsavelEmail" name="responsavelEmail" required>
                                        </div>
                                        <div class="form-group">
                                            <label for="responsavelTelefone">Telefone *</label>
                                            <input type="text" id="responsavelTelefone" name="responsavelTelefone" required>
                                        </div>
                                    </div>
                                </div>

                                <div class="form-section">
                                    <h3>Serviços de Interesse</h3>
                                    <div class="checkbox-group">
                                        <label class="checkbox-item">
                                            <input type="checkbox" name="servicosInteresse" value="site">
                                            <span>Criação de Site</span>
                                        </label>
                                        <label class="checkbox-item">
                                            <input type="checkbox" name="servicosInteresse" value="marketing">
                                            <span>Marketing Digital</span>
                                        </label>
                                        <label class="checkbox-item">
                                            <input type="checkbox" name="servicosInteresse" value="seo">
                                            <span>SEO</span>
                                        </label>
                                        <label class="checkbox-item">
                                            <input type="checkbox" name="servicosInteresse" value="redes">
                                            <span>Gestão de Redes Sociais</span>
                                        </label>
                                        <label class="checkbox-item">
                                            <input type="checkbox" name="servicosInteresse" value="sistema">
                                            <span>Sistema Personalizado</span>
                                        </label>
                                    </div>
                                </div>

                                <div class="form-section">
                                    <div class="form-group">
                                        <label for="observacoes">Observações</label>
                                        <textarea id="observacoes" name="observacoes" rows="4" placeholder="Informações adicionais..."></textarea>
                                    </div>
                                </div>

                                <div class="form-actions">
                                    <button type="submit" class="btn btn-primary">Cadastrar Empresa</button>
                                    <button type="reset" class="btn btn-secondary">Limpar Formulário</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            `);
        },

        updateNavigation() {
            // Atualizar links de navegação baseado no usuário logado
            const navLinks = $('.nav-link');
            const userInfo = $('.user-info');

            if (this.currentUser) {
                userInfo.html(`
                    <span>Olá, ${this.currentUser.name}</span>
                    <button id="logoutBtn" class="btn btn-sm btn-outline-light">Sair</button>
                `);

                // Mostrar/esconder links baseado no tipo de usuário
                if (this.currentUser.tipo === 'admin') {
                    $('.admin-only').show();
                } else {
                    $('.admin-only').hide();
                }
            } else {
                userInfo.html(`
                    <button id="loginBtn" class="btn btn-sm btn-outline-light">Login</button>
                `);
                $('.admin-only').hide();
            }
        },

        showLoginModal() {
            // Implementar modal de login ou redirecionar
            window.location.href = 'login.html';
        },

        logout() {
            localStorage.removeItem('userInfo');
            this.currentUser = null;
            this.loadPage('home');
            this.updateNavigation();
        },

        handleEmpresaSubmit(e) {
            e.preventDefault();

            if (!this.currentUser) {
                alert("Você precisa estar logado para cadastrar uma empresa.");
                return;
            }

            const formData = new FormData(e.target);
            const servicosInteresse = [];

            $('input[name="servicosInteresse"]:checked').each(function() {
                servicosInteresse.push($(this).val());
            });

            const empresaData = {
                razaoSocial: formData.get('razaoSocial'),
                nomeFantasia: formData.get('nomeFantasia'),
                cnpj: formData.get('cnpj'),
                segmento: formData.get('segmento'),
                endereco: {
                    cep: formData.get('cep'),
                    estado: formData.get('estado'),
                    cidade: formData.get('cidade'),
                    logradouro: formData.get('endereco')
                },
                responsavel: {
                    nome: formData.get('responsavelNome'),
                    cargo: formData.get('responsavelCargo'),
                    email: formData.get('responsavelEmail'),
                    telefone: formData.get('responsavelTelefone')
                },
                servicosInteresse: servicosInteresse,
                observacoes: formData.get('observacoes'),
                status: 'pendente',
                dataCadastro: new Date().toISOString()
            };

            $.ajax({
                url: '/api/empresas',
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(empresaData),
                success: (response) => {
                    alert("Empresa cadastrada com sucesso! Aguarde a aprovação do administrador.");
                    $('#empresaForm')[0].reset();
                    this.loadPage('minha-empresa');
                },
                error: (xhr, status, error) => {
                    console.error("Erro ao cadastrar empresa:", error);
                    alert("Erro ao cadastrar empresa. Tente novamente.");
                }
            });
        }
    };

    // Inicializar aplicação
    digitalizeApp.init();

    // Tornar disponível globalmente
    window.digitalizeApp = digitalizeApp;
});