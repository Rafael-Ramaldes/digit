$(document).ready(function() {
    console.log("Carregando dados da empresa...");

    // Função para preencher o formulário
    function preencherFormulario(empresa) {
        console.log("Dados recebidos:", empresa);
        
        // Dados básicos
        $("#razaoSocial").text(empresa.razaoSocial || "Não informado");
        $("#nomeFantasia").text(empresa.nomeFantasia || "Não informado");
        $("#cnpj").text(empresa.cnpj || "Não informado");
        $("#segmento").text(empresa.segmento || "Não informado");

        // Endereço (verifica se está no formato com objeto endereço ou direto)
        const endereco = empresa.endereco || empresa;
        $("#estado").text(endereco.estado || endereco.uf || "Não informado");
        $("#cidade").text(endereco.cidade || "Não informado");
        $("#rua").text(endereco.rua || endereco.logradouro || "Não informado");
        $("#cep").text(endereco.cep || "Não informado");

        // Responsável
        $("#responsavelNome").text(empresa.responsavelNome || empresa.nomeResponsavel || "Não informado");
        $("#responsavelCargo").text(empresa.responsavelCargo || empresa.cargoResponsavel || "Não informado");
        $("#responsavelEmail").text(empresa.responsavelEmail || empresa.emailResponsavel || "Não informado");
        $("#responsavelTelefone").text(empresa.responsavelTelefone || empresa.telefoneResponsavel || "Não informado");

        // Serviços de interesse
        if (empresa.servicosInteresse) {
            $('input[name="servicosInteresse"]').prop('checked', false);
            empresa.servicosInteresse.forEach(servico => {
                $(`input[name="servicosInteresse"][value="${servico}"]`).prop("checked", true);
            });
        }

        // Observações
        $("#observacoes").val(empresa.observacoes || "");
    }

    // Carrega os dados da empresa do usuário logado
    function carregarDadosEmpresa() {
        // Verificar se há usuário logado
        const userInfo = localStorage.getItem('userInfo');
        if (!userInfo) {
            alert("Você precisa estar logado para ver seus dados.");
            window.location.href = '/login.html';
            return;
        }

        const user = JSON.parse(userInfo);
        const userEmail = user.email;

        $.ajax({
            url: `/api/empresas/usuario/${userEmail}`,
            method: 'GET',
            dataType: 'json',
            success: function(data) {
                console.log("Dados recebidos com sucesso:", data);
                if (data.length > 0) {
                    // Pegar a primeira empresa (ou a mais recente)
                    const empresa = data.sort((a, b) => new Date(b.dataCadastro) - new Date(a.dataCadastro))[0];
                    preencherFormulario(empresa);
                } else {
                    alert("Nenhuma empresa encontrada para este usuário.");
                }
            },
            error: function(xhr, status, error) {
                console.error("Erro ao carregar dados:", status, error);
                if (xhr.status === 404) {
                    alert("Nenhuma empresa cadastrada encontrada.");
                } else {
                    alert("Erro ao carregar dados da empresa.");
                }
            }
        });
    }

    // Inicia o carregamento dos dados
    carregarDadosEmpresa();

    // Editar
    $("#empresaForm").on("submit", function(e) {
        e.preventDefault();
        alert("A edição dos dados da empresa ainda não está implementada.");
    });
});